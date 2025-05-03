package com.mandala.controller;

import com.mandala.dto.ProductRequestDTO;
import com.mandala.dto.ProductResponseDTO;
import com.mandala.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping("/products")
    public ResponseEntity<List<ProductResponseDTO>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    @PostMapping(value = "/admin/products", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ProductResponseDTO> createProduct(
            @RequestPart("product") ProductRequestDTO productRequest,
            @RequestPart("images") MultipartFile imageFile
    ) {
    System.out.println("Creating product");

        return ResponseEntity.ok(productService.createProduct(productRequest, imageFile));
    }
}
