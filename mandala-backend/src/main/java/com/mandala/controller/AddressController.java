package com.mandala.controller;

import com.mandala.models.Address;
import com.mandala.models.User;
import com.mandala.service.AddressService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/addresses")
@RequiredArgsConstructor
public class AddressController {

    private final AddressService addressService;

    @PostMapping("/checkout")
    public ResponseEntity<Address> saveAddressAtCheckout(
            @RequestBody Address address,
            @AuthenticationPrincipal User currentUser) {

        Address savedAddress = addressService.saveAddress(address, currentUser);
        return ResponseEntity.ok(savedAddress);
    }
}
