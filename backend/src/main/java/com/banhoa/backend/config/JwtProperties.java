package com.banhoa.backend.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "app.jwt")
public class JwtProperties {
  private String secret;
  private int expirationMinutes;

  public String getSecret() { return secret; }
  public void setSecret(String secret) { this.secret = secret; }
  public int getExpirationMinutes() { return expirationMinutes; }
  public void setExpirationMinutes(int expirationMinutes) { this.expirationMinutes = expirationMinutes; }
}
