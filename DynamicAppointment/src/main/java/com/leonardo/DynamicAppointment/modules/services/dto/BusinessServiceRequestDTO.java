package com.leonardo.DynamicAppointment.modules.services.dto;

import com.leonardo.DynamicAppointment.modules.services.category.ServiceCategory;
import com.leonardo.DynamicAppointment.modules.services.status.ServiceStatus;
import lombok.Data;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;

@Data
public class BusinessServiceRequestDTO {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String description;

    private ServiceCategory category;

    private Integer durationMinutes;

    private Integer cleanupMinutes;

    private BigDecimal price;

    private ServiceStatus status;

    private Set<Long> professionalIds = new HashSet<>();

}