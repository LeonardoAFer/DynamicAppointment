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
=======
import com.leonardo.DynamicAppointment.modules.services.dto.BusinessServiceSummaryDTO;
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
    @ManyToMany
    @JoinTable(
            name = "professional_services",
            joinColumns = @JoinColumn(name = "professional_id"),
            inverseJoinColumns = @JoinColumn(name = "service_id")
    )
    private Set<BusinessService> services = new HashSet<>();
=======
    private Set<BusinessServiceSummaryDTO> services = new HashSet<>();
>>>>>>> Stashed changes

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

}