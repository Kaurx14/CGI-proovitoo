package com.kaurvadi.Restaurant.init;

import com.kaurvadi.Restaurant.entity.*;
import com.kaurvadi.Restaurant.repository.TableRepository;
import com.kaurvadi.Restaurant.repository.ReservationRepository;

import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Component;

import java.util.Random;
import java.util.List;
import java.time.LocalDateTime;

@Component
public class DataInitializer {
    private final TableRepository tableRepository;
    private final ReservationRepository reservationRepository;

    private static final int GRID_WIDTH = 10;
    private static final int GRID_HEIGHT = 10;

    public DataInitializer(TableRepository tableRepository, ReservationRepository reservationRepository) {
        this.tableRepository = tableRepository;
        this.reservationRepository = reservationRepository;
    }

    record ZoneArea(Zone zone, int x, int y, int width, int height) {}

    // Randomly create and book some tables on application start-up
    @PostConstruct
    public void init() {
        // Create tables only if they don't exist in DB
        if (tableRepository.count() > 0) {
            return;
        }

        boolean[][] occupied = new boolean[GRID_WIDTH][GRID_HEIGHT];
        Random random = new Random();

        // Creating a vertical corridor for walking space
        for (int y = 0; y < 10; y++) {
            occupied[8][y] = true;
            occupied[9][y] = true;
        }

         // ZONE CLUSTERS: terrace at top, indoor middle, private room bottom
         List<ZoneArea> zones = List.of(
                new ZoneArea(Zone.TERRACE, 0, 0, 8, 3),
                new ZoneArea(Zone.INDOOR, 0, 3, 8, 5),
                new ZoneArea(Zone.PRIVATE_ROOM, 0, 8, 8, 2)
        );

        /*
         PLACE BIG TABLES FIRST
         prevents fragmentation
         */
         List<Integer> capacities = List.of(
            8,8,8,
            6,6,6,6,
            4,4,4,4,4,4,
            2,2,2,2,2,2
        );

        for (Integer capacity : capacities) {
            int[] span = getSpan(capacity);
            int colSpan = span[0];
            int rowSpan = span[1];

            boolean placed = false;

            for (ZoneArea zone : zones) {
                for (int x = zone.x(); x < zone.x() + zone.width(); x++) {
                    for (int y = zone.y(); y < zone.y() + zone.height(); y++) {

                        if (fits(occupied, x, y, colSpan, rowSpan)) {
                            mark(occupied, x, y, colSpan, rowSpan);

                            RestaurantTable table = new RestaurantTable(
                                    capacity,
                                    x,
                                    y,
                                    zone.zone()
                            );

                            table.setNearWindow(zone.zone() == Zone.TERRACE);
                            table.setQuietCorner(random.nextBoolean());
                            table.setNearPlayArea(random.nextBoolean());

                            tableRepository.save(table);

                            placed = true;
                            break;
                        }
                    }
                    if (placed) break;
                }
                if (placed) break;
            }
        }
        

        // Seed some reservations
        List<RestaurantTable> allTables = tableRepository.findAll();

        LocalDateTime now = LocalDateTime.now();

        for (RestaurantTable table : allTables) {
            // about40% chance to have an active reservation
            if (random.nextDouble() < 0.4) {
                int guestCount = Math.min(table.getCapacity(), 2 + random.nextInt(table.getCapacity()));

                // Start times between -1h and +1h around "now"
                LocalDateTime startTime = now.minusMinutes(60).plusMinutes(random.nextInt(120));
                // Visit duration 2–3 hours
                int durationMinutes = 120 + random.nextInt(60);
                LocalDateTime endTime = startTime.plusMinutes(durationMinutes);

                Reservation reservation = new Reservation(
                        "Seeded Guest " + table.getId(),
                        guestCount,
                        startTime,
                        endTime,
                        table
                );

                reservationRepository.save(reservation);
            }
        }
    }

    private boolean fits(boolean[][] occupied, int x, int y, int w, int h) {
        if (x + w > 10 || y + h > 10) return false;
    
        for (int i = x; i < x + w; i++) {
            for (int j = y; j < y + h; j++) {
    
                if (occupied[i][j]) return false;
    
            }
        }
    
        return true;
    }
    
    private void mark(boolean[][] occupied, int x, int y, int w, int h) {
        for (int i = x; i < x + w; i++) {
            for (int j = y; j < y + h; j++) {
    
                occupied[i][j] = true;
    
            }
        }
    }

    // Mirrors frontend logic
    private int[] getSpan(int capacity) {
        if (capacity <= 2) return new int[]{1,1};
        if (capacity <= 4) return new int[]{2,1};
        if (capacity <= 6) return new int[]{2,2};
    
        return new int[]{3,2};
    }
}