package com.mandala.dto;

import com.mandala.models.Order.Status;
import com.mandala.models.Order.PaymentMethod;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class OrderResponseDTO {
    private Long id;
    private String orderNumber;
    private LocalDateTime orderDate;
    private Status status;
    private BigDecimal subtotal;
    private BigDecimal shippingCost;
    private BigDecimal total;
    private PaymentMethod paymentMethod;
    private boolean isPaid;
    private String username;
    private String email;
    private AddressDTO shippingAddress;
    private List<CartItemDTO> items;
}
