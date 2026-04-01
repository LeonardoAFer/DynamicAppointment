package com.leonardo.DynamicAppointment.modules.services.service;

import com.leonardo.DynamicAppointment.core.util.UpdateHelper;
import com.leonardo.DynamicAppointment.modules.professional.service.IProfessionalService;
import com.leonardo.DynamicAppointment.modules.services.dto.BusinessServiceRequestDTO;
import com.leonardo.DynamicAppointment.modules.services.dto.BusinessServiceResponseDTO;
import com.leonardo.DynamicAppointment.modules.services.entity.BusinessService;
import com.leonardo.DynamicAppointment.modules.services.repository.BusinessServiceRepository;
import org.hibernate.sql.Update;
import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

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
    public List<BusinessServiceResponseDTO> findAll() {
        return businessServiceRepository.findAll().stream()
                .map(s -> mapper.map(s, BusinessServiceResponseDTO.class))
                .toList();
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
        UpdateHelper.updateIfPresent(request.getCategory(), businessService::setCategory);
        UpdateHelper.updateIfPresent(request.getName(), businessService::setName);
        UpdateHelper.updateIfPresent(request.getDescription(), businessService::setDescription);
        UpdateHelper.updateIfPresent(request.getPrice(), businessService::setPrice);
        UpdateHelper.updateIfPresent(request.getCleanupMinutes(), businessService::setCleanupMinutes);
        UpdateHelper.updateIfPresent(request.getDurationMinutes(), businessService::setDurationMinutes);

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
