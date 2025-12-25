// package com.mandala.controller;

// import com.mandala.dto.ProductResponseDTO;
// import com.mandala.service.ProductService;
// import lombok.RequiredArgsConstructor;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.*;

// import java.util.List;

// @RestController
// @RequestMapping("/api/products")
// @RequiredArgsConstructor
// @CrossOrigin(origins = "http://localhost:3000")
// public class ProductPublicController {

//     private final ProductService productService;

//     @GetMapping
//     public ResponseEntity<List<ProductResponse>> getAllProducts() {
//         return ResponseEntity.ok(productService.getAllProducts());
//     }
// }
