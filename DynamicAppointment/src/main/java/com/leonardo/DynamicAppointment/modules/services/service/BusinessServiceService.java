package com.leonardo.DynamicAppointment.modules.services.service;

import com.leonardo.DynamicAppointment.modules.professional.entity.Professional;
import com.leonardo.DynamicAppointment.modules.professional.repository.ProfessionalRepository;
import com.leonardo.DynamicAppointment.modules.services.dto.BusinessServiceRequestDTO;
import com.leonardo.DynamicAppointment.modules.services.dto.BusinessServiceResponseDTO;
import com.leonardo.DynamicAppointment.modules.services.entity.BusinessService;
import com.leonardo.DynamicAppointment.modules.services.repository.BusinessServiceRepository;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Service
public class BusinessServiceService {

    private final BusinessServiceRepository businessServiceRepository;
    private final ProfessionalRepository professionalRepository;
    private final ModelMapper mapper;

    BusinessServiceService(BusinessServiceRepository businessServiceRepository,
                           ProfessionalRepository professionalRepository,
                           ModelMapper mapper) {
        this.businessServiceRepository = businessServiceRepository;
        this.professionalRepository = professionalRepository;
        this.mapper = mapper;
    }

    public BusinessServiceResponseDTO create(BusinessServiceRequestDTO request) {
        BusinessService businessService = mapper.map(request, BusinessService.class);
        businessService.setCreatedAt(LocalDateTime.now());

        businessServiceRepository.save(businessService);

        if (request.getProfessionalIds() != null && !request.getProfessionalIds().isEmpty()) {
            Set<Professional> professionals = new HashSet<>(professionalRepository.findAllById(request.getProfessionalIds()));
            for (Professional professional : professionals) {
                professional.getServices().add(businessService);
            }
            professionalRepository.saveAll(professionals);
        }

        return mapper.map(businessService, BusinessServiceResponseDTO.class);
    }

    public BusinessServiceResponseDTO fetch(Long id) {
        BusinessService businessService = businessServiceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Service not found with id: " + id));
        return mapper.map(businessService, BusinessServiceResponseDTO.class);
    }

    public BusinessServiceResponseDTO update(Long id, BusinessServiceRequestDTO request) {
        BusinessService businessService = businessServiceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Service not found with id: " + id));

        businessService.setUpdatedAt(LocalDateTime.now());
        businessService.setCategory(request.getCategory());
        businessService.setName(request.getName());
        businessService.setDescription(request.getDescription());
        businessService.setPrice(request.getPrice());
        businessService.setCleanupMinutes(request.getCleanupMinutes());
        businessService.setDurationMinutes(request.getDurationMinutes());

        businessServiceRepository.save(businessService);

        if (request.getProfessionalIds() != null) {
            Set<Professional> currentProfessionals = new HashSet<>(professionalRepository.findAll());
            for (Professional professional : currentProfessionals) {
                professional.getServices().remove(businessService);
            }
            professionalRepository.saveAll(currentProfessionals);

            Set<Professional> newProfessionals = new HashSet<>(professionalRepository.findAllById(request.getProfessionalIds()));
            for (Professional professional : newProfessionals) {
                professional.getServices().add(businessService);
            }
            professionalRepository.saveAll(newProfessionals);
        }

        return mapper.map(businessService, BusinessServiceResponseDTO.class);
    }

    public void delete(Long id) {
        if (!businessServiceRepository.existsById(id)) {
            throw new RuntimeException("Service not found with id: " + id);
        }
        businessServiceRepository.deleteById(id);
    }
}
