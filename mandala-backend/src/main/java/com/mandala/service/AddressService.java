package com.mandala.service;

import com.mandala.models.Address;
import com.mandala.models.User;
import com.mandala.repository.AddressRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AddressService {

    private final AddressRepository addressRepository;

    public Address saveAddress(Address address, User user) {
        address.setUser(user);
        return addressRepository.save(address);
    }
}
