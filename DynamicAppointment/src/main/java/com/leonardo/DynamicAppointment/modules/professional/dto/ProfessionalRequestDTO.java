package com.leonardo.DynamicAppointment.modules.professional.dto;

import com.leonardo.DynamicAppointment.modules.professional.status.ProfessionalStatus;
<<<<<<< Updated upstream
import com.leonardo.DynamicAppointment.modules.services.entity.BusinessService;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import lombok.Data;

import java.time.LocalDateTime;
=======
import lombok.Data;

>>>>>>> Stashed changes
import java.util.HashSet;
import java.util.Set;

@Data
public class ProfessionalRequestDTO {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String email;

    private ProfessionalStatus status;

    private Set<Long> serviceIds = new HashSet<>();

}