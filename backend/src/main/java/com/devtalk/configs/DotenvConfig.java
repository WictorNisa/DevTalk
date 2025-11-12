package com.devtalk.configs;

import java.util.HashMap;
import java.util.Map;

import org.springframework.context.ApplicationContextInitializer;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;
import org.springframework.lang.NonNull;

import io.github.cdimascio.dotenv.Dotenv;

/**
 * Loads environment variables from a .env file and registers them with Spring's environment.
 * <p>
 * This initializer runs before the application context is refreshed, ensuring .env variables
 * are available for property resolution in {@code @Value} annotations and {@code application.properties}.
 * <p>
 * Integrates with Spring's property resolution by adding a {@link MapPropertySource} containing
 * the .env variables as the highest-priority property source.
 */
public class DotenvConfig implements ApplicationContextInitializer<ConfigurableApplicationContext> {

    @Override
    public void initialize(@NonNull ConfigurableApplicationContext applicationContext) {
        Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();

        Map<String, Object> dotenvProperties = new HashMap<>();
        dotenv.entries().forEach(entry -> {
            dotenvProperties.put(entry.getKey(), entry.getValue());
        });

        ConfigurableEnvironment environment = applicationContext.getEnvironment();
        environment.getPropertySources().addFirst(new MapPropertySource("dotenvProperties", dotenvProperties));
    }
}

