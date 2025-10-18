# Use a base image with a Java Runtime Environment
FROM eclipse-temurin:21-jre

# Set the working directory inside the container
WORKDIR /app

# Copy the OpenTelemetry agent from your resources directory to the /app directory in the image.
# The destination path `/app/opentelemetry-javaagent.jar` must match what's in your compose.yaml's JAVA_TOOL_OPTIONS.
COPY src/main/resources/openTelemetryJar/opentelemetry-javaagent.jar /app/opentelemetry-javaagent.jar

# Copy the application JAR file from the build output directory (e.g., 'target' for Maven).
# The name might vary based on your build tool and version.
COPY target/*.jar /app/app.jar

# The command to run your application. The -javaagent flag is provided by the JAVA_TOOL_OPTIONS environment variable in your compose.yaml.
ENTRYPOINT ["java", "-jar", "/app/app.jar"]