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
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

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

        String date = appointment.getScheduledAt().format(dateFormatter);
        String time = appointment.getScheduledAt().format(timeFormatter);
        String guestName = appointment.getGuestName();
        String professionalName = appointment.getProfessional().getName();
        String serviceName = appointment.getService().getName();
        int duration = appointment.getService().getDurationMinutes();
        String cancelUrl = "http://localhost:8080/api/appointments/guest/" + appointment.getAccessToken() + "/cancel";

        String html = """
                <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
                    <div style="background: linear-gradient(135deg, #1a1a2e 0%%, #16213e 100%%); padding: 40px 30px; text-align: center;">
                        <h1 style="color: #e0c097; margin: 0; font-size: 28px; font-weight: 600; letter-spacing: 1px;">Agendamento Confirmado</h1>
                        <p style="color: #a0a0b0; margin-top: 8px; font-size: 14px;">Seu horario foi reservado com sucesso</p>
                    </div>
                    <div style="padding: 30px;">
                        <p style="color: #333; font-size: 16px; margin-bottom: 25px;">Ola, <strong>%s</strong>! Aqui estao os detalhes do seu agendamento:</p>
                        <table style="width: 100%%; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; color: #888; font-size: 14px;">Servico</td>
                                <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; color: #333; font-size: 14px; font-weight: 600; text-align: right;">%s</td>
                            </tr>
                            <tr>
                                <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; color: #888; font-size: 14px;">Profissional</td>
                                <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; color: #333; font-size: 14px; font-weight: 600; text-align: right;">%s</td>
                            </tr>
                            <tr>
                                <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; color: #888; font-size: 14px;">Data</td>
                                <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; color: #333; font-size: 14px; font-weight: 600; text-align: right;">%s</td>
                            </tr>
                            <tr>
                                <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; color: #888; font-size: 14px;">Horario</td>
                                <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; color: #333; font-size: 14px; font-weight: 600; text-align: right;">%s</td>
                            </tr>
                            <tr>
                                <td style="padding: 12px 0; color: #888; font-size: 14px;">Duracao</td>
                                <td style="padding: 12px 0; color: #333; font-size: 14px; font-weight: 600; text-align: right;">%d min</td>
                            </tr>
                        </table>
                        <div style="margin-top: 30px; text-align: center;">
                            <a href="%s" style="display: inline-block; background-color: #dc3545; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-size: 14px; font-weight: 600; letter-spacing: 0.5px;">Cancelar Agendamento</a>
                        </div>
                        <p style="color: #aaa; font-size: 12px; text-align: center; margin-top: 25px;">Se voce nao solicitou este agendamento, ignore este e-mail.</p>
                    </div>
                </div>
                """.formatted(guestName, serviceName, professionalName, date, time, duration, cancelUrl);

        emailService.sendHtmlEmail(
                appointment.getGuestEmail(),
                "Agendamento Confirmado - " + serviceName,
                html
        );
    }

}
