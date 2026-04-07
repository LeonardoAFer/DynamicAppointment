package com.leonardo.DynamicAppointment.modules.services.controller;

import com.leonardo.DynamicAppointment.modules.services.dto.BusinessServiceRequestDTO;
import com.leonardo.DynamicAppointment.modules.services.dto.BusinessServiceResponseDTO;
import com.leonardo.DynamicAppointment.modules.services.service.IBusinessServiceService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/services")
public class BusinessServiceController {

    private final IBusinessServiceService businessServiceService;

    BusinessServiceController(IBusinessServiceService businessServiceService) {
        this.businessServiceService = businessServiceService;
    }

    @GetMapping
    public ResponseEntity<List<BusinessServiceResponseDTO>> listServices() {
        return new ResponseEntity<>(businessServiceService.findAll(), HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<BusinessServiceResponseDTO> createBusiness(@RequestBody BusinessServiceRequestDTO request) {
        return new ResponseEntity<>(businessServiceService.create(request), HttpStatus.CREATED);
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
    public ResponseEntity<Void> deleteBusiness(@PathVariable Long id) {
        businessServiceService.delete(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

}
