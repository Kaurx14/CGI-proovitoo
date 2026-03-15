package com.kaurvadi.Restaurant.service;

import com.kaurvadi.Restaurant.entity.Preference;
import com.kaurvadi.Restaurant.entity.Reservation;
import com.kaurvadi.Restaurant.entity.RestaurantTable;
import com.kaurvadi.Restaurant.entity.Zone;
import com.kaurvadi.Restaurant.repository.ReservationRepository;
import com.kaurvadi.Restaurant.repository.TableRepository;
import com.kaurvadi.Restaurant.utils.TableUtils;

import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.*;
import static org.springframework.http.HttpStatus.BAD_REQUEST;

@Service
public class TableService {
    private final TableRepository tableRepository;
    private final ReservationRepository reservationRepository;
    private static final int GRID_WIDTH = 10;
    private static final int GRID_HEIGHT = 10;

    public TableService(TableRepository tableRepository,
                                      ReservationRepository reservationRepository) {
        this.tableRepository = tableRepository;
        this.reservationRepository = reservationRepository;
    }

    // Method to recommend a table to user based on their preferences, num of guests,time, zone etc
    public RestaurantTable recommendTable(
            int guests,
            LocalDateTime startTime,
            LocalDateTime endTime,
            Zone zone,
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

            if (zone != null && table.getZone() != zone) continue;

            int score = calculateScore(table, guests, preferences);

            if (score > bestScore) {
                bestScore = score;
                bestTable = table;
            }
        }
        return bestTable;
    }

    // Method to calculate the recommendation score of a given table
    private int calculateScore(RestaurantTable table, int guests, List<Preference> preferences) {
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
                score += 25;

            if (preferences.contains(Preference.PRIVATE) && table.getZone() == Zone.PRIVATE_ROOM)
                score += 25;

            if (preferences.contains(Preference.NEAR_PLAY_AREA) && table.isNearPlayArea())
                score += 25;
        }

        return score;
    }

    // Method to update the position of a table when admin has relocated the table
    public RestaurantTable updatePosition(Long id, int x, int y, Zone requestedZone) {
        RestaurantTable table = tableRepository.findById(id).orElseThrow();
        int[] span = TableUtils.getSpan(table.getCapacity());
        Zone resolvedZone = resolveZone(x, y, span[0], span[1]);

        if (resolvedZone == null) {
            throw new ResponseStatusException(BAD_REQUEST, "Table must fit entirely within one zone");
        }

        if (requestedZone != null && requestedZone != resolvedZone) {
            throw new ResponseStatusException(BAD_REQUEST, "Zone does not match table placement");
        }

        validateNoOverlap(id, x, y, span[0], span[1]);

        table.setXPosition(x);
        table.setYPosition(y);
        table.setZone(resolvedZone);
        applyPreferenceAreas(table);

        return tableRepository.save(table);
    }

    // Change the preference area of the relocated table
    private void applyPreferenceAreas(RestaurantTable table) {
        int[] span = TableUtils.getSpan(table.getCapacity());
        TableUtils.applyPreferenceAreas(table, span);
    }

    // Ensure that there is no overlap with an existing table
    private void validateNoOverlap(Long tableId, int x, int y, int width, int height) {
        for (RestaurantTable existingTable : tableRepository.findAll()) {
            if (existingTable.getId().equals(tableId)) {
                continue;
            }

            int[] existingSpan = TableUtils.getSpan(existingTable.getCapacity());
            boolean overlaps = x < existingTable.getXPosition() + existingSpan[0]
                    && x + width > existingTable.getXPosition()
                    && y < existingTable.getYPosition() + existingSpan[1]
                    && y + height > existingTable.getYPosition();

            if (overlaps) {
                throw new ResponseStatusException(BAD_REQUEST, "Table placement overlaps another table");
            }
        }
    }

    // Method to check which zone the table belongs to
    private Zone resolveZone(int x, int y, int width, int height) {
        if (x < 0 || y < 0 || x + width > GRID_WIDTH || y + height > GRID_HEIGHT) {
            return null;
        }

        if (y + height <= 5) {
            return Zone.TERRACE;
        }

        if (y >= 5 && y + height <= 8) {
            return Zone.INDOOR;
        }

        if (y >= 8) {
            return Zone.PRIVATE_ROOM;
        }

        return null;
    }
}
