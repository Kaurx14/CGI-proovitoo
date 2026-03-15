package com.kaurvadi.Restaurant.dto;

import com.kaurvadi.Restaurant.entity.Zone;

public record TablePositionRequest(int x, int y, Zone zone) {}
