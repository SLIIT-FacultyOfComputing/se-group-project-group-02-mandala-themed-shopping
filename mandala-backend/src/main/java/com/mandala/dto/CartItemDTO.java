package com.mandala.dto;

import lombok.Data;

@Data
public class CartItemDTO {
    private Long productId;
    private int quantity;
    private String selectedSize;
    private String selectedColor;
}
