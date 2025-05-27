# Sử dụng JDK để build và chạy ứng dụng
FROM openjdk:17-jdk-slim

# Tạo thư mục làm việc
WORKDIR /app

# Copy file jar
COPY target/*.jar app.jar

# Mặc định chạy app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]
