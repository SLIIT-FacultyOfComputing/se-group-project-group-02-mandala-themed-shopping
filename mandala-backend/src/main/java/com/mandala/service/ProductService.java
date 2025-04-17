package com.mandala.service;

import com.mandala.dto.ProductDTO;
import com.mandala.dto.ProductResponseDTO;
import com.mandala.models.Product;

import java.util.List;

public interface ProductService {
    List<ProductResponseDTO> getAllProducts();
    ProductResponseDTO getProductById(Long id);
    Product getProductEntityById(Long id); // ✅ Add this
    ProductResponseDTO createProduct(ProductDTO dto);
    ProductResponseDTO updateProduct(Long id, ProductDTO dto);
    void deleteProduct(Long id);
}
