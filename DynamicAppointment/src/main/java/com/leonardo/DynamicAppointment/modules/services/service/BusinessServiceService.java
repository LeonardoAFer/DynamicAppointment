package com.leonardo.DynamicAppointment.modules.services.service;

import com.leonardo.DynamicAppointment.modules.services.dto.BusinessServiceRequestDTO;
import com.leonardo.DynamicAppointment.modules.services.dto.BusinessServiceResponseDTO;
import com.leonardo.DynamicAppointment.modules.services.entity.BusinessService;
import com.leonardo.DynamicAppointment.modules.services.repository.BusinessServiceRepository;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class BusinessServiceService {

    private final BusinessServiceRepository businessServiceRepository;
    private final ModelMapper mapper;

    BusinessServiceService(BusinessServiceRepository businessServiceRepository, ModelMapper mapper) {
        this.businessServiceRepository = businessServiceRepository;
        this.mapper = mapper;
    }

    public BusinessServiceResponseDTO create(BusinessServiceRequestDTO request) {
        BusinessService businessService = mapper.map(request, BusinessService.class);
        businessService.setCreatedAt(LocalDateTime.now());
        businessServiceRepository.save(businessService);
        return mapper.map(businessService, BusinessServiceResponseDTO.class);
    }

    public BusinessServiceResponseDTO fetch(Long id) {
        BusinessService businessService = businessServiceRepository.findById(id).orElse(null);
        return mapper.map(businessService, BusinessServiceResponseDTO.class);
    }

    public BusinessServiceResponseDTO update(Long id, BusinessServiceRequestDTO request) {
        BusinessService businessService = businessServiceRepository.findById(id).orElseThrow(() -> new RuntimeException("Service not found with id: " + id));

        businessService.setUpdatedAt(LocalDateTime.now());
        businessService.setCategory(request.getCategory());
        businessService.setName(request.getName());
        businessService.setDescription(request.getDescription());
        businessService.setPrice(request.getPrice());
        businessService.setCleanupMinutes(request.getCleanupMinutes());
        businessService.setDurationMinutes(request.getDurationMinutes());
        businessService.setProfessionals(request.getProfessionals());

        businessServiceRepository.save(businessService);

        return mapper.map(businessService, BusinessServiceResponseDTO.class);
    }

    public void delete(Long id){
        businessServiceRepository.deleteById(id);
    }

}
