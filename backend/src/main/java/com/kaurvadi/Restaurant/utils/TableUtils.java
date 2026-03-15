package com.kaurvadi.Restaurant.utils;

import com.kaurvadi.Restaurant.entity.RestaurantTable;
import com.kaurvadi.Restaurant.entity.Zone;

public final class TableUtils {

    private TableUtils() {
    }

    // Assigning the prefrence areas to initial tables
    public static void applyPreferenceAreas(RestaurantTable table, int[] span) {
        table.setNearWindow(isNearWindow(table.getZone(), table.getXPosition(), table.getYPosition(), span[0], span[1]));
        table.setQuietCorner(table.getZone() == Zone.PRIVATE_ROOM);
        table.setNearPlayArea(isNearPlayArea(table.getZone(), table.getXPosition(), table.getYPosition(), span[0], span[1]));
    }

    // Created by AI. Determines whether table belongs to a preference area
    private static boolean isNearWindow(Zone zone, int x, int y, int width, int height) {
        if (zone != Zone.INDOOR) {
            return false;
        }

        return isNearArea(x, y, width, height, 0, 5, 2, 3, 0)
                || isNearArea(x, y, width, height, 8, 5, 2, 3, 0);
    }

    private static boolean isNearPlayArea(Zone zone, int x, int y, int width, int height) {
        if (zone != Zone.TERRACE) {
            return false;
        }

        return isNearArea(x, y, width, height, 7, 0, 3, 3, 1);
    }

    // Generic helper function created by AI to check whether a table overlaps or is close
    // to a specified rectangular area.
    private static boolean isNearArea(
            int tableX,
            int tableY,
            int tableWidth,
            int tableHeight,
            int areaX,
            int areaY,
            int areaWidth,
            int areaHeight,
            int threshold
    ) {
        return tableX < areaX + areaWidth + threshold
                && tableX + tableWidth > areaX - threshold
                && tableY < areaY + areaHeight + threshold
                && tableY + tableHeight > areaY - threshold;
    }

    // Mirrors frontend logic
    public static int[] getSpan(int capacity) {
        if (capacity <= 2) return new int[]{1,1};
        if (capacity <= 4) return new int[]{2,1};
        if (capacity <= 6) return new int[]{2,2};
    
        return new int[]{3,2};
    }
}
