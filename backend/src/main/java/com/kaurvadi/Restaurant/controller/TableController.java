package com.kaurvadi.Restaurant.controller;

import com.kaurvadi.Restaurant.service.TableService;
import com.kaurvadi.Restaurant.entity.RestaurantTable;
import com.kaurvadi.Restaurant.dto.TablePositionRequest;
import com.kaurvadi.Restaurant.repository.TableRepository;

import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/api/tables")
public class TableController {

    private final TableService tableService;

    // I think table repository should not be in the contoller script, should be in the service script
    // Will temporarily use it here
    private final TableRepository tableRepository;
    public TableController(TableService recommendationService, TableRepository tableRepository) {
        this.tableRepository = tableRepository;
        this.tableService = recommendationService;
    }

    @GetMapping("/all")
    public List<RestaurantTable> getAllTables() {
        return tableRepository.findAll();
    }

    @PatchMapping("/{id}/position")
    public RestaurantTable updateTablePosition(
            @PathVariable Long id,
            @RequestBody TablePositionRequest request
    ) {
        return tableService.updatePosition(id, request.x(), request.y(), request.zone());
    }
}
