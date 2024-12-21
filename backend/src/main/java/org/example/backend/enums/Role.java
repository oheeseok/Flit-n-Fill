package org.example.backend.enums;

public enum Role {
    USER("알반사용자"),
    ADMIN("관리자");

    private final String description;

    // 생성자 (Singleton)
    Role(String description) {
        this.description = description;
    }

    // Getter
    public String getDescription() {
        return description;
    }
}
