# Build stage
FROM eclipse-temurin:17-jdk AS builder
WORKDIR /app

# copy wrapper & .mvn
COPY mvnw .
COPY .mvn .mvn

# fix line endings (Windows CRLF) & cấp quyền chạy
RUN sed -i 's/\r$//' mvnw && chmod +x mvnw

# copy pom.xml rồi tải deps
COPY pom.xml .
RUN ./mvnw -q -DskipTests dependency:go-offline

# copy code src và build
COPY src src
RUN ./mvnw -q -DskipTests package

# Runtime stage
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar
ENV PORT=10000
EXPOSE 10000
CMD ["sh","-c","java -jar app.jar --server.port=${PORT}"]
