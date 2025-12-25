package com.mandala.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "customizations")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Customization {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    public enum ElementType {
        TEXT,
        IMAGE
    }

    @Enumerated(EnumType.STRING)
    private ElementType type;

    private String content;
    private Integer positionX;
    private Integer positionY;
    private Integer size;
    private String color;
    private String fontFamily;

    @OneToOne(mappedBy = "customization")
    private CartItem cartItem;

    @OneToOne(mappedBy = "customization")
    private OrderItem orderItem;
}