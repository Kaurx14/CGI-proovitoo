package com.kaurvadi.Restaurant.service;

import com.kaurvadi.Restaurant.entity.Preference;
import com.kaurvadi.Restaurant.entity.Reservation;
import com.kaurvadi.Restaurant.entity.RestaurantTable;
import com.kaurvadi.Restaurant.repository.ReservationRepository;
import com.kaurvadi.Restaurant.repository.TableRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class TableService {
    private final TableRepository tableRepository;
    private final ReservationRepository reservationRepository;

    public TableService(TableRepository tableRepository,
                                      ReservationRepository reservationRepository) {
        this.tableRepository = tableRepository;
        this.reservationRepository = reservationRepository;
    }

    public RestaurantTable recommendTable(
            int guests,
            LocalDateTime startTime,
            LocalDateTime endTime,
            List<Preference> preferences
    ) {
        // Get all tables
        List<RestaurantTable> tables = tableRepository.findAll();

        // Get reservations overlapping with this time
        List<Reservation> reservations =
                reservationRepository.findByStartTimeBeforeAndEndTimeAfter(
                        endTime,
                        startTime
                );

        // Collect reserved table ids
        Set<Long> reservedTables = new HashSet<>();
        for (Reservation r : reservations) {
            reservedTables.add(r.getRestaurantTable().getId());
        }

        RestaurantTable bestTable = null;
        int bestScore = Integer.MIN_VALUE;

        for (RestaurantTable table : tables) {
            // skip reserved tables
            if (reservedTables.contains(table.getId())) continue;

            // skip tables too small
            if (table.getCapacity() < guests) continue;

            int score = calculateScore(table, guests, preferences);

            if (score > bestScore) {
                bestScore = score;
                bestTable = table;
            }
        }
        return bestTable;
    }

    private int calculateScore(RestaurantTable table,
                               int guests,
                               List<Preference> preferences) {
        int score = 0;

        // Capacity efficiency
        int emptySeats = table.getCapacity() - guests;

        if (emptySeats == 0) score += 50;
        else if (emptySeats <= 2) score += 35;
        else if (emptySeats <= 4) score += 20;
        else score += 5;

        // Preference scoring
        if (preferences != null) {
            if (preferences.contains(Preference.WINDOW) && table.isNearWindow())
                score += 15;

            if (preferences.contains(Preference.QUIET) && table.isQuietCorner())
                score += 15;

            if (preferences.contains(Preference.NEAR_PLAY_AREA) && table.isNearPlayArea())
                score += 15;
        }

        return score;
    }

    public RestaurantTable updatePosition(Long id, int x, int y) {
        RestaurantTable table = tableRepository.findById(id).orElseThrow();

        table.setXPosition(x);
        table.setYPosition(y);

        return tableRepository.save(table);
    }
}
