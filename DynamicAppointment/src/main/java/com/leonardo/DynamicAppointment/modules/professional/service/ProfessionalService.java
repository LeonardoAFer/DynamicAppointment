package com.leonardo.DynamicAppointment.modules.professional.service;

import com.leonardo.DynamicAppointment.modules.professional.dto.ProfessionalRequestDTO;
import com.leonardo.DynamicAppointment.modules.professional.dto.ProfessionalResponseDTO;
import com.leonardo.DynamicAppointment.modules.professional.entity.Professional;
import com.leonardo.DynamicAppointment.modules.professional.repository.ProfessionalRepository;
import com.leonardo.DynamicAppointment.modules.professional.status.ProfessionalStatus;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class ProfessionalService {

    private final ProfessionalRepository professionalRepository;
    private final ModelMapper mapper;

    ProfessionalService(ProfessionalRepository professionalRepository, ModelMapper mapper) {
        this.professionalRepository = professionalRepository;
        this.mapper = mapper;
    }

//    public Professional create(Professional request) {
//        request.setCreatedAt(LocalDateTime.now());
//        request.setStatus(ProfessionalStatus.ACTIVE);
//        return professionalRepository.save(request);
//    }

    public ProfessionalResponseDTO create(ProfessionalRequestDTO request) {
        Professional professional = mapper.map(request, Professional.class);
        professional.setCreatedAt(LocalDateTime.now());
        professional.setStatus(ProfessionalStatus.ACTIVE);
        professionalRepository.save(professional);
        return mapper.map(professional, ProfessionalResponseDTO.class);
    }

//    public Professional fetch(Long id) {
//        return professionalRepository.findById(id).orElse(null);
//    }

    public ProfessionalResponseDTO fetch(Long id) {
        Professional professional = professionalRepository.findById(id).orElse(null);
        return mapper.map(professional, ProfessionalResponseDTO.class);
    }

//    public Professional update(Long id, Professional request) {
//        Professional professional = professionalRepository.findById(id).orElse(null);
//
//        professional.setName(request.getName());
//        professional.setStatus(request.getStatus());
//        professional.setEmail(request.getEmail());
//        professional.setUpdatedAt(LocalDateTime.now());
//
//        return professionalRepository.save(professional);
//    }

    public ProfessionalResponseDTO update(Long id, ProfessionalRequestDTO request) {
        Professional fetchProfessional = professionalRepository.findById(id).orElse(null);

        fetchProfessional.setName(request.getName());
        fetchProfessional.setStatus(request.getStatus());
        fetchProfessional.setEmail(request.getEmail());
        fetchProfessional.setUpdatedAt(LocalDateTime.now());
        Professional professional = professionalRepository.save(fetchProfessional);

        return mapper.map(professional, ProfessionalResponseDTO.class);

    }

    public void delete(Long id) {
        professionalRepository.deleteById(id);
    }

}
