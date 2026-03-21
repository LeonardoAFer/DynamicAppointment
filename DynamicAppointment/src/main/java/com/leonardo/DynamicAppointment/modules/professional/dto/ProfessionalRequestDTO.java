package com.leonardo.DynamicAppointment.modules.professional.dto;

import com.leonardo.DynamicAppointment.modules.professional.status.ProfessionalStatus;
import lombok.Data;

import java.util.HashSet;
import java.util.Set;

@Data
public class ProfessionalRequestDTO {

    private Long id;

    private String name;

    private String email;

    private ProfessionalStatus status;

    private Set<Long> serviceIds = new HashSet<>();

}