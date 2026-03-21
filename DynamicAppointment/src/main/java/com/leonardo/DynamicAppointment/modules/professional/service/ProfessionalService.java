package com.leonardo.DynamicAppointment.modules.professional.service;

import com.leonardo.DynamicAppointment.core.util.UpdateHelper;
import com.leonardo.DynamicAppointment.modules.professional.dto.ProfessionalRequestDTO;
import com.leonardo.DynamicAppointment.modules.professional.dto.ProfessionalResponseDTO;
import com.leonardo.DynamicAppointment.modules.professional.entity.Professional;
import com.leonardo.DynamicAppointment.modules.professional.repository.ProfessionalRepository;
import com.leonardo.DynamicAppointment.modules.professional.status.ProfessionalStatus;
import com.leonardo.DynamicAppointment.modules.services.entity.BusinessService;
import com.leonardo.DynamicAppointment.modules.services.repository.BusinessServiceRepository;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Service
public class ProfessionalService {

    private final ProfessionalRepository professionalRepository;
    private final BusinessServiceRepository businessServiceRepository;
    private final ModelMapper mapper;

    ProfessionalService(ProfessionalRepository professionalRepository,
                        BusinessServiceRepository businessServiceRepository,
                        ModelMapper mapper) {
        this.professionalRepository = professionalRepository;
        this.businessServiceRepository = businessServiceRepository;
        this.mapper = mapper;
    }

    public ProfessionalResponseDTO create(ProfessionalRequestDTO request) {
        Professional professional = mapper.map(request, Professional.class);
        professional.setCreatedAt(LocalDateTime.now());
        professional.setStatus(ProfessionalStatus.ACTIVE);

        if (request.getServiceIds() != null && !request.getServiceIds().isEmpty()) {
            Set<BusinessService> services = new HashSet<>(businessServiceRepository.findAllById(request.getServiceIds()));
            professional.setServices(services);
        }

        professionalRepository.save(professional);
        return mapper.map(professional, ProfessionalResponseDTO.class);
    }

    public ProfessionalResponseDTO fetch(Long id) {
        Professional professional = professionalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Professional not found with id: " + id));
        return mapper.map(professional, ProfessionalResponseDTO.class);
    }

    public ProfessionalResponseDTO update(Long id, ProfessionalRequestDTO request) {
        Professional professional = professionalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Professional not found with id: " + id));

        UpdateHelper.updateIfPresent(request.getName(), professional::setName);
        UpdateHelper.updateIfPresent(request.getStatus(), professional::setStatus);
        UpdateHelper.updateIfPresent(request.getEmail(), professional::setEmail);
        professional.setUpdatedAt(LocalDateTime.now());

        UpdateHelper.updateIfPresent(request.getServiceIds(), ids -> {
            Set<BusinessService> services = new HashSet<>(businessServiceRepository.findAllById(ids));
            professional.setServices(services);
        });

        professionalRepository.save(professional);
        return mapper.map(professional, ProfessionalResponseDTO.class);
    }

    public void delete(Long id) {
        if (!professionalRepository.existsById(id)) {
            throw new RuntimeException("Professional not found with id: " + id);
        }
        professionalRepository.deleteById(id);
    }

}
