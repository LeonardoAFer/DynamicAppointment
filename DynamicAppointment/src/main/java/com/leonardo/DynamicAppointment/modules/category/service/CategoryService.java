package com.leonardo.DynamicAppointment.modules.category.service;

import com.leonardo.DynamicAppointment.core.util.UpdateHelper;
import com.leonardo.DynamicAppointment.modules.category.dto.CategoryRequestDTO;
import com.leonardo.DynamicAppointment.modules.category.dto.CategoryResponseDTO;
import com.leonardo.DynamicAppointment.modules.category.entity.Category;
import com.leonardo.DynamicAppointment.modules.category.repository.CategoryRepository;
import com.leonardo.DynamicAppointment.modules.services.repository.BusinessServiceRepository;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CategoryService implements ICategoryService {

    private final CategoryRepository categoryRepository;
    private final BusinessServiceRepository businessServiceRepository;
    private final ModelMapper mapper;

    CategoryService(CategoryRepository categoryRepository,
                    BusinessServiceRepository businessServiceRepository,
                    ModelMapper mapper) {
        this.categoryRepository = categoryRepository;
        this.businessServiceRepository = businessServiceRepository;
        this.mapper = mapper;
    }

    @Override
    public List<CategoryResponseDTO> findAll() {
        return categoryRepository.findAll().stream()
                .map(c -> mapper.map(c, CategoryResponseDTO.class))
                .toList();
    }

    @Override
    public CategoryResponseDTO create(CategoryRequestDTO request) {
        Category category = mapper.map(request, Category.class);
        category.setCreatedAt(LocalDateTime.now());
        categoryRepository.save(category);
        return mapper.map(category, CategoryResponseDTO.class);
    }

    @Override
    public CategoryResponseDTO fetch(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));
        return mapper.map(category, CategoryResponseDTO.class);
    }

    @Override
    public CategoryResponseDTO update(Long id, CategoryRequestDTO request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));

        UpdateHelper.updateIfPresent(request.getName(), category::setName);
        UpdateHelper.updateIfPresent(request.getDescription(), category::setDescription);
        category.setUpdatedAt(LocalDateTime.now());

        categoryRepository.save(category);
        return mapper.map(category, CategoryResponseDTO.class);
    }

    @Override
    public void delete(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoria não encontrada."));

        if (businessServiceRepository.existsByCategoryId(id)) {
            throw new IllegalStateException("Não é possível excluir esta categoria pois existem serviços vinculados.");
        }

        categoryRepository.delete(category);
    }

    @Override
    public Category findEntityById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));
    }
}
