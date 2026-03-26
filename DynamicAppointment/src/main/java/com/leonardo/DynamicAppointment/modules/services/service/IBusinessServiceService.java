package com.leonardo.DynamicAppointment.modules.services.service;

import com.leonardo.DynamicAppointment.modules.services.dto.BusinessServiceRequestDTO;
import com.leonardo.DynamicAppointment.modules.services.dto.BusinessServiceResponseDTO;
import com.leonardo.DynamicAppointment.modules.services.entity.BusinessService;

public interface IBusinessServiceService {

    BusinessServiceResponseDTO create(BusinessServiceRequestDTO request);

    BusinessServiceResponseDTO fetch(Long id);

    BusinessServiceResponseDTO update(Long id, BusinessServiceRequestDTO request);

    void delete(Long id);

    BusinessService findEntityById(Long id);

}
