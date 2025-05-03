package com.mandala.dto;

import com.mandala.models.Order.PaymentMethod;
import lombok.Data;

import java.util.List;

@Data
public class OrderRequestDTO {
    private List<CartItemDTO> items;
    private PaymentMethod paymentMethod;
    private AddressDTO shippingAddress;
}
