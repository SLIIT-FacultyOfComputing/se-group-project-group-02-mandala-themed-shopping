package com.mandala.service;

import org.springframework.web.multipart.MultipartFile;

public interface FileStorageService {
    String uploadFile(MultipartFile file, String fileName);
    void deleteFile(String fileUrl);
} 