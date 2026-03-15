package com.kaurvadi.Restaurant.init;

import com.kaurvadi.Restaurant.entity.*;
import com.kaurvadi.Restaurant.repository.TableRepository;
import com.kaurvadi.Restaurant.utils.TableUtils;
import com.kaurvadi.Restaurant.repository.ReservationRepository;

import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Component;

import java.util.Random;
import java.util.List;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.EnumMap;
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
    record Placement(ZoneArea zone, int x, int y, double score) {}

    // Randomly create and book some tables on application start-up
    @PostConstruct
    public void init() {
        // Create tables only if they don't exist in DB
        if (tableRepository.count() > 0) {
            return;
        }

        boolean[][] occupied = new boolean[GRID_WIDTH][GRID_HEIGHT];
        Random random = new Random();

         // Zones: terrace at top, indoor middle, private room bottom
         List<ZoneArea> zones = List.of(
                new ZoneArea(Zone.TERRACE, 0, 0, 10, 5),
                new ZoneArea(Zone.INDOOR, 0, 5, 10, 3),
                new ZoneArea(Zone.PRIVATE_ROOM, 0, 8, 10, 2)
        );

         List<Integer> capacities = List.of(
            8,8,8,
            6,6,6,6,
            4,4,4,4,4,4,
            2,2,2,2,2,2
        );

        EnumMap<Zone, Integer> zoneCounts = new EnumMap<>(Zone.class);
        EnumMap<Zone, Integer> occupiedCellsByZone = new EnumMap<>(Zone.class);
        for (Zone zone : List.of(Zone.TERRACE, Zone.INDOOR, Zone.PRIVATE_ROOM)) {
            zoneCounts.put(zone, 0);
            occupiedCellsByZone.put(zone, 0);
        }

        List<RestaurantTable> placedTables = new ArrayList<>();

        for (Integer capacity : capacities) {
            int[] span = TableUtils.getSpan(capacity);
            int colSpan = span[0];
            int rowSpan = span[1];

            Placement placement = findBestPlacement(
                    zones,
                    occupied,
                    placedTables,
                    zoneCounts,
                    occupiedCellsByZone,
                    colSpan,
                    rowSpan,
                    random
            );

            if (placement != null) {
                mark(occupied, placement.x(), placement.y(), colSpan, rowSpan);

                RestaurantTable table = new RestaurantTable(
                        capacity,
                        placement.x(),
                        placement.y(),
                        placement.zone().zone()
                );

                applyPreferenceAreas(table);

                tableRepository.save(table);
                placedTables.add(table);

                zoneCounts.put(placement.zone().zone(), zoneCounts.get(placement.zone().zone()) + 1);
                occupiedCellsByZone.put(
                        placement.zone().zone(),
                        occupiedCellsByZone.get(placement.zone().zone()) + colSpan * rowSpan
                );
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

    // Function created by AI with the goal of spreading out the initial tables evenly across the floorplan
    private Placement findBestPlacement(
            List<ZoneArea> zones,
            boolean[][] occupied,
            List<RestaurantTable> placedTables,
            EnumMap<Zone, Integer> zoneCounts,
            EnumMap<Zone, Integer> occupiedCellsByZone,
            int width,
            int height,
            Random random
    ) {
        List<Placement> candidates = new ArrayList<>();

        for (ZoneArea zone : zones) {
            for (int x = zone.x(); x <= zone.x() + zone.width() - width; x++) {
                for (int y = zone.y(); y <= zone.y() + zone.height() - height; y++) {
                    if (!fits(occupied, x, y, width, height)) {
                        continue;
                    }

                    double score = scorePlacement(
                            zone,
                            x,
                            y,
                            width,
                            height,
                            placedTables,
                            zoneCounts,
                            occupiedCellsByZone
                    ) + random.nextDouble();

                    candidates.add(new Placement(zone, x, y, score));
                }
            }
        }

        return candidates.stream()
                .max(Comparator.comparingDouble(Placement::score))
                .orElse(null);
    }

    // Helper function created by AI to calculate the score for a potential table placement.
    private double scorePlacement(
            ZoneArea zone,
            int x,
            int y,
            int width,
            int height,
            List<RestaurantTable> placedTables,
            EnumMap<Zone, Integer> zoneCounts,
            EnumMap<Zone, Integer> occupiedCellsByZone
    ) {
        double zoneArea = zone.width() * zone.height();
        double zoneLoad = occupiedCellsByZone.get(zone.zone()) / zoneArea;
        double zoneCountPenalty = zoneCounts.get(zone.zone()) * 2.5;
        double spacingBonus = closestDistanceToExistingTables(x, y, width, height, placedTables);

        return spacingBonus - (zoneLoad * 12) - zoneCountPenalty;
    }

    // Created by AI. Calculates the distance between the proposed table placement and the closest existing table.
    // Again, the goal of evenly spreading the tables initially
    private double closestDistanceToExistingTables(
            int x,
            int y,
            int width,
            int height,
            List<RestaurantTable> placedTables
    ) {
        if (placedTables.isEmpty()) {
            return 20;
        }

        double closestDistance = Double.MAX_VALUE;

        for (RestaurantTable table : placedTables) {
            int[] span = TableUtils.getSpan(table.getCapacity());
            int dx = rectangleGap(x, x + width, table.getXPosition(), table.getXPosition() + span[0]);
            int dy = rectangleGap(y, y + height, table.getYPosition(), table.getYPosition() + span[1]);
            double distance = Math.hypot(dx, dy);
            closestDistance = Math.min(closestDistance, distance);
        }

        return closestDistance;
    }

    // Created by AI. Calculates the horizontal or vertical gap between two rectangles.
    private int rectangleGap(int startA, int endA, int startB, int endB) {
        if (endA <= startB) {
            return startB - endA;
        }

        if (endB <= startA) {
            return startA - endB;
        }

        return 0;
    }

    // Assigning the prefrence areas to initial tables
    private void applyPreferenceAreas(RestaurantTable table) {
        int[] span = TableUtils.getSpan(table.getCapacity());
        TableUtils.applyPreferenceAreas(table, span);
    }
    
    // Marks cells on the grid as occupied after table has bene placed.
    private void mark(boolean[][] occupied, int x, int y, int w, int h) {
        for (int i = x; i < x + w; i++) {
            for (int j = y; j < y + h; j++) {
                occupied[i][j] = true;
    
            }
        }
    }
}
