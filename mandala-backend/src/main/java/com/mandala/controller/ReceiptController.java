package com.mandala.controller;

import com.mandala.models.Order;
import com.mandala.models.OrderItem;
import com.mandala.models.Receipt;
import com.mandala.repository.OrderRepository;
import com.mandala.repository.ReceiptRepository;
import com.mandala.service.ReceiptService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.*;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.time.LocalDateTime;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/receipts")
@Slf4j
public class ReceiptController {

    private final ReceiptRepository receiptRepository;
    private final OrderRepository orderRepository;
    private final ReceiptService receiptService;

    @GetMapping("/download/{orderId}")
    @Transactional
    public ResponseEntity<ByteArrayResource> downloadReceipt(@PathVariable Long orderId) {
        try {
            log.info("Receipt download requested for order ID: {}", orderId);
            
            // First try to find existing receipt
        Receipt receipt = receiptRepository.findByOrderId(orderId)
                    .orElse(null);

            byte[] data;
            String filename;
            
            if (receipt != null) {
                log.info("Found existing receipt record for order ID: {}", orderId);
                
                // Important: Extract BLOB content and handle it immediately
                // to avoid transaction issues
                if (receipt.getContent() != null) {
                    try {
                        data = receipt.getContent();
                        filename = receipt.getFileName();
                        
                        if (data != null && data.length > 0) {
                            log.info("Returning receipt from database for order ID: {}, content size: {} bytes", orderId, data.length);
                            return createPdfResponse(data, filename);
                        }
                    } catch (Exception e) {
                        log.warn("Error reading BLOB data from database: {}", e.getMessage());
                        // Continue to next option
                    }
                }
                
                // Try to read from file
                try {
                    File file = new File(receipt.getFilePath());
                    if (file.exists()) {
                        data = Files.readAllBytes(file.toPath());
                        filename = receipt.getFileName();
                        log.info("Retrieved receipt from file system for order ID: {}, file size: {} bytes", orderId, data.length);
                        return createPdfResponse(data, filename);
                    } else {
                        log.warn("Receipt file not found: {}", receipt.getFilePath());
                    }
                } catch (Exception e) {
                    log.warn("Failed to read receipt file for order ID: {}", orderId, e);
                }
            } else {
                log.info("No existing receipt found for order ID: {}", orderId);
            }
            
            // If we get here, we need to regenerate the receipt
            log.info("Regenerating receipt for order ID: {}", orderId);
            Order order = orderRepository.findById(orderId)
                    .orElseThrow(() -> new RuntimeException("Order not found with ID: " + orderId));
                
            // Fix any order items with missing prices
            fixOrderItemsWithMissingPrices(order);
                
            // Generate receipt on-the-fly
            data = receiptService.generateReceiptPdf(order);
            filename = "receipt_" + order.getOrderNumber() + ".pdf";
            
            log.info("Successfully generated new receipt for order ID: {}, content size: {} bytes", orderId, data.length);
            
            // Save the receipt for future use
            try {
                if (receipt == null) {
                    receipt = new Receipt();
                    receipt.setOrder(order);
                    receipt.setFileName(filename);
                    receipt.setCreatedAt(LocalDateTime.now());
                }
                
                // Save content to a file as well
                String folderPath = System.getProperty("user.dir") + "/receipts/";
                new File(folderPath).mkdirs();
                String filePath = folderPath + filename;
                receipt.setFilePath(filePath);
                
                try (FileOutputStream fos = new FileOutputStream(filePath)) {
                    fos.write(data);
                    log.info("Saved receipt file to disk: {}", filePath);
                }
                
                // Store the content in a separate transaction to avoid BLOB issues
                final byte[] finalData = data;
                final Receipt finalReceipt = receipt;
                
                // Create a new instance to avoid caching issues
                Receipt freshReceipt = new Receipt();
                freshReceipt.setOrder(order);
                freshReceipt.setFileName(filename);
                freshReceipt.setFilePath(filePath);
                freshReceipt.setContent(finalData);
                freshReceipt.setCreatedAt(LocalDateTime.now());
                
                receiptRepository.save(freshReceipt);
                log.info("Saved receipt to database for order ID: {}", orderId);
            } catch (Exception e) {
                log.warn("Failed to save regenerated receipt for order ID: {}", orderId, e);
                // Continue to return the PDF even if we couldn't save it
            }
            
            return createPdfResponse(data, filename);
        } catch (Exception e) {
            log.error("Error generating receipt for order ID: {}", orderId, e);
            
            // Create a detailed error PDF document to return
            try {
                log.info("Creating error PDF for failed receipt generation, order ID: {}", orderId);
                ByteArrayOutputStream baos = new ByteArrayOutputStream();
                com.itextpdf.text.Document document = new com.itextpdf.text.Document();
                com.itextpdf.text.pdf.PdfWriter writer = com.itextpdf.text.pdf.PdfWriter.getInstance(document, baos);
                document.open();
                
                // Add more styling to the error PDF
                com.itextpdf.text.Font titleFont = new com.itextpdf.text.Font(com.itextpdf.text.Font.FontFamily.HELVETICA, 16, com.itextpdf.text.Font.BOLD, com.itextpdf.text.BaseColor.RED);
                com.itextpdf.text.Font normalFont = new com.itextpdf.text.Font(com.itextpdf.text.Font.FontFamily.HELVETICA, 12);
                com.itextpdf.text.Font boldFont = new com.itextpdf.text.Font(com.itextpdf.text.Font.FontFamily.HELVETICA, 12, com.itextpdf.text.Font.BOLD);
                
                // Title
                com.itextpdf.text.Paragraph title = new com.itextpdf.text.Paragraph("Error Generating Receipt", titleFont);
                title.setAlignment(com.itextpdf.text.Element.ALIGN_CENTER);
                document.add(title);
                document.add(com.itextpdf.text.Chunk.NEWLINE);
                
                // Error details
                document.add(new com.itextpdf.text.Paragraph("We encountered a problem while generating your receipt.", normalFont));
                document.add(com.itextpdf.text.Chunk.NEWLINE);
                
                document.add(new com.itextpdf.text.Paragraph("Order ID: " + orderId, boldFont));
                document.add(new com.itextpdf.text.Paragraph("Time: " + java.time.LocalDateTime.now().format(java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")), normalFont));
                document.add(new com.itextpdf.text.Paragraph("Error Reference: " + java.util.UUID.randomUUID().toString(), normalFont));
                document.add(com.itextpdf.text.Chunk.NEWLINE);
                
                // Technical details (hidden in production)
                document.add(new com.itextpdf.text.Paragraph("Technical Details:", boldFont));
                document.add(new com.itextpdf.text.Paragraph("Error: " + e.getMessage(), normalFont));
                
                // Root cause if available
                Throwable rootCause = e;
                while (rootCause.getCause() != null) {
                    rootCause = rootCause.getCause();
                }
                if (rootCause != e) {
                    document.add(new com.itextpdf.text.Paragraph("Root cause: " + rootCause.getMessage(), normalFont));
                }
                
                document.add(com.itextpdf.text.Chunk.NEWLINE);
                
                // Contact information
                document.add(new com.itextpdf.text.Paragraph("Please contact our support team for assistance:", boldFont));
                document.add(new com.itextpdf.text.Paragraph("Email: support@mandala.com", normalFont));
                document.add(new com.itextpdf.text.Paragraph("Phone: +1-800-MANDALA", normalFont));
                
                document.close();
                writer.close();
                
                byte[] pdfBytes = baos.toByteArray();
                log.info("Successfully created error PDF for order ID: {}, size: {} bytes", orderId, pdfBytes.length);
                
                return ResponseEntity.status(HttpStatus.OK)
                        .contentType(MediaType.APPLICATION_PDF)
                        .contentLength(pdfBytes.length)
                        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"error_receipt_" + orderId + ".pdf\"")
                        .body(new ByteArrayResource(pdfBytes));
            } catch (Exception ex) {
                log.error("Failed to create error PDF for order ID: {}", orderId, ex);
                // Last resort - return a plain text error
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .contentType(MediaType.TEXT_PLAIN)
                        .body(new ByteArrayResource(("Failed to generate receipt for order " + orderId + ". Please contact support.").getBytes()));
            }
        }
    }
    
    private ResponseEntity<ByteArrayResource> createPdfResponse(byte[] data, String filename) {
        ByteArrayResource resource = new ByteArrayResource(data);
        
        // Log response details
        log.info("Creating PDF response with filename: {}, content length: {} bytes", filename, data.length);
        
        // Use a simple filename without spaces or special characters
        String safeFilename = filename.replaceAll("[^a-zA-Z0-9.-]", "_");

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .contentLength(data.length)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + safeFilename + "\"")
                .header("Content-Transfer-Encoding", "binary")
                .header(HttpHeaders.CACHE_CONTROL, "no-cache, no-store, must-revalidate")
                .header(HttpHeaders.PRAGMA, "no-cache")
                .header(HttpHeaders.EXPIRES, "0")
                .body(resource);
    }

    /**
     * Ensures that all order items have the price field set correctly and recalculates the order total.
     * This fixes old orders where the price field might not have been set or the total was incorrect.
     * 
     * @param order The order to fix
     */
    private void fixOrderItemsWithMissingPrices(Order order) {
        if (order == null || order.getItems() == null || order.getItems().isEmpty()) {
            return;
        }
        
        boolean needsUpdate = false;
        java.math.BigDecimal calculatedSubtotal = java.math.BigDecimal.ZERO;
        
        for (OrderItem item : order.getItems()) {
            boolean itemUpdated = false;
            
            // Fix missing price
            if (item.getPrice() == null && item.getProduct() != null && item.getProduct().getPrice() != null) {
                log.info("Fixing missing price for order item ID: {} (product: {})", 
                         item.getId(), item.getProduct().getName());
                item.setPrice(item.getProduct().getPrice());
                itemUpdated = true;
                needsUpdate = true;
            }
            
            // Calculate line total
            if (item.getPrice() != null && item.getQuantity() != null) {
                java.math.BigDecimal lineTotal = item.getPrice().multiply(new java.math.BigDecimal(item.getQuantity()));
                calculatedSubtotal = calculatedSubtotal.add(lineTotal);
            }
        }
        
        // Verify and fix the order total
        java.math.BigDecimal shippingCost = order.getShippingCost() != null ? order.getShippingCost() : java.math.BigDecimal.ZERO;
        java.math.BigDecimal calculatedTotal = calculatedSubtotal.add(shippingCost);
        
        // Only update if total is different
        if (order.getTotal() == null || 
            calculatedTotal.compareTo(order.getTotal()) != 0 || 
            calculatedSubtotal.compareTo((order.getSubtotal() != null) ? order.getSubtotal() : java.math.BigDecimal.ZERO) != 0) {
            
            log.info("Fixing order totals for order ID: {}. Original: subtotal={}, total={}. Calculated: subtotal={}, total={}", 
                    order.getId(), 
                    order.getSubtotal(), 
                    order.getTotal(), 
                    calculatedSubtotal, 
                    calculatedTotal);
            
            order.setSubtotal(calculatedSubtotal);
            order.setTotal(calculatedTotal);
            needsUpdate = true;
        }
        
        if (needsUpdate) {
            try {
                orderRepository.save(order);
                log.info("Updated order with fixed prices and totals, order ID: {}", order.getId());
            } catch (Exception e) {
                // Just log the error, don't throw - we still want to generate the receipt
                log.warn("Failed to save order with fixed prices: {}", e.getMessage());
            }
        }
    }
}
