package com.leonardo.DynamicAppointment.modules.professional.dto;

import com.leonardo.DynamicAppointment.modules.professional.status.ProfessionalStatus;
import com.leonardo.DynamicAppointment.modules.services.dto.BusinessServiceSummaryDTO;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Data
public class ProfessionalResponseDTO {

    private Long id;

    private String name;

    private String email;

    private ProfessionalStatus status;

    private Set<BusinessServiceSummaryDTO> services = new HashSet<>();

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

}