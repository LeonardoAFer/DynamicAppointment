package com.leonardo.DynamicAppointment.modules.appointment.service;

import com.leonardo.DynamicAppointment.core.util.UpdateHelper;
import com.leonardo.DynamicAppointment.modules.appointment.dto.AppointmentRequestDTO;
import com.leonardo.DynamicAppointment.modules.appointment.dto.AppointmentResponseDTO;
import com.leonardo.DynamicAppointment.modules.appointment.entity.Appointment;
import com.leonardo.DynamicAppointment.modules.appointment.exception.ResourceNotFoundException;
import com.leonardo.DynamicAppointment.modules.appointment.repository.AppointmentRepository;
import com.leonardo.DynamicAppointment.modules.appointment.status.AppointmentStatus;
import com.leonardo.DynamicAppointment.modules.professional.dto.ProfessionalRequestDTO;
import com.leonardo.DynamicAppointment.modules.professional.dto.ProfessionalResponseDTO;
import com.leonardo.DynamicAppointment.modules.professional.entity.Professional;
import com.leonardo.DynamicAppointment.modules.professional.repository.ProfessionalRepository;
import com.leonardo.DynamicAppointment.modules.professional.status.ProfessionalStatus;
import com.leonardo.DynamicAppointment.modules.services.dto.BusinessServiceRequestDTO;
import com.leonardo.DynamicAppointment.modules.services.dto.BusinessServiceResponseDTO;
import com.leonardo.DynamicAppointment.modules.services.entity.BusinessService;
import com.leonardo.DynamicAppointment.modules.services.repository.BusinessServiceRepository;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.ui.ModelMap;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final ProfessionalRepository professionalRepository;
    private final BusinessServiceRepository businessServiceRepository;
    private final ModelMapper mapper;

    AppointmentService(AppointmentRepository appointmentRepository, ModelMapper mapper, ProfessionalRepository professionalRepository, BusinessServiceRepository businessServiceRepository) {
        this.appointmentRepository = appointmentRepository;
        this.professionalRepository = professionalRepository;
        this.businessServiceRepository = businessServiceRepository;
        this.mapper = mapper;
    }

    public AppointmentResponseDTO create(AppointmentRequestDTO request) {
        Appointment appointment = mapper.map(request, Appointment.class);
        appointment.setCreatedAt(LocalDateTime.now());
        appointment.setStatus(AppointmentStatus.CONFIRMED);

        Professional professional = professionalRepository.findById(request.getProfessionalId())
                .orElseThrow(() -> new ResourceNotFoundException("Professional not found"));

        BusinessService service = businessServiceRepository.findById(request.getServiceId())
                .orElseThrow(() -> new ResourceNotFoundException("Service not found"));

        appointment.setProfessional(professional);
        appointment.setService(service);

        return mapper.map(appointment, AppointmentResponseDTO.class);
        //Por enquanto sem acess token
    }

    public AppointmentResponseDTO fetch(Long id){
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found for respective Id:" + id));

        return mapper.map(appointment, AppointmentResponseDTO.class);
    }

    public AppointmentResponseDTO update(Long id, AppointmentRequestDTO request){
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found for respective Id:" + id));

        appointment.setUpdatedAt(LocalDateTime.now());
        UpdateHelper.updateIfPresent(request.getGuestName(), appointment::setGuestName);
        UpdateHelper.updateIfPresent(request.getGuestPhone(), appointment::setGuestPhone);

        BusinessService service = businessServiceRepository.findById(request.getServiceId())
                .orElseThrow(() -> new ResourceNotFoundException("Service not found for respective Id:" + request.getServiceId()));
        appointment.setService(service);

        Professional professional = professionalRepository.findById(request.getProfessionalId())
                .orElseThrow(() -> new ResourceNotFoundException("Professional not found for respective Id:" + request.getProfessionalId()));
        appointment.setProfessional(professional);

        appointmentRepository.save(appointment);
        return mapper.map(appointment, AppointmentResponseDTO.class);
    }

    public void delete(Long id) {
        if (!appointmentRepository.existsById(id)) {
            throw new RuntimeException("Appointment not found with id: " + id);
        }
        appointmentRepository.deleteById(id);
    }
}


