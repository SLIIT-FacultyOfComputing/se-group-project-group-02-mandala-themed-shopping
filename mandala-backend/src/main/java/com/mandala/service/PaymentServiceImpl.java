package com.mandala.service;

import com.itextpdf.text.Document;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.pdf.PdfWriter;
import com.mandala.dto.PaymentRequestDTO;
import com.mandala.dto.PaymentResponseDTO;
import com.mandala.models.Order;
import com.mandala.models.OrderItem;
import com.mandala.models.Receipt;
import com.mandala.repository.OrderRepository;
import com.mandala.repository.ReceiptRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileOutputStream;
import java.nio.file.Files;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final OrderRepository orderRepository;
    private final ReceiptRepository receiptRepository;

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
            receiptPath = generateAndSaveReceipt(order);
        } catch (Exception e) {
            throw new RuntimeException("Receipt generation failed: " + e.getMessage());
        }

        return new PaymentResponseDTO(true, "Payment successful", receiptPath);
    }

    private String generateAndSaveReceipt(Order order) throws Exception {
        String folderPath = System.getProperty("user.dir") + "/receipts/";
        new File(folderPath).mkdirs();

        String fileName = "receipt_" + order.getId() + ".pdf";
        String filePath = folderPath + fileName;

        // Generate PDF
        Document document = new Document();
        PdfWriter.getInstance(document, new FileOutputStream(filePath));
        document.open();

        document.add(new Paragraph("🧾 Receipt for Order #" + order.getOrderNumber()));
        document.add(new Paragraph("Order ID: " + order.getId()));
        document.add(new Paragraph("Date: " + order.getOrderDate()));
        document.add(new Paragraph("Status: " + order.getStatus()));
        document.add(new Paragraph("Payment Method: " + order.getPaymentMethod()));
        document.add(new Paragraph(" "));

        var addr = order.getShippingAddress();
        document.add(new Paragraph("🏠 Shipping Address"));
        document.add(new Paragraph(addr.getStreet() + ", " + addr.getCity()));
        document.add(new Paragraph(addr.getState() + ", " + addr.getZipCode()));
        document.add(new Paragraph(addr.getCountry()));
        document.add(new Paragraph(" "));

        document.add(new Paragraph("📦 Items"));
        for (OrderItem item : order.getItems()) {
            document.add(new Paragraph("- " + item.getProduct().getName()
                    + " x" + item.getQuantity()
                    + " - Rs. " + item.getPrice()));
        }

        document.add(new Paragraph(" "));
        document.add(new Paragraph("💰 Total: Rs. " + order.getTotal()));
        document.close();

        // Save receipt record
        Receipt receipt = new Receipt();
        receipt.setOrder(order);
        receipt.setFileName(fileName);
        receipt.setFilePath(filePath);
        receipt.setContent(Files.readAllBytes(new File(filePath).toPath()));
        receipt.setCreatedAt(LocalDateTime.now());

        receiptRepository.save(receipt);

        return "/api/receipts/download/" + order.getId(); // frontend will use this to trigger download
    }

    @Override
    public ResponseEntity<byte[]> generateReceiptPdf(Long orderId) {
        throw new UnsupportedOperationException("This method is not implemented yet.");
    }
}
