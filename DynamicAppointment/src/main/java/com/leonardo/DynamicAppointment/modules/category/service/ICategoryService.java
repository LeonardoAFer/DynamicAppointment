package com.leonardo.DynamicAppointment.modules.category.service;

import com.leonardo.DynamicAppointment.modules.category.dto.CategoryRequestDTO;
import com.leonardo.DynamicAppointment.modules.category.dto.CategoryResponseDTO;
import com.leonardo.DynamicAppointment.modules.category.entity.Category;

import java.util.List;

public interface ICategoryService {

    List<CategoryResponseDTO> findAll();

    CategoryResponseDTO create(CategoryRequestDTO request);

    CategoryResponseDTO fetch(Long id);

    CategoryResponseDTO update(Long id, CategoryRequestDTO request);

    void delete(Long id);

    Category findEntityById(Long id);
}
