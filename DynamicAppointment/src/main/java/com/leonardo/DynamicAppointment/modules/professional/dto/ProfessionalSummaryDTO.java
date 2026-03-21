package com.leonardo.DynamicAppointment.modules.professional.dto;

import com.leonardo.DynamicAppointment.modules.professional.status.ProfessionalStatus;
import lombok.Data;

@Data
public class ProfessionalSummaryDTO {
    private Long id;
    private String name;
    private String email;
    private ProfessionalStatus status;
}
