package com.kaurvadi.Restaurant.dto;

import com.kaurvadi.Restaurant.entity.Preference;
import com.kaurvadi.Restaurant.entity.Zone;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

// TODO: Remove
// A DTO for api request for searching for tables
@Getter
public class TableSearchRequest {
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private int guestCount;
    private Zone zone;
    private List<Preference> preferences;

    // getters & setters
}