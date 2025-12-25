package com.mandala.dto;

import lombok.Data;

import java.util.List;

@Data
public class OrderCheckoutRequest {
    private AddressDTO address;
    private List<CartItemDTO> items;
    private String paymentMethod;  // Optional if using enums in Order
}
