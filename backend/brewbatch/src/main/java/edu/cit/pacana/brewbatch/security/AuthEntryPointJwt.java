package edu.cit.pacana.brewbatch.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Component
public class AuthEntryPointJwt implements AuthenticationEntryPoint {

    @Override
    public void commence(HttpServletRequest request,
                         HttpServletResponse response,
                         AuthenticationException authException)
            throws IOException {
        response.setContentType("application/json");
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);

        Map<String, Object> body = new HashMap<>();
        body.put("success", false);
        body.put("data", null);
        Map<String, String> error = new HashMap<>();
        error.put("code", "AUTH-001");
        error.put("message", "Unauthorized");
        error.put("details", authException.getMessage());
        body.put("error", error);
        body.put("timestamp", java.time.Instant.now().toString());

        new ObjectMapper().writeValue(response.getOutputStream(), body);
    }
}