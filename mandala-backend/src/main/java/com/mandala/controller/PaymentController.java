package com.mandala.controller;

import com.mandala.dto.PaymentRequestDTO;
import com.mandala.dto.PaymentResponseDTO;
import com.mandala.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/process/{orderId}")
    public ResponseEntity<PaymentResponseDTO> processPayment(
            @PathVariable Long orderId,
            @RequestBody PaymentRequestDTO request
    ) {
        return ResponseEntity.ok(paymentService.processPayment(orderId, request));
    }

    @GetMapping("/receipt/{orderId}")
    public ResponseEntity<byte[]> generateReceipt(@PathVariable Long orderId) {
        return paymentService.generateReceiptPdf(orderId);
    }
}

