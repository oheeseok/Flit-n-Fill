package org.example.backend.api.user.model.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class User {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long userId;
  @Column(length = 5, nullable = false)
  @NotNull
  private String userName;
  @Column(length = 50, nullable = false, unique = true)
  @NotNull
  private String userEmail;
  @Column(length = 8, nullable = false, unique = true)
  @NotNull
  private String userNickname;
  @Column(nullable = false)
  @Size(min = 10, max = 15, message = "비밀번호의 길이는 10자에서 15자 사이입니다.")
  @Pattern(regexp = "[a-zA-Z0-9`~!@#$%^&*()_=+|{};:,.<>/?]*$", message = "비밀번호 형식이 일치하지 않습니다")
  @NotNull
  private String userPassword;
  @Column(length = 13, nullable = false)
  @NotNull
  private String userPhone;
  @Column(length = 10, nullable = false)
  @NotNull
  private String userAddress;
  @Column(length = 255, nullable = false)
  @NotNull
  private String userProfile;
  @Column(columnDefinition = "DECIMAL(5,1)", nullable = false)
  @ColumnDefault("0")
  @NotNull
  private double userKindness;
}
