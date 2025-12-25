package com.mandala.service;

import com.mandala.dto.ProductRequestDTO;
import com.mandala.dto.ProductResponseDTO;
import com.mandala.models.Product;
import com.mandala.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final FileStorageService fileStorageService;

    @Override
    public ProductResponseDTO createProduct(ProductRequestDTO dto, MultipartFile image) {
        Product product = new Product();
        product.setName(dto.getName());
        product.setDescription(dto.getDescription());
        product.setPrice(dto.getPrice());
        product.setStockQuantity(dto.getStockQuantity());
        product.setCategory(dto.getCategory());
        product.setCustomizable(dto.isCustomizable());
        product.setColors(dto.getColors());
        product.setSizes(dto.getSizes());
        
        // Handle image upload
        if (image != null && !image.isEmpty()) {
            String imageUrl = fileStorageService.uploadFile(image, image.getOriginalFilename());
            List<String> images = new ArrayList<>();
            images.add(imageUrl);
            product.setImages(images);
        }

        Product saved = productRepository.save(product);

        return new ProductResponseDTO(saved);
    }

    @Override
    public List<ProductResponseDTO> getAllProducts() {
        return productRepository.findAll()
                .stream()
                .map(ProductResponseDTO::new)
                .toList();
    }

    // Removed duplicate method definition

    @Override
    public ProductResponseDTO updateProduct(Long id, ProductRequestDTO dto, MultipartFile image) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
        
        // Update product fields
        product.setName(dto.getName());
        product.setDescription(dto.getDescription());
        product.setPrice(dto.getPrice());
        product.setStockQuantity(dto.getStockQuantity());
        product.setCategory(dto.getCategory());
        product.setCustomizable(dto.isCustomizable());
        product.setColors(dto.getColors());
        product.setSizes(dto.getSizes());
        
        // Handle image upload or update
        if (image != null && !image.isEmpty()) {
            // If there are existing images, delete the first one
            if (product.getImages() != null && !product.getImages().isEmpty()) {
                String existingImage = product.getImages().get(0);
                fileStorageService.deleteFile(existingImage);
                product.getImages().clear();
            } else {
                product.setImages(new ArrayList<>());
            }
            
            // Upload and add the new image
            String imageUrl = fileStorageService.uploadFile(image, image.getOriginalFilename());
            product.getImages().add(imageUrl);
        }
        
        Product updated = productRepository.save(product);
        return new ProductResponseDTO(updated);
    }

    @Override
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
        
        // Delete associated images
        if (product.getImages() != null && !product.getImages().isEmpty()) {
            for (String imageUrl : product.getImages()) {
                fileStorageService.deleteFile(imageUrl);
            }
        }
        
        productRepository.deleteById(id);
    }
    @Override
public ProductResponseDTO getProductById(Long id) {
    Product product = productRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Product not found"));
    return new ProductResponseDTO(product);
}

}
