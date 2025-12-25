package com.mandala.dto;

import com.mandala.models.Product;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class ProductResponseDTO {
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private int stockQuantity;
    private String category;
    private boolean customizable;
    private List<String> colors;
    private List<String> sizes;
    private List<String> images;

    public ProductResponseDTO(Product product) {
        this.id = product.getId();
        this.name = product.getName();
        this.description = product.getDescription();
        this.price = product.getPrice();
        this.stockQuantity = product.getStockQuantity();
        this.category = product.getCategory();
        this.customizable = product.isCustomizable();
        this.colors = product.getColors();
        this.sizes = product.getSizes();
        this.images = product.getImages();
    }
}
