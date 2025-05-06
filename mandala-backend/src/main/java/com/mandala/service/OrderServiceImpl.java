package com.mandala.service;

import com.mandala.dto.*;
import com.mandala.models.*;
import com.mandala.repository.OrderRepository;
import com.mandala.repository.ProductRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    @Override
    @Transactional
    public OrderResponseDTO placeOrder(User user, OrderRequestDTO request) {
        Order order = new Order();
        order.setUser(user);
        order.setOrderNumber(UUID.randomUUID().toString());
        order.setOrderDate(LocalDateTime.now());
        order.setStatus(Order.Status.PENDING);
        order.setPaymentMethod(request.getPaymentMethod());

        Address address = new Address();
        address.setStreet(request.getShippingAddress().getStreet());
        address.setCity(request.getShippingAddress().getCity());
        address.setState(request.getShippingAddress().getState());
        address.setZipCode(request.getShippingAddress().getZipCode());
        address.setCountry(request.getShippingAddress().getCountry());
        address.setUser(user);
        order.setShippingAddress(address);

        BigDecimal subtotal = BigDecimal.ZERO;
        Set<OrderItem> orderItems = new HashSet<>();

        for (CartItemDTO itemDTO : request.getItems()) {
            Product product = productRepository.findById(itemDTO.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found: " + itemDTO.getProductId()));

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setQuantity(itemDTO.getQuantity());
            orderItem.setSelectedColor(itemDTO.getSelectedColor());
            orderItem.setSelectedSize(itemDTO.getSelectedSize());

            BigDecimal itemTotal = product.getPrice().multiply(BigDecimal.valueOf(itemDTO.getQuantity()));
            subtotal = subtotal.add(itemTotal);

            orderItems.add(orderItem);
        }

        order.setItems(orderItems);
        order.setSubtotal(subtotal);
        order.setShippingCost(BigDecimal.valueOf(300)); // Flat shipping
        order.setTotal(subtotal.add(order.getShippingCost()));
        order.setPaid(false);

        Order savedOrder = orderRepository.save(order);
        return mapToDto(savedOrder);
    }

    @Override
    public List<OrderResponseDTO> getUserOrders(User user) {
        return orderRepository.findByUserId(user.getId()).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }
    @Override
    public List<OrderResponseDTO> getAllOrders() {
        return orderRepository.findAll().stream()
            .map(this::mapToDto)
            .collect(Collectors.toList());
    }
    
    @Override
    public OrderResponseDTO getOrderDetails(User user, Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (!order.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized access to order");
        }

        return mapToDto(order);
    }

    // @Override
    // public List<OrderResponseDTO> getAllOrders() {
    //     return orderRepository.findAll().stream()
    //             .map(this::mapToDto)
    //             .collect(Collectors.toList());
    // }

    @Transactional
    public void updateOrderStatus(Long orderId, Order.Status status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        order.setStatus(status);
        orderRepository.save(order);
    }

    private OrderResponseDTO mapToDto(Order order) {
        OrderResponseDTO dto = new OrderResponseDTO();
        dto.setId(order.getId());
        dto.setOrderNumber(order.getOrderNumber());
        dto.setOrderDate(order.getOrderDate());
        dto.setStatus(order.getStatus());
        dto.setTotal(order.getTotal());
        dto.setSubtotal(order.getSubtotal());
        dto.setShippingCost(order.getShippingCost());
        dto.setPaid(order.isPaid());
        dto.setPaymentMethod(order.getPaymentMethod());

        dto.setUsername(order.getUser().getUsername());
        dto.setEmail(order.getUser().getEmail());

        AddressDTO addressDTO = new AddressDTO();
        addressDTO.setStreet(order.getShippingAddress().getStreet());
        addressDTO.setCity(order.getShippingAddress().getCity());
        addressDTO.setState(order.getShippingAddress().getState());
        addressDTO.setZipCode(order.getShippingAddress().getZipCode());
        addressDTO.setCountry(order.getShippingAddress().getCountry());
        dto.setShippingAddress(addressDTO);

        List<CartItemDTO> itemDTOs = order.getItems().stream().map(item -> {
            CartItemDTO ci = new CartItemDTO();
            ci.setProductId(item.getProduct().getId());
            ci.setQuantity(item.getQuantity());
            ci.setSelectedColor(item.getSelectedColor());
            ci.setSelectedSize(item.getSelectedSize());
            return ci;
        }).collect(Collectors.toList());

        dto.setItems(itemDTOs);
        return dto;
    }
}
