package com.mandala.Controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.mandala.Service.UserService;
import com.mandala.Utills.JwtConfig;

@RestController
public class AuthenticationController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtConfig jwtConfig;

    @PostMapping(value = "/register")
    public String Register(@RequestParam Map<String, String> formData) {
        return userService.addUser(formData);
    }

    @PostMapping(value = "/login")
    public String Login(@RequestParam Map<String, String> formData) {
        if (userService.loginUser(formData)) {
            return jwtConfig.generateToken(formData.get("username"));
        }
        throw new RuntimeException("Invalid Credientials");
    }
}
