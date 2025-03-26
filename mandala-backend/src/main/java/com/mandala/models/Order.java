package com.mandala.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    public enum Status {
        PENDING,
        PROCESSING,
        SHIPPED,
        DELIVERED,
        CANCELLED
    }

    public enum PaymentMethod {
        CREDIT_CARD,
        PAYPAL
    }

    private String orderNumber;
    private LocalDateTime orderDate = LocalDateTime.now();
    
    @Enumerated(EnumType.STRING)
    private Status status = Status.PENDING;
    
    private BigDecimal subtotal;
    private BigDecimal shippingCost;
    private BigDecimal total;
    
    @Enumerated(EnumType.STRING)
    private PaymentMethod paymentMethod;
    
    private String paymentId;
    private boolean isPaid = false;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
    
    // For repository methods
    @Column(insertable = false, updatable = false)
    private String username;
    
    @Column(insertable = false, updatable = false)
    private String email;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "shipping_address_id", referencedColumnName = "id")
    private Address shippingAddress;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<OrderItem> items = new HashSet<>();
    
    @PostLoad
    private void onLoad() {
        if (user != null) {
            this.username = user.getUsername();
            this.email = user.getEmail();
        }
    }
}