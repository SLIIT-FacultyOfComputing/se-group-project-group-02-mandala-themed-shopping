package com.mandala.dto;

import lombok.Data;

@Data
public class PaymentRequestDTO {
    private String paymentMethod; // CREDIT_CARD, PAYPAL, etc.
}
