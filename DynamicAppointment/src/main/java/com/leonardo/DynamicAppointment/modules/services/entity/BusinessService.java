package com.leonardo.DynamicAppointment.modules.services.entity;

import com.leonardo.DynamicAppointment.modules.professional.entity.Professional;
import com.leonardo.DynamicAppointment.modules.services.category.ServiceCategory;
import com.leonardo.DynamicAppointment.modules.services.status.ServiceStatus;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Data
@EqualsAndHashCode(exclude = "professionals")
@Entity
@Table(name = "services")
public class BusinessService {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String description;

    @Enumerated(EnumType.STRING)
    private ServiceCategory category;

    private Integer durationMinutes;

    private Integer cleanupMinutes;

    private BigDecimal price;

    @Enumerated(EnumType.STRING)
    private ServiceStatus status;

    @ManyToMany(mappedBy = "services")
    private Set<Professional> professionals = new HashSet<>();

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
