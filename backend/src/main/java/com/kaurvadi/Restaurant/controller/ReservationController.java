package com.kaurvadi.Restaurant.controller;

import com.kaurvadi.Restaurant.dto.ReservationRequest;
import com.kaurvadi.Restaurant.entity.Reservation;
import com.kaurvadi.Restaurant.entity.RestaurantTable;
import com.kaurvadi.Restaurant.entity.Preference;
import com.kaurvadi.Restaurant.entity.Zone;
import com.kaurvadi.Restaurant.service.ReservationService;
import com.kaurvadi.Restaurant.service.TableService;
import java.time.LocalDateTime;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.List;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {
    private final ReservationService reservationService;
    private final TableService tableRecommendationService;

    public ReservationController(ReservationService reservationService, TableService tableRecommendationService) {
        this.reservationService = reservationService;
        this.tableRecommendationService = tableRecommendationService;
    }

    @PostMapping
    public Reservation createReservation(@RequestBody ReservationRequest request) {
        return reservationService.createReservation(
                request.getTableId(),
                request.getCustomerName(),
                request.getGuestCount(),
                request.getStartTime()
        );
    }

    // Temporary endpoint to get all reservations
    @GetMapping("/all")
    public List<Reservation> getAllReservations() {
        return reservationService.getAllReservations();
    }


    // TODO: Use IDs
    // @GetMapping("/overlaps")
    // public List<Reservation> getOverlappingReservations(
    //         @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startTime,
    //         @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endTime
    // ) {
    //     return reservationService.getOverlappingReservations(startTime, endTime);
    // }

    @GetMapping("/overlaps/table-ids")
    public List<Long> getReservedTableIds(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startTime,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endTime
    ) {
        return reservationService.getReservedTableIds(startTime, endTime);
    }

    @GetMapping("/recommended-table")
    public Long getRecommendedTableId(
            @RequestParam int guests,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startTime,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endTime,
            @RequestParam(required = false) Zone zone,
            @RequestParam(required = false) List<Preference> preferences
    ) {

        RestaurantTable table = tableRecommendationService.recommendTable(
                guests,
                startTime,
                endTime,
                zone,
                preferences
        );

        if (table == null) {
            return null;
        }

        return table.getId();
    }
}
