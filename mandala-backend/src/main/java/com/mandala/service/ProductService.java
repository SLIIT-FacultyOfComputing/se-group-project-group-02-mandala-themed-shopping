package com.mandala.service;

import com.mandala.dto.ProductRequestDTO;
import com.mandala.dto.ProductResponseDTO;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ProductService {
    ProductResponseDTO createProduct(ProductRequestDTO dto, MultipartFile image);
    List<ProductResponseDTO> getAllProducts();
    ProductResponseDTO getProductById(Long id);
    ProductResponseDTO updateProduct(Long id, ProductRequestDTO dto, MultipartFile image);
    void deleteProduct(Long id);
}
