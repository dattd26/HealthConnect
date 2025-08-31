# Build stage
FROM eclipse-temurin:17-jdk AS builder
WORKDIR /app

# copy wrapper + make it executable (fix Windows CRLF too)
COPY mvnw ./
COPY .mvn .mvn
RUN sed -i 's/\r$//' mvnw && chmod +x mvnw

# build deps offline first (cache tốt hơn)
COPY pom.xml .
RUN ./mvnw -q -DskipTests dependency:go-offline

# build app
COPY src src
RUN ./mvnw -q -DskipTests package

# Runtime stage
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar
ENV PORT=10000
EXPOSE 10000
CMD ["sh","-c","java -jar app.jar --server.port=${PORT}"]
