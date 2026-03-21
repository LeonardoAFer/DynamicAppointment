package com.leonardo.DynamicAppointment.modules.services.dto;

import com.leonardo.DynamicAppointment.modules.professional.entity.Professional;
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

<<<<<<< Updated upstream
    @ManyToMany(mappedBy = "services")
    private Set<Professional> professionals = new HashSet<>();
=======
    private Set<ProfessionalSummaryDTO> professionals = new HashSet<>();
>>>>>>> Stashed changes

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

}
