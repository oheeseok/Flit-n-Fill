package org.example.backend.security;

import lombok.RequiredArgsConstructor;
import org.example.backend.api.user.service.TokenManagementService;
import org.example.backend.security.service.CustomOAuth2UserService;
import org.example.backend.security.service.CustomUserDetailsService;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@RequiredArgsConstructor
@Configuration
public class SpringConfig {
  private final JwtTokenProvider jwtTokenProvider;
  private final TokenManagementService tokenManagementService;
  private final CustomOAuth2UserService oAuth2UserService;
  private final OAuth2LoginSuccessHandler oAuth2LoginSuccessHandler;
  private final CustomUserDetailsService customUserDetailsService;

  // password encoder
  @Bean
  public BCryptPasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }

  @Bean
  public WebSecurityCustomizer webSecurityCustomizer() { // security를 적용하지 않을 리소스
    return web -> web.ignoring()
        // error endpoint를 열어줘야 함, favicon.ico 추가!
        .requestMatchers("/error", "/favicon.ico");
  }

  @Bean
  public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    // 인증 요청 페이지 설정
    http
        .authorizeHttpRequests(authorize -> authorize
            .requestMatchers("/api/user/register", "/api/user/login", "/api/user/login/social", "/oauth2/**", "/api/subscribe/**", "/api/auth/**",
                "/api/admin/login", "/swagger-ui/**", "/v3/api-docs/**", "/api/recipes", "/api/recipes/todays-recipe").permitAll()
            .requestMatchers("/api/recipes/{recipeId}")
            .permitAll() // GET /api/recipes/{recipeId} 허용
            .requestMatchers("/api/admin/**").hasRole("ADMIN")
            .requestMatchers("/api/**").authenticated()
            .anyRequest().permitAll())

        // REST API 이기 때문에 basic auth 및 csrf 보안 미사용
        .httpBasic(basic -> basic.disable())
        .csrf(csrf -> csrf.disable())

        // jwt 토큰을 사용하기 때문에 session 사용하지 않고 stateless 서버 생성
        .sessionManagement(session ->
            session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

        // form 로그인 방식 비활성화
        .formLogin(login -> login.disable())

        // OAuth2 로그인 추가
        .oauth2Login(oauth2 ->
            oauth2.userInfoEndpoint(c -> c.userService(oAuth2UserService))
                .successHandler(oAuth2LoginSuccessHandler))// 로그인 성공시 이동할 URL

        // jwt token filter
        .addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class)
        // cors 설정
        .cors(cors -> cors.configurationSource(corsConfigurationSource()));


    return http.build();
  }

  @Bean
  public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.addAllowedOrigin("http://localhost:5173"); // React 개발 서버 주소
    configuration.addAllowedOrigin("http://localhost:4173"); // React 개발 서버 주소
    configuration.addAllowedOrigin("http://54.180.201.220/");
    configuration.addAllowedOrigin("http://54.180.201.220"); // React 개발 서버 주소
    configuration.addAllowedOrigin("http://3.39.21.24"); // React 개발 서버 주소
    configuration.addAllowedOrigin("http://52-1068271922.ap-northeast-2.elb.amazonaws.com/"); // React 개발 서버 주소
    configuration.addAllowedOrigin("https://52-1068271922.ap-northeast-2.elb.amazonaws.com/"); // React 개발 서버 주소
    configuration.addAllowedOrigin("http://www.flitnfill.kro.kr/"); // React 개발 서버 주소
    configuration.addAllowedOrigin("http://www.flitnfill.kro.kr:8080/"); // React 개발 서버 주소
    configuration.addAllowedOrigin("https://www.flitnfill.kro.kr/"); // React 개발 서버 주소

    configuration.addAllowedMethod("*");
    configuration.addAllowedHeader("*");
    configuration.setAllowCredentials(true);

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
  }

  @Bean
  public JwtAuthenticationFilter jwtAuthenticationFilter() {
    return new JwtAuthenticationFilter(jwtTokenProvider, tokenManagementService, customUserDetailsService); // JwtTokenProvider 주입
  }

  @Bean
  public FilterRegistrationBean<JwtAuthenticationFilter> jwtAuthenticationFilterRegistration(JwtAuthenticationFilter jwtAuthenticationFilter) {
    FilterRegistrationBean<JwtAuthenticationFilter> registrationBean = new FilterRegistrationBean<>();
    registrationBean.setFilter(jwtAuthenticationFilter); // 필터에 JwtAuthenticationFilter 주입
    return registrationBean;
  }

  @Bean
  public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
    return authenticationConfiguration.getAuthenticationManager();
  }
}
