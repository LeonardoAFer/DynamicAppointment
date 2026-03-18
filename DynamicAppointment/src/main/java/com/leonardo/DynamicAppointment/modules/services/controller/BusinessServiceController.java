package com.leonardo.DynamicAppointment.modules.services.controller;

import com.leonardo.DynamicAppointment.modules.professional.dto.ProfessionalResponseDTO;
import com.leonardo.DynamicAppointment.modules.services.dto.BusinessServiceRequestDTO;
import com.leonardo.DynamicAppointment.modules.services.dto.BusinessServiceResponseDTO;
import com.leonardo.DynamicAppointment.modules.services.service.BusinessServiceService;
import org.apache.coyote.Response;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

//    // Endpoints
//    POST   /api/services
//    GET    /api/services/{id}
//    PUT    /api/services/{id}
//    DELETE /api/services/{id}

@RestController
@RequestMapping("/api/services")
public class BusinessServiceController {

    private final BusinessServiceService businessServiceService;

    BusinessServiceController(BusinessServiceService businessServiceService) {
        this.businessServiceService = businessServiceService;
    }

    @PostMapping
    public ResponseEntity<BusinessServiceResponseDTO> createBusiness(@RequestBody BusinessServiceRequestDTO request) {
        return new ResponseEntity<>(businessServiceService.create(request), HttpStatus.OK);
    }

    @GetMapping("{id}")
    public ResponseEntity<BusinessServiceResponseDTO> fetchBusiness(@PathVariable Long id) {
        return new ResponseEntity<>(businessServiceService.fetch(id), HttpStatus.OK);
    }

    @PutMapping("{id}")
    public ResponseEntity<BusinessServiceResponseDTO> updateBusiness(@PathVariable Long id, @RequestBody BusinessServiceRequestDTO request) {
        return new ResponseEntity<>(businessServiceService.update(id, request), HttpStatus.OK);
    }

    @DeleteMapping("{id}")
    public void deleteBusiness(@PathVariable Long id) {
        businessServiceService.delete(id);
    }


}
