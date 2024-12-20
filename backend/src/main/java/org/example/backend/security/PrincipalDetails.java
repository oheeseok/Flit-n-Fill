package org.example.backend.security;

import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.example.backend.api.user.model.entity.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;

@Slf4j
public class PrincipalDetails implements UserDetails, OAuth2User {
    private final User user;
    private final Map<String, Object> attributes;

    // 기본 인증 생성자 (폼 로그인 사용)
    public PrincipalDetails(User user) {
        this.user = user;
        this.attributes = null;
    }

    // OAuth2 인증 사용자
    public PrincipalDetails(User user, Map<String, Object> attributes
                            ) {
        this.user = user;
        this.attributes = attributes;
    }

    @Override
    public Map<String, Object> getAttributes() {
        return attributes;
    }

    //user의 권한 return
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        List<GrantedAuthority> authorities = new ArrayList<>();
//        authorities.add(new SimpleGrantedAuthority());
        return authorities;
    }

    @Override
    public String getPassword() {
        return "";
    }

    @Override
    public String getUsername() {
        return user.getUserEmail();
    }

    @Override
    public String getName() {
        return user.getUserEmail();
    }
}
