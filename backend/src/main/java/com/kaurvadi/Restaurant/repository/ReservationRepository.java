package com.kaurvadi.Restaurant.repository;

import com.kaurvadi.Restaurant.entity.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

// using repositories to handle working with db without SQL
public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    // Method to find overlapping reservations
    List<Reservation> findByStartTimeBeforeAndEndTimeAfter(
            LocalDateTime end,
            LocalDateTime start
    );

    // Method to find all reservations
    List<Reservation> findAll();

}