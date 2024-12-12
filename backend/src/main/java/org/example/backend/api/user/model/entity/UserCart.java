package org.example.backend.api.user.model.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name="Usercart")
public class UserCart {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long cartId;
  @Column(nullable = false)
  @NotNull
  private Long userId;
}
