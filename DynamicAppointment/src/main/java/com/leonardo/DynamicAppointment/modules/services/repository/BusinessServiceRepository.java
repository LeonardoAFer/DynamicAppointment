package com.leonardo.DynamicAppointment.modules.services.repository;

import com.leonardo.DynamicAppointment.modules.services.entity.BusinessService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BusinessServiceRepository extends JpaRepository<BusinessService, Long> {
}
