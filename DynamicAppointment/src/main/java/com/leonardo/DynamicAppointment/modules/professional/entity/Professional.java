package com.leonardo.DynamicAppointment.modules.professional.entity;

import com.leonardo.DynamicAppointment.modules.professional.status.ProfessionalStatus;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "professionals")
public class Professional {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String email;

    @Enumerated(EnumType.STRING)
    private ProfessionalStatus status;

    //TODO @ManyToMany map to BusinessService

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
