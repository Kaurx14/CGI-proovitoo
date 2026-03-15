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

    private final TableRepository tableRepository;
    public TableController(TableService recommendationService, TableRepository tableRepository) {
        this.tableRepository = tableRepository;
        this.tableService = recommendationService;
    }

    // Ednpoint for retrieving all tables in the repository
    @GetMapping("/all")
    public List<RestaurantTable> getAllTables() {
        return tableRepository.findAll();
    }

    // Endpoint to update the position of a table
    @PatchMapping("/{id}/position")
    public RestaurantTable updateTablePosition(
            @PathVariable Long id,
            @RequestBody TablePositionRequest request
    ) {
        return tableService.updatePosition(id, request.x(), request.y(), request.zone());
    }
}
