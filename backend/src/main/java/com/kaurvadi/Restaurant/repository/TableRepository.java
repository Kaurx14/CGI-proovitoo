package com.kaurvadi.Restaurant.repository;

import com.kaurvadi.Restaurant.entity.RestaurantTable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TableRepository extends JpaRepository<RestaurantTable, Long> {

}