package com.devtalk.configs;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.context.ApplicationContextInitializer;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;

import java.util.HashMap;
import java.util.Map;

public class DotenvConfig implements ApplicationContextInitializer<ConfigurableApplicationContext> {

    @Override
    public void initialize(ConfigurableApplicationContext applicationContext) {
        Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();

        Map<String, Object> dotenvProperties = new HashMap<>();
        dotenv.entries().forEach(entry -> {
            dotenvProperties.put(entry.getKey(), entry.getValue());
            // Debug output
            if (entry.getKey().startsWith("DB_")) {
                System.out.println("[DOTENV] " + entry.getKey() + " = " +
                    (entry.getKey().contains("PASSWORD") ? "***HIDDEN***" : entry.getValue()));
            }
        });

        System.out.println("[DOTENV] Total properties loaded: " + dotenvProperties.size());

        ConfigurableEnvironment environment = applicationContext.getEnvironment();
        environment.getPropertySources().addFirst(new MapPropertySource("dotenvProperties", dotenvProperties));
    }
}

