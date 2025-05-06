package com.mandala.controller;

import com.mandala.models.Receipt;
import com.mandala.repository.ReceiptRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.nio.file.Files;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/receipts")
public class ReceiptController {

    private final ReceiptRepository receiptRepository;

    @GetMapping("/download/{orderId}")
    public ResponseEntity<ByteArrayResource> downloadReceipt(@PathVariable Long orderId) {
        Receipt receipt = receiptRepository.findByOrderId(orderId)
                .orElseThrow(() -> new RuntimeException("Receipt not found for order " + orderId));

        byte[] data = receipt.getContent();

        // fallback if content is not saved in DB
        if (data == null || data.length == 0) {
            try {
                File file = new File(receipt.getFilePath());
                if (!file.exists()) {
                    throw new RuntimeException("Receipt file not found");
                }
                data = Files.readAllBytes(file.toPath());
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
            }
        }

        ByteArrayResource resource = new ByteArrayResource(data);

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + receipt.getFileName() + "\"")
                .body(resource);
    }
}
