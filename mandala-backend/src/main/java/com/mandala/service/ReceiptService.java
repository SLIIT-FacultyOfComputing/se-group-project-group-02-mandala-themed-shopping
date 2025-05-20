package com.mandala.service;

import com.mandala.models.Order;
import jakarta.transaction.Transactional;

public interface ReceiptService {
    /**
     * Generates a PDF receipt for the given order
     * 
     * @param order the order to generate receipt for
     * @return byte array containing the PDF data
     * @throws Exception if the generation fails
     */
    @Transactional
    byte[] generateReceiptPdf(Order order) throws Exception;
    
    /**
     * Regenerates and saves a receipt for the given order
     * 
     * @param orderId the order ID to regenerate receipt for
     * @return the path to the receipt
     * @throws Exception if the generation fails
     */
    @Transactional
    String regenerateReceipt(Long orderId) throws Exception;
} 