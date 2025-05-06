package com.mandala.dto;

import com.mandala.models.PaymentMethod;
import lombok.Data;

@Data
public class PaymentSummaryDTO {
    private Long orderId;
    private String username;
    private String street;
    private String city;
    private String state;
    private String zipCode;
    private String country;
    private PaymentMethod paymentMethod;
    private double total;
}
