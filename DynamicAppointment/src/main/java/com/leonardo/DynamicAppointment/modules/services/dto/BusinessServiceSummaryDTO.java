package com.leonardo.DynamicAppointment.modules.services.dto;

import com.leonardo.DynamicAppointment.modules.services.category.ServiceCategory;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class BusinessServiceSummaryDTO {
    private Long id;
    private String name;
    private ServiceCategory category;
    private BigDecimal price;
    private Integer durationMinutes;
}