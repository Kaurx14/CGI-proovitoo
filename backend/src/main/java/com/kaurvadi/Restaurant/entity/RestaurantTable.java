package com.kaurvadi.Restaurant.entity;

import jakarta.persistence.*;
import lombok.*;

// A class to represent the Table object
@Entity
@Setter
@Getter
@RequiredArgsConstructor
@NoArgsConstructor
public class RestaurantTable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NonNull
    private int capacity;
    @NonNull
    private int xPosition;
    @NonNull
    private int yPosition;

    @NonNull
    @Enumerated(EnumType.STRING)
    private Zone zone;

    private boolean nearWindow;
    private boolean quietCorner;
    private boolean nearPlayArea;
}