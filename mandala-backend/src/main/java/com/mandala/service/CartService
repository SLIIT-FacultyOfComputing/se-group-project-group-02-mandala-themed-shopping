package com.mandala.service;

import com.mandala.dto.CartItemDTO;
import com.mandala.models.*;
import com.mandala.repository.CartItemRepository;
import com.mandala.repository.CartRepository;
import com.mandala.repository.ProductRepository;
import com.mandala.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CartService {
    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final CartItemRepository cartItemRepository;

    public Cart getUserCart(User user) {
        return cartRepository.findByUser(user).orElseGet(() -> {
            Cart newCart = new Cart();
            newCart.setUser(user);
            return cartRepository.save(newCart);
        });
    }

    public Cart addItemToCart(User user, CartItemDTO dto) {
        Cart cart = getUserCart(user);

        Product product = productRepository.findById(dto.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        CartItem item = new CartItem();
        item.setCart(cart);
        item.setProduct(product);
        item.setQuantity(dto.getQuantity());
        item.setSelectedColor(dto.getSelectedColor());
        item.setSelectedSize(dto.getSelectedSize());

        cart.getItems().add(item);
        cartItemRepository.save(item);
        return cartRepository.save(cart);
    }

    public Cart removeItemFromCart(User user, Long itemId) {
        Cart cart = getUserCart(user);
        cart.getItems().removeIf(item -> item.getId().equals(itemId));
        cartItemRepository.deleteById(itemId);
        return cartRepository.save(cart);
    }

    public void clearCart(User user) {
        Cart cart = getUserCart(user);
        cartItemRepository.deleteAll(cart.getItems());
        cart.getItems().clear();
        cartRepository.save(cart);
    }

    public void removeItem(User user, Long itemId) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'removeItem'");
    }
}
