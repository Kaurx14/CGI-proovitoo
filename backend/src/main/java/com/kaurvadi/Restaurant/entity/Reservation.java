package com.kaurvadi.Restaurant.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

// A table reservation class
// Getter, setters and constructor added using Lombok
@Getter
@Setter
@RequiredArgsConstructor
@NoArgsConstructor
@Entity
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NonNull
    private String customerName;
    @NonNull
    private int guestCount;
    @NonNull
    private LocalDateTime startTime;
    @NonNull
    private LocalDateTime endTime;

    @ManyToOne
    @NonNull
    private RestaurantTable restaurantTable;
}