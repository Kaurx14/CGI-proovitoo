package com.kaurvadi.Restaurant.dto;

import lombok.Getter;

import java.time.LocalDateTime;

// A DTO to handle reservation creation requests
@Getter
public class ReservationRequest {
    private Long tableId;
    private String customerName;
    private int guestCount;
    private LocalDateTime startTime;
}

