package com.leonardo.DynamicAppointment.modules.services.dto;

import com.leonardo.DynamicAppointment.modules.professional.dto.ProfessionalSummaryDTO;
import com.leonardo.DynamicAppointment.modules.services.category.ServiceCategory;
import com.leonardo.DynamicAppointment.modules.services.status.ServiceStatus;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Data
public class BusinessServiceResponseDTO {

    private Long id;

    private String name;

    private String description;

    private ServiceCategory category;

    private Integer durationMinutes;

    private Integer cleanupMinutes;

    private BigDecimal price;

    private ServiceStatus status;

    private Set<ProfessionalSummaryDTO> professionals = new HashSet<>();

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

}
