package com.leonardo.DynamicAppointment.core.scheduling;

import com.leonardo.DynamicAppointment.core.availability.AvailabilityEngine;
import com.leonardo.DynamicAppointment.core.domain.Slot;
import com.leonardo.DynamicAppointment.infrastructure.email.EmailService;
import com.leonardo.DynamicAppointment.modules.appointment.dto.AppointmentResponseDTO;
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

    SchedulingOrchestrator(AvailabilityEngine availabilityEngine, EmailService emailService) {
        this.availabilityEngine = availabilityEngine;
        this.emailService = emailService;
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