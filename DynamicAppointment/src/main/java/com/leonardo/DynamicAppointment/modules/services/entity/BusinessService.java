package com.leonardo.DynamicAppointment.modules.services.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "services")
public class BusinessService {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String description;

    //TODO enum category (HAIR, BEARD ....)

    private Integer durationMinutes;

    private Integer cleanupMinutes;

    private BigDecimal price;

    //TODO enum ServiceStatus  (ACTIVE, INACTIVE)

    //TODO @ManyToMany(mappedBy = "services")
    //    private Set<Professional> professionals;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
