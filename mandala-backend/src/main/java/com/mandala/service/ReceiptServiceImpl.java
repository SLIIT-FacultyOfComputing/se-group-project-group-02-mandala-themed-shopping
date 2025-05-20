package com.mandala.service;

import com.itextpdf.text.Document;
import com.itextpdf.text.Element;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.Chunk;
import com.itextpdf.text.Font;
import com.itextpdf.text.BaseColor;
import com.itextpdf.text.Phrase;
import com.itextpdf.text.PageSize;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import com.mandala.models.Order;
import com.mandala.models.OrderItem;
import com.mandala.models.Receipt;
import com.mandala.repository.OrderRepository;
import com.mandala.repository.ReceiptRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.nio.file.Files;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReceiptServiceImpl implements ReceiptService {

    private final OrderRepository orderRepository;
    private final ReceiptRepository receiptRepository;
    
    private static final Font TITLE_FONT = new Font(Font.FontFamily.HELVETICA, 16, Font.BOLD);
    private static final Font HEADER_FONT = new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD);
    private static final Font NORMAL_FONT = new Font(Font.FontFamily.HELVETICA, 10, Font.NORMAL);
    private static final Font BOLD_FONT = new Font(Font.FontFamily.HELVETICA, 10, Font.BOLD);
    
    @Override
    @Transactional
    public String regenerateReceipt(Long orderId) throws Exception {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
                
        String folderPath = System.getProperty("user.dir") + "/receipts/";
        new File(folderPath).mkdirs();

        String fileName = "receipt_" + order.getId() + ".pdf";
        String filePath = folderPath + fileName;
        
        // Generate PDF to file
        byte[] pdfData = generateReceiptPdf(order);
        
        // Write to file first
        try (FileOutputStream fos = new FileOutputStream(filePath)) {
            fos.write(pdfData);
            log.info("Saved receipt file to disk: {}", filePath);
        }

        try {
            // Save receipt record as a fresh entity
            Receipt receipt = new Receipt();
            receipt.setOrder(order);
            receipt.setFileName(fileName);
            receipt.setFilePath(filePath);
            receipt.setContent(pdfData);
            receipt.setCreatedAt(LocalDateTime.now());

            receiptRepository.save(receipt);
            log.info("Receipt saved to database for order ID: {}", orderId);
        } catch (Exception e) {
            log.warn("Failed to save receipt to database: {}", e.getMessage());
            // Continue even if database save fails
        }
        
        log.info("Receipt regenerated for order ID: {}", orderId);
        return "/api/receipts/download/" + order.getId();
    }

    @Override
    public byte[] generateReceiptPdf(Order order) throws Exception {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4);
        PdfWriter writer = null;
        
        try {
            if (order == null) {
                throw new IllegalArgumentException("Cannot generate receipt for null order");
            }
            
            log.info("Starting PDF generation for order ID: {}", order.getId());
            
            writer = PdfWriter.getInstance(document, baos);
            document.open();
            
            // Use the detailed content generation method
            addReceiptContent(document, order);
            
            document.close();
            writer.close();
            
            byte[] pdfContent = baos.toByteArray();
            
            if (pdfContent.length == 0) {
                log.error("Generated PDF has zero bytes for order ID: {}", order.getId());
                throw new RuntimeException("Generated PDF has zero bytes");
            }
            
            log.info("PDF generated successfully, size: {} bytes", pdfContent.length);
            return pdfContent;
        } catch (DocumentException e) {
            log.error("PDF document error for order ID: {}: {}", order != null ? order.getId() : "unknown", e.getMessage(), e);
            throw new RuntimeException("Failed to create PDF document: " + e.getMessage(), e);
        } catch (Exception e) {
            log.error("Error generating PDF for order ID: {}: {}", order != null ? order.getId() : "unknown", e.getMessage(), e);
            throw e;
        } finally {
            try {
                if (document != null && document.isOpen()) {
                    document.close();
                }
                if (writer != null) {
                    writer.close();
                }
                baos.close();
            } catch (Exception e) {
                log.warn("Error closing resources", e);
            }
        }
    }
    
    private void addReceiptContent(Document document, Order order) throws DocumentException {
        // Title
        Paragraph title = new Paragraph("Mandala Receipt", TITLE_FONT);
        title.setAlignment(Element.ALIGN_CENTER);
        document.add(title);
        document.add(Chunk.NEWLINE);
        
        // Order Info
        String orderNumber = order.getOrderNumber() != null ? order.getOrderNumber() : "N/A";
        document.add(new Paragraph("🧾 Receipt for Order #" + orderNumber, HEADER_FONT));
        document.add(new Paragraph("Order ID: " + order.getId(), NORMAL_FONT));
        
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        // Safely handle order date
        String orderDate = "N/A";
        if (order.getOrderDate() != null) {
            orderDate = order.getOrderDate().format(formatter);
        }
        document.add(new Paragraph("Date: " + orderDate, NORMAL_FONT));
        
        // Safely handle status and payment method
        String status = order.getStatus() != null ? order.getStatus().toString() : "N/A";
        String paymentMethod = order.getPaymentMethod() != null ? order.getPaymentMethod().toString() : "N/A";
        
        document.add(new Paragraph("Status: " + status, NORMAL_FONT));
        document.add(new Paragraph("Payment Method: " + paymentMethod, NORMAL_FONT));
        document.add(Chunk.NEWLINE);

        // Shipping Address
        if (order.getShippingAddress() != null) {
            var addr = order.getShippingAddress();
            document.add(new Paragraph("🏠 Shipping Address", HEADER_FONT));
            
            // Safely handle address fields
            String street = addr.getStreet() != null ? addr.getStreet() : "";
            String city = addr.getCity() != null ? addr.getCity() : "";
            String addressLine1 = (street.isEmpty() && city.isEmpty()) ? "Address not available" : street + ", " + city;
            document.add(new Paragraph(addressLine1, NORMAL_FONT));
            
            String state = addr.getState() != null ? addr.getState() : "";
            String zipCode = addr.getZipCode() != null ? addr.getZipCode() : "";
            if (!state.isEmpty() || !zipCode.isEmpty()) {
                document.add(new Paragraph(state + ", " + zipCode, NORMAL_FONT));
            }
            
            String country = addr.getCountry() != null ? addr.getCountry() : "";
            if (!country.isEmpty()) {
                document.add(new Paragraph(country, NORMAL_FONT));
            }
            
            document.add(Chunk.NEWLINE);
        }

        // Items Table
        document.add(new Paragraph("📦 Items", HEADER_FONT));
        
        PdfPTable table = new PdfPTable(4);
        table.setWidthPercentage(100);
        try {
            table.setWidths(new float[]{5, 1, 2, 2});
        } catch (DocumentException e) {
            log.warn("Could not set table widths", e);
        }
        
        // Table Headers
        PdfPCell cell1 = new PdfPCell(new Phrase("Product", BOLD_FONT));
        PdfPCell cell2 = new PdfPCell(new Phrase("Qty", BOLD_FONT));
        PdfPCell cell3 = new PdfPCell(new Phrase("Price", BOLD_FONT));
        PdfPCell cell4 = new PdfPCell(new Phrase("Total", BOLD_FONT));
        
        cell1.setBackgroundColor(BaseColor.LIGHT_GRAY);
        cell2.setBackgroundColor(BaseColor.LIGHT_GRAY);
        cell3.setBackgroundColor(BaseColor.LIGHT_GRAY);
        cell4.setBackgroundColor(BaseColor.LIGHT_GRAY);
        
        table.addCell(cell1);
        table.addCell(cell2);
        table.addCell(cell3);
        table.addCell(cell4);
        
        // Recalculate the total from items
        java.math.BigDecimal calculatedSubtotal = java.math.BigDecimal.ZERO;
        
        // Table Data
        for (OrderItem item : order.getItems()) {
            // Handle possible null product
            String productName = "Unknown Product";
            if (item.getProduct() != null) {
                productName = item.getProduct().getName();
                // Add color/size if available
                if (item.getSelectedColor() != null && !item.getSelectedColor().isEmpty()) {
                    productName += " (" + item.getSelectedColor();
                    if (item.getSelectedSize() != null && !item.getSelectedSize().isEmpty()) {
                        productName += ", " + item.getSelectedSize();
                    }
                    productName += ")";
                } else if (item.getSelectedSize() != null && !item.getSelectedSize().isEmpty()) {
                    productName += " (" + item.getSelectedSize() + ")";
                }
            }
            table.addCell(new Phrase(productName, NORMAL_FONT));
            
            // Handle quantity
            int quantity = item.getQuantity() != null ? item.getQuantity() : 0;
            table.addCell(new Phrase(String.valueOf(quantity), NORMAL_FONT));
            
            // Handle possible null price
            java.math.BigDecimal price = item.getPrice() != null ? item.getPrice() : 
                (item.getProduct() != null ? item.getProduct().getPrice() : java.math.BigDecimal.ZERO);
            
            // Format price with commas for thousands
            String formattedPrice = String.format("%,.2f", price);
            table.addCell(new Phrase("Rs. " + formattedPrice, NORMAL_FONT));
            
            // Calculate total safely
            java.math.BigDecimal quantityBD = new java.math.BigDecimal(quantity);
            java.math.BigDecimal lineTotal = price.multiply(quantityBD);
            calculatedSubtotal = calculatedSubtotal.add(lineTotal);
            
            // Format line total with commas for thousands
            String formattedLineTotal = String.format("%,.2f", lineTotal);
            table.addCell(new Phrase("Rs. " + formattedLineTotal, NORMAL_FONT));
        }
        
        document.add(table);
        document.add(Chunk.NEWLINE);
        
        // Calculate the actual total
        java.math.BigDecimal shippingCost = order.getShippingCost() != null ? order.getShippingCost() : java.math.BigDecimal.ZERO;
        java.math.BigDecimal calculatedTotal = calculatedSubtotal.add(shippingCost);
        
        // Subtotal
        Paragraph subtotal = new Paragraph("Subtotal: Rs. " + String.format("%,.2f", calculatedSubtotal), NORMAL_FONT);
        subtotal.setAlignment(Element.ALIGN_RIGHT);
        document.add(subtotal);
        
        // Shipping
        Paragraph shipping = new Paragraph("Shipping: Rs. " + String.format("%,.2f", shippingCost), NORMAL_FONT);
        shipping.setAlignment(Element.ALIGN_RIGHT);
        document.add(shipping);
        
        // Total with calculated value
        String formattedTotal = String.format("%,.2f", calculatedTotal);
        Paragraph total = new Paragraph("💰 Total: Rs. " + formattedTotal, HEADER_FONT);
        total.setAlignment(Element.ALIGN_RIGHT);
        document.add(total);
        
        // Footer
        document.add(Chunk.NEWLINE);
        document.add(Chunk.NEWLINE);
        Paragraph footer = new Paragraph("Thank you for shopping with Mandala!", NORMAL_FONT);
        footer.setAlignment(Element.ALIGN_CENTER);
        document.add(footer);
    }
} 