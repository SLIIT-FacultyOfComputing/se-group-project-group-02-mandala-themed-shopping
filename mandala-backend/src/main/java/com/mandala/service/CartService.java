package com.mandala.service;

import com.mandala.dto.CartItemDTO;
import com.mandala.models.Cart;
import com.mandala.models.CartItem;
import com.mandala.models.Product;
import com.mandala.models.User;
import com.mandala.repository.CartItemRepository;
import com.mandala.repository.CartRepository;
import com.mandala.repository.ProductRepository;
import com.mandala.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    /**
     * Adds a product to the user's cart. Creates the cart if it doesn't exist.
     */
    public void addToCart(Long userId, Long productId) {
        // Get product
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found: " + productId));

        // Get user
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        // Get or create user's cart
        Cart cart = null;
        Optional<Cart> optionalCart = cartRepository.findByUserId(userId);
        if (optionalCart.isPresent()) {
            cart = optionalCart.get();
        } else {
            cart = new Cart();
            cart.setUser(user);
            cart.setItems(new HashSet<>());
            cart = cartRepository.save(cart);
        }

        // Check if product already in the cart
        boolean itemExists = false;
        for (CartItem item : cart.getItems()) {
            if (item.getProduct().getId().equals(productId)) {
                item.setQuantity(item.getQuantity() + 1); // increment quantity
                itemExists = true;
                break;
            }
        }

        // If not in cart, add new item
        if (!itemExists) {
            CartItem item = new CartItem();
            item.setCart(cart);
            item.setProduct(product);
            item.setQuantity(1);
            cart.getItems().add(item);
        }

        cartRepository.save(cart);
    }

    /**
     * Processes checkout using a list of items and persists the cart.
     */
    public void processCheckout(User user, List<CartItemDTO> items) {
        Cart cart = new Cart();
        cart.setUser(user);
        cart.setItems(new HashSet<>());

        for (CartItemDTO dto : items) {
            Product product = productRepository.findById(dto.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found: " + dto.getProductId()));

            CartItem item = new CartItem();
            item.setProduct(product);
            item.setQuantity(dto.getQuantity());
            item.setCart(cart);

            cart.getItems().add(item);
        }

        cartRepository.save(cart);
    }
}
