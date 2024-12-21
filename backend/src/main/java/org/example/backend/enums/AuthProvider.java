package org.example.backend.enums;

public enum AuthProvider {
    LOCAL("일반가입"),
    GOOGLE("google"),
    KAKAO("kakao");

    private final String description;

    // 생성자 (Singleton)
    AuthProvider(String description) {
        this.description = description;
    }

    // Getter
    public String getDescription() { return description; }
}
