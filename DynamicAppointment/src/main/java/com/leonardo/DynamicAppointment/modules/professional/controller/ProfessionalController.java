package com.leonardo.DynamicAppointment.modules.professional.controller;

import com.leonardo.DynamicAppointment.modules.professional.dto.ProfessionalRequestDTO;
import com.leonardo.DynamicAppointment.modules.professional.dto.ProfessionalResponseDTO;
import com.leonardo.DynamicAppointment.modules.professional.service.IProfessionalService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/professionals")
public class ProfessionalController {

    private final IProfessionalService professionalService;

    ProfessionalController(IProfessionalService professionalService) {
        this.professionalService = professionalService;
    }

    @GetMapping
    public ResponseEntity<List<ProfessionalResponseDTO>> listProfessionals() {
        return new ResponseEntity<>(professionalService.findAll(), HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<ProfessionalResponseDTO> createProfessional(@RequestBody ProfessionalRequestDTO request) {
        return new ResponseEntity<>(professionalService.create(request), HttpStatus.CREATED);
    }

    @GetMapping("{id}")
    public ResponseEntity<ProfessionalResponseDTO> fetchProfessional(@PathVariable Long id) {
        return new ResponseEntity<>(professionalService.fetch(id), HttpStatus.OK);
    }

    @PutMapping("{id}")
    public ResponseEntity<ProfessionalResponseDTO> updateProfessional(@PathVariable Long id, @RequestBody ProfessionalRequestDTO request) {
        return new ResponseEntity<>(professionalService.update(id, request), HttpStatus.OK);
    }

    @DeleteMapping("{id}")
    public ResponseEntity<Void> deleteProfessional(@PathVariable Long id) {
        professionalService.delete(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

}
