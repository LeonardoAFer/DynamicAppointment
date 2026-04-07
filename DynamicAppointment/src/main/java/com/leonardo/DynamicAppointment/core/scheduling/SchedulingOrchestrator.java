package com.leonardo.DynamicAppointment.core.scheduling;

import com.leonardo.DynamicAppointment.core.availability.AvailabilityEngine;
import com.leonardo.DynamicAppointment.core.domain.Slot;
import com.leonardo.DynamicAppointment.infrastructure.email.EmailService;
import com.leonardo.DynamicAppointment.modules.appointment.dto.AppointmentRequestDTO;
import com.leonardo.DynamicAppointment.modules.appointment.dto.AppointmentResponseDTO;
import com.leonardo.DynamicAppointment.modules.appointment.service.IAppointmentService;
import com.leonardo.DynamicAppointment.modules.professional.entity.Professional;
import com.leonardo.DynamicAppointment.modules.professional.service.IProfessionalService;
import com.leonardo.DynamicAppointment.modules.services.entity.BusinessService;
import com.leonardo.DynamicAppointment.modules.services.service.IBusinessServiceService;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

//Orquestrador de agendamento (faz todo o fluxo de agendamento)
@Component
public class SchedulingOrchestrator {

    private final AvailabilityEngine availabilityEngine;
    private final EmailService emailService;
    private final IAppointmentService appointmentService;
    private final IProfessionalService professionalService;
    private final IBusinessServiceService businessServiceService;

    SchedulingOrchestrator(AvailabilityEngine availabilityEngine, EmailService emailService,
                           IAppointmentService appointmentService, IProfessionalService professionalService,
                           IBusinessServiceService businessServiceService) {
        this.availabilityEngine = availabilityEngine;
        this.emailService = emailService;
        this.appointmentService = appointmentService;
        this.professionalService = professionalService;
        this.businessServiceService = businessServiceService;
    }

    public AppointmentResponseDTO scheduleAppointment(AppointmentRequestDTO request) {
        Professional professional = professionalService.findEntityById(request.getProfessionalId());
        BusinessService service = businessServiceService.findEntityById(request.getServiceId());

        LocalTime requestedStart = request.getScheduledAt().toLocalTime();
        LocalTime requestedEnd = requestedStart
                .plusMinutes(service.getDurationMinutes())
                .plusMinutes(service.getCleanupMinutes());

        if (requestedStart.isBefore(professional.getStartTime()) || requestedEnd.isAfter(professional.getEndTime())) {
            throw new IllegalStateException("O horario solicitado esta fora do expediente do profissional ("
                    + professional.getStartTime() + " - " + professional.getEndTime() + ")");
        }

        LocalDate date = request.getScheduledAt().toLocalDate();
        List<Slot> scheduledSlots = availabilityEngine.fetchScheduledSlots(
                request.getProfessionalId(), date.atStartOfDay(), date.atTime(LocalTime.MAX));

        boolean hasConflict = scheduledSlots.stream()
                .anyMatch(scheduled -> requestedStart.isBefore(scheduled.getEndTime())
                        && requestedEnd.isAfter(scheduled.getStartTime()));

        if (hasConflict) {
            throw new IllegalStateException("O horario solicitado conflita com um agendamento existente");
        }

        AppointmentResponseDTO response = appointmentService.create(request);

        sendConfirmationEmail(response);

        return response;
    }

    public List<Slot> availableSlots(LocalDate date, Long professionalId, Long serviceId) {
        List<Slot> totalSlots = availabilityEngine.calcAvailabilitySlots(date, professionalId, serviceId);

        LocalDateTime startDate = date.atStartOfDay();
        LocalDateTime endDate = date.atTime(LocalTime.MAX);

        List<Slot> scheduledSlots = availabilityEngine.fetchScheduledSlots(professionalId, startDate, endDate);

        return totalSlots.stream()
                .filter(slot -> scheduledSlots.stream()
                        .noneMatch(scheduled ->
                                slot.getStartTime().isBefore(scheduled.getEndTime())
                                        && slot.getEndTime().isAfter(scheduled.getStartTime())))
                .toList();
    }

    private void sendConfirmationEmail(AppointmentResponseDTO appointment) {
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm");

        String cancelUrl = "http://localhost:8080/api/appointments/guest/" + appointment.getAccessToken() + "/cancel";

        String html = loadTemplate("templates/appointment-confirmation.html", Map.of(
                "guestName", appointment.getGuestName(),
                "serviceName", appointment.getService().getName(),
                "professionalName", appointment.getProfessional().getName(),
                "date", appointment.getScheduledAt().format(dateFormatter),
                "time", appointment.getScheduledAt().format(timeFormatter),
                "duration", String.valueOf(appointment.getService().getDurationMinutes()),
                "cancelUrl", cancelUrl
        ));

        emailService.sendHtmlEmail(
                appointment.getGuestEmail(),
                "Agendamento Confirmado - " + appointment.getService().getName(),
                html
        );
    }

    private String loadTemplate(String templatePath, Map<String, String> variables) {
        try {
            ClassPathResource resource = new ClassPathResource(templatePath);
            String template = new String(resource.getInputStream().readAllBytes(), StandardCharsets.UTF_8);

            for (Map.Entry<String, String> entry : variables.entrySet()) {
                template = template.replace("{{" + entry.getKey() + "}}", entry.getValue());
            }

            return template;
        } catch (IOException e) {
            throw new RuntimeException("Falha ao carregar template: " + templatePath, e);
        }
    }

}
