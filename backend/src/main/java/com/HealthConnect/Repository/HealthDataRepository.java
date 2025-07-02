package com.HealthConnect.Repository;

import com.HealthConnect.Model.HealthData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.stereotype.Repository;

@Repository
public interface HealthDataRepository extends JpaRepository<HealthData, Long> {
    // Lấy dữ liệu theo user, loại và khoảng thời gian
    @Query("SELECT h FROM HealthData h WHERE " +
            "h.user.id = :userId AND " +
            "h.type = :type AND " +
            "h.timestamp BETWEEN :start AND :end " +
            "ORDER BY h.timestamp DESC")
    List<HealthData> findByUserAndTypeAndTimestampBetween(
            @Param("userId") Long userId,
            @Param("type") String type,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );

    // Lấy tất cả dữ liệu của user
    List<HealthData> findByUserId(Long userId);
}
