package com.mandala.service;

import com.mandala.dto.PaymentRequestDTO;
import com.mandala.dto.PaymentResponseDTO;
import com.mandala.models.Order;
import com.mandala.repository.OrderRepository;
import com.mandala.repository.ReceiptRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final OrderRepository orderRepository;
    private final ReceiptRepository receiptRepository;
    private final ReceiptService receiptService;

    @Override
    @Transactional
    public PaymentResponseDTO processPayment(Long orderId, PaymentRequestDTO request) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        order.setPaid(true);
        order.setPaymentMethod(Order.PaymentMethod.valueOf(request.getPaymentMethod()));
        order.setStatus(Order.Status.PROCESSING);
        orderRepository.save(order);

        String receiptPath;
        try {
            receiptPath = receiptService.regenerateReceipt(orderId);
        } catch (Exception e) {
            throw new RuntimeException("Receipt generation failed: " + e.getMessage());
        }

        return new PaymentResponseDTO(true, "Payment successful", receiptPath);
    }

    // This method has been moved to ReceiptServiceImpl
    @Deprecated
    private String generateAndSaveReceipt(Order order) throws Exception {
        return receiptService.regenerateReceipt(order.getId());
    }

    @Override
    public ResponseEntity<byte[]> generateReceiptPdf(Long orderId) {
        try {
            Order order = orderRepository.findById(orderId)
                    .orElseThrow(() -> new RuntimeException("Order not found"));
            
            byte[] pdfData = receiptService.generateReceiptPdf(order);
            
            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_PDF)
                    .header(HttpHeaders.CONTENT_DISPOSITION, 
                            "attachment; filename=\"receipt_" + order.getOrderNumber() + ".pdf\"")
                    .body(pdfData);
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate receipt: " + e.getMessage(), e);
        }
    }
}
