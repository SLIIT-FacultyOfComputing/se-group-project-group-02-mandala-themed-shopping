package com.mandala.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SupabaseStorageServiceImpl implements FileStorageService {

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${supabase.storage.url}")
    private String supabaseStorageUrl;

    @Value("${supabase.api.key}")
    private String supabaseApiKey;

    @Value("${supabase.bucket.name}")
    private String bucketName;

    @Override
    public String uploadFile(MultipartFile file, String originalFileName) {
        try {
            if (file.isEmpty()) {
                throw new RuntimeException("Failed to upload empty file");
            }

            String fileName = UUID.randomUUID() + "-" + originalFileName.replaceAll("\\s+", "-");
            String uploadUrl = supabaseStorageUrl + "/object/" + bucketName + "/" + fileName;

            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + supabaseApiKey);
            headers.set("Content-Type", file.getContentType());
            headers.set("Cache-Control", "3600");

            HttpEntity<byte[]> requestEntity = new HttpEntity<>(file.getBytes(), headers);

            ResponseEntity<String> response = restTemplate.exchange(
                    uploadUrl,
                    HttpMethod.POST,
                    requestEntity,
                    String.class
            );

            if (response.getStatusCode().is2xxSuccessful()) {
                return supabaseStorageUrl + "/object/public/" + bucketName + "/" + fileName;
            } else {
                throw new RuntimeException("Failed to upload file to Supabase: " + response.getBody());
            }
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload file", e);
        }
    }

    @Override
    public void deleteFile(String fileUrl) {
        try {
            if (fileUrl == null || fileUrl.isBlank()) {
                return;
            }

            String fileName = fileUrl.substring(fileUrl.lastIndexOf("/") + 1);
            String deleteUrl = supabaseStorageUrl + "/object/" + bucketName + "/" + fileName;

            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + supabaseApiKey);

            HttpEntity<MultiValueMap<String, String>> requestEntity = new HttpEntity<>(new LinkedMultiValueMap<>(), headers);

            restTemplate.exchange(
                    deleteUrl,
                    HttpMethod.DELETE,
                    requestEntity,
                    String.class
            );
        } catch (Exception e) {
            throw new RuntimeException("Failed to delete file", e);
        }
    }
} 