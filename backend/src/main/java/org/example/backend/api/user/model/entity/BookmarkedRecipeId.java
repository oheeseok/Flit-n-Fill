//package org.example.backend.api.user.model.entity;
//
//import jakarta.persistence.Embeddable;
//import jakarta.persistence.JoinColumn;
//import jakarta.persistence.ManyToOne;
//import jakarta.persistence.OneToOne;
//import lombok.EqualsAndHashCode;
//import org.example.backend.api.recipe.model.Recipe;
//
//import java.io.Serializable;
//
////@EqualsAndHashCode
//@Embeddable
//public class BookmarkedRecipeId implements Serializable {
//  @ManyToOne
//  @JoinColumn(name = "user_id")
//  private User user;
//
//  @OneToOne
//  @JoinColumn(name = "recipe_id")
//  private Recipe recipe;
//
//
//}
