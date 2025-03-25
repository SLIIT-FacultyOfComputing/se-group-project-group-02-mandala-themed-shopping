package com.mandala.Service;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.mandala.Model.User;
import com.mandala.Repo.UserRepo;

import jakarta.persistence.EntityManager;
import jakarta.persistence.metamodel.Attribute;
import jakarta.persistence.metamodel.EntityType;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;

@Service
public class UserService implements UserDetailsService {
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private EntityManager entityManager;
    @Autowired
    private UserRepo userRepo;
    public String addUser(Map<String, String> data) {
        User user = new User();
        for (String field : getFields()) {
            if (data.get(field) == null) {
                System.out.println(field);
                return "Value Missing";
            }
            if (field.equals("password")) {
                String res = passwordEncoder.encode(data.get("password"));
                data.put("password", res);
            }
            try {
                String methodName = "set" + field.substring(0, 1).toUpperCase() + field.substring(1);
                Method setter = User.class.getMethod(methodName, String.class);
                setter.invoke(user, data.get(field));
            } catch (NoSuchMethodException | NoSuchFieldError | IllegalAccessException | InvocationTargetException e) {
                e.printStackTrace();
                return "Random error occured Please Try again";
            }
        }
        
        user.setRole("USER");
        userRepo.save(user);
        return "successful";
    }

    @Override
    public User loadUserByUsername(String username) {
        return userRepo.findByUsername(username);
    }

    public Boolean loginUser(Map<String, String> data) {
        String username = data.get("username");
        String password = data.get("password");
        if (username == null || password == null) {
            return false;
        }
        User user = userRepo.findByUsername(username);
        if (user == null || !passwordEncoder.matches(password, user.getPassword())) {
            return false;
        }
        return true;
    }

    public String[] getFields() {
        EntityType<User> entityType = entityManager.getMetamodel().entity(User.class);
        List<String> columnNames = new ArrayList<>();
        for (Attribute<? super User, ?> attribute : entityType.getAttributes()) {
            if (attribute.getName() == "id" || attribute.getName() == "createdAt" || attribute.getName() == "role" || attribute.getName() == "updatedAt")
                continue;
            columnNames.add(attribute.getName());
        }
        return columnNames.toArray(new String[0]);
    }
}
