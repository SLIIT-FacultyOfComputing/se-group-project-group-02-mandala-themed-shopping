package com.mandala.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class ProductDTO {
    private String name;
    private String description;
    private BigDecimal price;
    private Integer stockQuantity;
    private String category;
    private boolean customizable;
    private List<String> images;
    private List<String> colors;
    private List<String> sizes;
}
