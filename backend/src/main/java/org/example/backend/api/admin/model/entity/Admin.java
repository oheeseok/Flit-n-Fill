package org.example.backend.api.admin.model.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Admin {
  @Id
  @Column(length = 15, nullable = false)
  @NotNull
  private String adminId;
  @Column(length = 15, nullable = false)
  @Size(min = 10, max = 15, message = "비밀번호의 길이는 10자에서 15자 사이입니다.")
  @Pattern(regexp = "[a-zA-Z0-9`~!@#$%^&*()_=+|{};:,.<>/?]*$", message = "비밀번호 형식이 일치하지 않습니다")
  @NotNull
  private String adminPassword;
}
