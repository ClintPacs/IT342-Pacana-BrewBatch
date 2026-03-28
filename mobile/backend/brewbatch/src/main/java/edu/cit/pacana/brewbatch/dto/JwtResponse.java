package edu.cit.pacana.brewbatch.dto;

public class JwtResponse {
    private boolean success;
    private Data data;
    private Object error;
    private String timestamp;

    public JwtResponse(String token, Long id, String username,
                       String email, String fullName, String role) {
        this.success = true;
        this.data = new Data(token, id, username, email, fullName, role);
        this.error = null;
        this.timestamp = java.time.Instant.now().toString();
    }

    public static class Data {
        private User user;
        private String token;
        private String type = "Bearer";

        public Data(String token, Long id, String username,
                    String email, String fullName, String role) {
            this.user = new User(id, username, email, fullName, role);
            this.token = token;
        }

        public User getUser() { return user; }
        public String getToken() { return token; }
        public String getType() { return type; }
    }

    public static class User {
        private Long id;
        private String username;
        private String email;
        private String fullName;
        private String role;

        public User(Long id, String username, String email,
                    String fullName, String role) {
            this.id = id;
            this.username = username;
            this.email = email;
            this.fullName = fullName;
            this.role = role;
        }

        public Long getId() { return id; }
        public String getUsername() { return username; }
        public String getEmail() { return email; }
        public String getFullName() { return fullName; }
        public String getRole() { return role; }
    }

    public boolean isSuccess() { return success; }
    public Data getData() { return data; }
    public Object getError() { return error; }
    public String getTimestamp() { return timestamp; }
}