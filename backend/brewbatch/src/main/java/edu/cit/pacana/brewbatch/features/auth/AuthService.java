package edu.cit.pacana.brewbatch.features.auth;

import edu.cit.pacana.brewbatch.features.suppliers.Supplier;
import edu.cit.pacana.brewbatch.features.suppliers.SupplierRepository;
import edu.cit.pacana.brewbatch.features.users.User;
import edu.cit.pacana.brewbatch.features.users.UserRepository;
import edu.cit.pacana.brewbatch.shared.dto.MessageResponse;
import edu.cit.pacana.brewbatch.shared.security.JwtUtils;
import edu.cit.pacana.brewbatch.shared.security.UserDetailsImpl;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final SupplierRepository supplierRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;

    public AuthService(UserRepository userRepository,
                       SupplierRepository supplierRepository,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       JwtUtils jwtUtils) {
        this.userRepository = userRepository;
        this.supplierRepository = supplierRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtUtils = jwtUtils;
    }

    public MessageResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            return new MessageResponse(false,
                    "Username is already taken");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            return new MessageResponse(false,
                    "Email is already registered");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPasswordHash(
                passwordEncoder.encode(request.getPassword()));

        if (request.getRole() != null) {
            try {
                user.setRole(User.Role.valueOf(
                        request.getRole().toUpperCase()));
            } catch (IllegalArgumentException e) {
                user.setRole(User.Role.BARISTA);
            }
        } else {
            user.setRole(User.Role.BARISTA);
        }

        userRepository.save(user);

        // ── Auto-create Supplier record when role is SUPPLIER ──
        if (user.getRole() == User.Role.SUPPLIER) {
            Supplier supplier = new Supplier();
            supplier.setName(request.getCompanyName() != null ? request.getCompanyName() : request.getFullName());
            supplier.setContactName(request.getContactName() != null ? request.getContactName() : request.getFullName());
            supplier.setEmail(request.getEmail());
            supplier.setPhone(request.getPhone());
            supplier.setAddress(request.getAddress());
            supplierRepository.save(supplier);
        }

        return new MessageResponse(true,
                "User registered successfully!");
    }

    public JwtResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(), request.getPassword()));

        SecurityContextHolder.getContext()
                .setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(
                authentication.getName());

        UserDetailsImpl userDetails =
                (UserDetailsImpl) authentication.getPrincipal();

        return new JwtResponse(
                jwt,
                userDetails.getId(),
                userDetails.getUsername(),
                userDetails.getEmail(),
                userDetails.getFullName(),
                userDetails.getRole()
        );
    }
}