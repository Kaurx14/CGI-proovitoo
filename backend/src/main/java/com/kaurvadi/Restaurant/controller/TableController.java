package com.kaurvadi.Restaurant.controller;

import com.kaurvadi.Restaurant.service.TableRecommendationService;
import com.kaurvadi.Restaurant.entity.RestaurantTable;
import com.kaurvadi.Restaurant.repository.TableRepository;

import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/api/tables")
public class TableController {

    private final TableRecommendationService recommendationService;

    // I think table repository should not be in the contoller script, should be in the service script
    // Will temporarily use it here
    private final TableRepository tableRepository;
    public TableController(TableRecommendationService recommendationService, TableRepository tableRepository) {
        this.tableRepository = tableRepository;
        this.recommendationService = recommendationService;
    }

    @GetMapping("/all")
    public List<RestaurantTable> getAllTables() {
        return tableRepository.findAll();
    }
}