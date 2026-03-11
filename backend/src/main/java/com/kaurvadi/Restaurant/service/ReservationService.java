package com.kaurvadi.Restaurant.service;

import com.kaurvadi.Restaurant.entity.*;
import com.kaurvadi.Restaurant.repository.*;

import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReservationService {
    private final ReservationRepository reservationRepository;
    private final TableRepository tableRepository;

    public ReservationService(ReservationRepository reservationRepository, TableRepository tableRepository) {
        this.reservationRepository = reservationRepository;
        this.tableRepository = tableRepository;
    }

    // Method to create the reservation
    public Reservation createReservation(Long tableId, String customerName, int guestCount, LocalDateTime startTime) {
        RestaurantTable restaurantTable = tableRepository.findById(tableId).orElseThrow();

        Reservation reservation = new Reservation(customerName, guestCount, startTime, startTime.plusHours(2), restaurantTable);

        return reservationRepository.save(reservation);
    }

    // Method to get all reservations
    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }

    // Method to get overlapping reservations
    public List<Reservation> getOverlappingReservations(LocalDateTime startTime, LocalDateTime endTime) {
        return reservationRepository.findByStartTimeBeforeAndEndTimeAfter(endTime, startTime);
    }


    // TODO: use the version with IDs instead of objects
    public List<Long> getReservedTableIds(LocalDateTime startTime, LocalDateTime endTime) {
        return reservationRepository
                .findByStartTimeBeforeAndEndTimeAfter(endTime, startTime)
                .stream()
                .map(r -> r.getRestaurantTable().getId())
                .distinct()
                .toList();
    }
}