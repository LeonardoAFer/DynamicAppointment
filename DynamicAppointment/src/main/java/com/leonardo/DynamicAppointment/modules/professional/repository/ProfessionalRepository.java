package com.leonardo.DynamicAppointment.modules.professional.repository;

import com.leonardo.DynamicAppointment.modules.professional.entity.Professional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProfessionalRepository extends JpaRepository<Professional, Long> {
}
