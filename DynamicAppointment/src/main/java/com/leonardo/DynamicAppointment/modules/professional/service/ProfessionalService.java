package com.leonardo.DynamicAppointment.modules.professional.service;

import com.leonardo.DynamicAppointment.modules.professional.entity.Professional;
import com.leonardo.DynamicAppointment.modules.professional.repository.ProfessionalRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class ProfessionalService {
    //TODO ALTERAR ENTITY POR DTO REQUEST/RESPONSE
    private final ProfessionalRepository professionalRepository;

    ProfessionalService(ProfessionalRepository professionalRepository) {
        this.professionalRepository = professionalRepository;
    }

    public Professional create(Professional request) {
        request.setCreatedAt(LocalDateTime.now());
        return professionalRepository.save(request);
    }

    public Professional fetch(Long id) {
        return professionalRepository.findById(id).orElse(null);
    }

    public Professional update(Long id, Professional request) {
        Professional professional = professionalRepository.findById(id).orElse(null);

        professional.setName(request.getName());
        professional.setStatus(request.getStatus());
        professional.setEmail(request.getEmail());
        professional.setUpdatedAt(LocalDateTime.now());

        return professionalRepository.save(professional);
    }

    public void delete(Long id) {
        professionalRepository.deleteById(id);
    }

}
