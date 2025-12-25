package com.mandala.service;

import com.mandala.dto.PaymentRequestDTO;
import com.mandala.dto.PaymentResponseDTO;
import org.springframework.http.ResponseEntity;

public interface PaymentService {
    PaymentResponseDTO processPayment(Long orderId, PaymentRequestDTO request);
    ResponseEntity<byte[]> generateReceiptPdf(Long orderId);
}
