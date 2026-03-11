package com.kaurvadi.Restaurant.dto;

import lombok.Getter;
import com.kaurvadi.Restaurant.entity.Preference;
import com.kaurvadi.Restaurant.entity.Zone;

import java.time.LocalDateTime;
import java.util.List;

// A DTO to retrieve
@Getter
public class FilteredReservationRequest {
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private int guestCount;
    private Zone zone;
    private List<Preference> preferences;

}
