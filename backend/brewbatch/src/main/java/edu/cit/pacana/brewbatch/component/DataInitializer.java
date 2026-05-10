package edu.cit.pacana.brewbatch.component;

import edu.cit.pacana.brewbatch.model.User;
import edu.cit.pacana.brewbatch.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostConstruct
    public void init() {
        boolean adminExists = userRepository.existsByUsernameAndRole("admin", User.Role.ADMIN);

        if (!adminExists) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setPasswordHash(passwordEncoder.encode("admin123"));
            admin.setEmail("admin@brewbatch.local");
            admin.setFullName("System Administrator");
            admin.setRole(User.Role.ADMIN);
            admin.setActive(true);
            userRepository.save(admin);
            System.out.println("[BrewBatch] Default admin user created.");
        } else {
            System.out.println("[BrewBatch] Default admin user already exists. Skipping.");
        }
    }
}