package com.leonardo.DynamicAppointment.modules.professional.service;

import com.leonardo.DynamicAppointment.modules.professional.dto.ProfessionalRequestDTO;
import com.leonardo.DynamicAppointment.modules.professional.dto.ProfessionalResponseDTO;
import com.leonardo.DynamicAppointment.modules.professional.entity.Professional;
import com.leonardo.DynamicAppointment.modules.services.entity.BusinessService;

import java.util.List;
import java.util.Set;

public interface IProfessionalService {

    List<ProfessionalResponseDTO> fetchAll();

    ProfessionalResponseDTO create(ProfessionalRequestDTO request);

    ProfessionalResponseDTO fetch(Long id);

    ProfessionalResponseDTO update(Long id, ProfessionalRequestDTO request);

    void delete(Long id);

    Professional findEntityById(Long id);

    void associateService(Set<Long> professionalIds, BusinessService service);

    void dissociateServiceFromAll(BusinessService service);

}
