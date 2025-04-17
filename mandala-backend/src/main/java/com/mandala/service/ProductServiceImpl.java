package com.mandala.service;

import com.mandala.dto.ProductDTO;
import com.mandala.dto.ProductResponseDTO;
import com.mandala.models.Product;
import com.mandala.repository.ProductRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;

    private ProductResponseDTO mapToResponse(Product product) {
        ProductResponseDTO dto = new ProductResponseDTO();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setDescription(product.getDescription());
        dto.setPrice(product.getPrice());
        dto.setStockQuantity(product.getStockQuantity());
        dto.setCategory(product.getCategory());
        dto.setCustomizable(product.isCustomizable());
        dto.setImages(product.getImages());
        dto.setColors(product.getColors());
        dto.setSizes(product.getSizes());
        return dto;
    }

    @Override
    public List<ProductResponseDTO> getAllProducts() {
        return productRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public ProductResponseDTO getProductById(Long id) {
        return productRepository.findById(id)
                .map(this::mapToResponse)
                .orElseThrow(() -> new EntityNotFoundException("Product not found"));
    }

    @Override
    public ProductResponseDTO createProduct(ProductDTO dto) {
        Product product = new Product();
        updateFields(product, dto);
        return mapToResponse(productRepository.save(product));
    }

    @Override
    public ProductResponseDTO updateProduct(Long id, ProductDTO dto) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Product not found"));
        updateFields(product, dto);
        return mapToResponse(productRepository.save(product));
    }

    @Override
    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new EntityNotFoundException("Product not found");
        }
        productRepository.deleteById(id);
    }

    private void updateFields(Product product, ProductDTO dto) {
        product.setName(dto.getName());
        product.setDescription(dto.getDescription());
        product.setPrice(dto.getPrice());
        product.setStockQuantity(dto.getStockQuantity());
        product.setCategory(dto.getCategory());
        product.setCustomizable(dto.isCustomizable());
        product.setImages(dto.getImages());
        product.setColors(dto.getColors());
        product.setSizes(dto.getSizes());
    }

    @Override
    public Product getProductEntityById(Long id) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getProductEntityById'");
    }

    // ✅ New internal-use method for backend needs (e.g. wishlist logic)
    // @Override
    // public Product getProductEntityById(Long id) {
    //     return productRepository.findById(id)
    //             .orElseThrow(() -> new EntityNotFoundException("Product not found"));
    // }
}
