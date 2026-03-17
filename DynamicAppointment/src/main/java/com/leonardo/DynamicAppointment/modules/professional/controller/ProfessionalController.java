package com.leonardo.DynamicAppointment.modules.professional.controller;

import com.leonardo.DynamicAppointment.modules.professional.dto.ProfessionalRequestDTO;
import com.leonardo.DynamicAppointment.modules.professional.dto.ProfessionalResponseDTO;
import com.leonardo.DynamicAppointment.modules.professional.entity.Professional;
import com.leonardo.DynamicAppointment.modules.professional.service.ProfessionalService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/professionals")
public class ProfessionalController {

    //    // Endpoints
//    POST   /api/professionals
//    GET    /api/professionals/{id}
//    PUT    /api/professionals/{id}
//    DELETE /api/professionals/{id}

    private final ProfessionalService professionalService;

    ProfessionalController(ProfessionalService professionalService) {
        this.professionalService = professionalService;
    }

/*    @PostMapping
    public ResponseEntity<Professional> createProfessional(@RequestBody Professional professional) {
        return new ResponseEntity<>(professionalService.create(professional), HttpStatus.CREATED);
    }*/

    @PostMapping
    public ResponseEntity<ProfessionalResponseDTO> createProfessional(@RequestBody ProfessionalRequestDTO professionalRequestDTO) {
        return new ResponseEntity<>(professionalService.create(professionalRequestDTO), HttpStatus.CREATED);
    }

//    @GetMapping("{id}")
//    public ResponseEntity<Professional> fetchProfessional(@PathVariable Long id){
//        return new ResponseEntity<>(professionalService.fetch(id), HttpStatus.OK);
//    }

    @GetMapping("{id}")
    public ResponseEntity<ProfessionalResponseDTO> fetchProfessional(@PathVariable Long id) {
        return new ResponseEntity<>(professionalService.fetch(id), HttpStatus.OK);
    }

//    @PutMapping("{id}")
//    public ResponseEntity<Professional> updateProfessional(@PathVariable Long id, @RequestBody Professional professional){
//        return new ResponseEntity<>(professionalService.update(id, professional), HttpStatus.OK);
//    }

    @PutMapping("{id}")
    public ResponseEntity<ProfessionalResponseDTO> updateProfessional(@PathVariable Long id, @RequestBody ProfessionalRequestDTO request) {
        return new ResponseEntity<>(professionalService.update(id, request), HttpStatus.OK);
    }

    @DeleteMapping("{id}")
    public void deleteProfessional(@PathVariable Long id) {
        professionalService.delete(id);
    }

}
