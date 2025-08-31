# Build stage
FROM eclipse-temurin:17-jdk AS builder
WORKDIR /app
COPY mvnw ./
COPY .mvn .mvn
COPY pom.xml .
RUN ./mvnw -q -DskipTests dependency:go-offline
COPY src src
RUN ./mvnw -q -DskipTests package

# Runtime stage
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar
ENV PORT=10000
EXPOSE 10000
CMD ["sh","-c","java -jar app.jar --server.port=${PORT}"]
