package com.leonardo.DynamicAppointment.modules.services.service;

import com.leonardo.DynamicAppointment.modules.professional.service.IProfessionalService;
import com.leonardo.DynamicAppointment.modules.services.dto.BusinessServiceRequestDTO;
import com.leonardo.DynamicAppointment.modules.services.dto.BusinessServiceResponseDTO;
import com.leonardo.DynamicAppointment.modules.services.entity.BusinessService;
import com.leonardo.DynamicAppointment.modules.services.repository.BusinessServiceRepository;
import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class BusinessServiceService implements IBusinessServiceService {

    private final BusinessServiceRepository businessServiceRepository;
    private final IProfessionalService professionalService;
    private final ModelMapper mapper;

    BusinessServiceService(BusinessServiceRepository businessServiceRepository,
                           @Lazy IProfessionalService professionalService,
                           ModelMapper mapper) {
        this.businessServiceRepository = businessServiceRepository;
        this.professionalService = professionalService;
        this.mapper = mapper;
    }

    @Override
    public BusinessServiceResponseDTO create(BusinessServiceRequestDTO request) {
        BusinessService businessService = mapper.map(request, BusinessService.class);
        businessService.setCreatedAt(LocalDateTime.now());

        businessServiceRepository.save(businessService);

        if (request.getProfessionalIds() != null && !request.getProfessionalIds().isEmpty()) {
            professionalService.associateService(request.getProfessionalIds(), businessService);
        }

        return mapper.map(businessService, BusinessServiceResponseDTO.class);
    }

    @Override
    public BusinessServiceResponseDTO fetch(Long id) {
        BusinessService businessService = businessServiceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Service not found with id: " + id));
        return mapper.map(businessService, BusinessServiceResponseDTO.class);
    }

    @Override
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
            professionalService.dissociateServiceFromAll(businessService);
            professionalService.associateService(request.getProfessionalIds(), businessService);
        }

        return mapper.map(businessService, BusinessServiceResponseDTO.class);
    }

    @Override
    public void delete(Long id) {
        if (!businessServiceRepository.existsById(id)) {
            throw new RuntimeException("Service not found with id: " + id);
        }
        businessServiceRepository.deleteById(id);
    }

    @Override
    public BusinessService findEntityById(Long id) {
        return businessServiceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Service not found with id: " + id));
    }
}
