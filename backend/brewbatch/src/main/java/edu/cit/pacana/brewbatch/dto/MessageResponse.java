package edu.cit.pacana.brewbatch.dto;

public class MessageResponse {
    private boolean success;
    private String message;
    private Object error;
    private String timestamp;

    public MessageResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
        this.error = null;
        this.timestamp = java.time.Instant.now().toString();
    }

    public boolean isSuccess() { return success; }
    public String getMessage() { return message; }
    public Object getError() { return error; }
    public String getTimestamp() { return timestamp; }
}