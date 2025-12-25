package com.mandala.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class ProductRequestDTO {
    private String name;
    private String description;
    private BigDecimal price;
    private int stockQuantity;
    private String category;
    private boolean customizable;
    private List<String> colors;
    private List<String> sizes;
}
