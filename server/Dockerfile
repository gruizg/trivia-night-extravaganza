# Stage 1: Build the application
FROM maven:3.9.9-eclipse-temurin-21-alpine AS build
WORKDIR /app

# Step 1: Copy pom.xml and download dependencies to optimize layer caching
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Step 2: Copy source code and build executable JAR
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Runtime environment
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Copy built JAR from the build stage using exact pom.xml artifact defaults
COPY --from=build /app/target/*.jar app.jar

# Render assigns a dynamic port via $PORT
EXPOSE 8080

# Run application with dynamic port fallback
ENTRYPOINT ["sh", "-c", "java -Dserver.port=${PORT:-8080} -jar app.jar"]