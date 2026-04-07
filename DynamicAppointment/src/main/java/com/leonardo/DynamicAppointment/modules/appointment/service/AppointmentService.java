package com.leonardo.DynamicAppointment.modules.appointment.service;

import com.leonardo.DynamicAppointment.core.domain.Slot;
import com.leonardo.DynamicAppointment.core.util.UpdateHelper;
import com.leonardo.DynamicAppointment.infrastructure.email.EmailService;
import com.leonardo.DynamicAppointment.modules.appointment.dto.AppointmentRequestDTO;
import com.leonardo.DynamicAppointment.modules.appointment.dto.AppointmentResponseDTO;
import com.leonardo.DynamicAppointment.modules.appointment.entity.Appointment;
import com.leonardo.DynamicAppointment.modules.appointment.exception.ResourceNotFoundException;
import com.leonardo.DynamicAppointment.modules.appointment.repository.AppointmentRepository;
import com.leonardo.DynamicAppointment.modules.appointment.status.AppointmentStatus;
import com.leonardo.DynamicAppointment.modules.professional.entity.Professional;
import com.leonardo.DynamicAppointment.modules.professional.service.IProfessionalService;
import com.leonardo.DynamicAppointment.modules.services.entity.BusinessService;
import com.leonardo.DynamicAppointment.modules.services.service.IBusinessServiceService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class AppointmentService implements IAppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final IProfessionalService professionalService;
    private final IBusinessServiceService businessServiceService;
    private final EmailService emailService;
    private final ModelMapper mapper;

    @Value("${app.frontend.url:http://localhost:5173}")
    private String frontendUrl;

    AppointmentService(AppointmentRepository appointmentRepository, ModelMapper mapper, IProfessionalService professionalService, IBusinessServiceService businessServiceService, EmailService emailService) {
        this.appointmentRepository = appointmentRepository;
        this.professionalService = professionalService;
        this.businessServiceService = businessServiceService;
        this.emailService = emailService;
        this.mapper = mapper;
    }

    @Override
    public AppointmentResponseDTO create(AppointmentRequestDTO request) {
        Appointment appointment = mapper.map(request, Appointment.class);
        appointment.setCreatedAt(LocalDateTime.now());
        appointment.setStatus(AppointmentStatus.CONFIRMED);

        Professional professional = professionalService.findEntityById(request.getProfessionalId());

        BusinessService service = businessServiceService.findEntityById(request.getServiceId());

        appointment.setProfessional(professional);
        appointment.setService(service);
        appointment.setAccessToken(UUID.randomUUID().toString());
        appointmentRepository.save(appointment);

        sendConfirmationEmail(appointment);

        return mapper.map(appointment, AppointmentResponseDTO.class);
    }

    @Override
    public AppointmentResponseDTO fetch(Long id){
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found for respective Id:" + id));

        return mapper.map(appointment, AppointmentResponseDTO.class);
    }

    @Override
    public List<Slot> fetchAppointmentByDate(Long professionalId, LocalDateTime startDate, LocalDateTime endDate){
       List<Slot> slots = new ArrayList<>();
       List<Appointment> appointments = appointmentRepository.fetchAppointmentByDate(professionalId, startDate, endDate);
       if(appointments == null){
           return null;
       }
       for(Appointment appointment : appointments){
            Slot slot = new Slot();
            slot.setStartTime(appointment.getScheduledAt().toLocalTime());
            slot.setEndTime(appointment.getScheduledAt().plusMinutes(appointment.getService().getDurationMinutes()).toLocalTime());
            slots.add(slot);
       }
        return slots;
    }

    @Override
    public AppointmentResponseDTO update(Long id, AppointmentRequestDTO request){
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found for respective Id:" + id));

        appointment.setUpdatedAt(LocalDateTime.now());
        UpdateHelper.updateIfPresent(request.getGuestName(), appointment::setGuestName);
        UpdateHelper.updateIfPresent(request.getGuestPhone(), appointment::setGuestPhone);

        BusinessService service = businessServiceService.findEntityById(request.getServiceId());
        appointment.setService(service);

        Professional professional = professionalService.findEntityById(request.getProfessionalId());
        appointment.setProfessional(professional);

        appointmentRepository.save(appointment);
        return mapper.map(appointment, AppointmentResponseDTO.class);
    }

    @Override
    public void delete(Long id) {
        if (!appointmentRepository.existsById(id)) {
            throw new RuntimeException("Appointment not found with id: " + id);
        }
        appointmentRepository.deleteById(id);
    }

    @Override
    public AppointmentResponseDTO fetchByToken(String token) {
        Appointment appointment = appointmentRepository.findByAccessToken(token)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found for token: " + token));
        return mapper.map(appointment, AppointmentResponseDTO.class);
    }

    @Override
    public AppointmentResponseDTO cancelByToken(String token) {
        Appointment appointment = appointmentRepository.findByAccessToken(token)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found for token: " + token));
        appointment.setStatus(AppointmentStatus.CANCELLED);
        appointment.setUpdatedAt(LocalDateTime.now());
        appointmentRepository.save(appointment);
        return mapper.map(appointment, AppointmentResponseDTO.class);
    }

    private void sendConfirmationEmail(Appointment appointment) {
        try {
            ClassPathResource resource = new ClassPathResource("templates/appointment-confirmation.html");
            String template = new String(resource.getInputStream().readAllBytes(), StandardCharsets.UTF_8);

            LocalDateTime scheduledAt = appointment.getScheduledAt();
            String date = scheduledAt.format(DateTimeFormatter.ofPattern("dd/MM/yyyy"));
            String time = scheduledAt.format(DateTimeFormatter.ofPattern("HH:mm"));
            String cancelUrl = frontendUrl + "/meu-agendamento/" + appointment.getAccessToken();

            String html = template
                    .replace("{{guestName}}", appointment.getGuestName())
                    .replace("{{serviceName}}", appointment.getService().getName())
                    .replace("{{professionalName}}", appointment.getProfessional().getName())
                    .replace("{{date}}", date)
                    .replace("{{time}}", time)
                    .replace("{{duration}}", String.valueOf(appointment.getService().getDurationMinutes()))
                    .replace("{{cancelUrl}}", cancelUrl);

            emailService.sendHtmlEmail(appointment.getGuestEmail(), "Agendamento Confirmado", html);
        } catch (IOException e) {
            throw new RuntimeException("Falha ao carregar template de email", e);
        }
    }
}
