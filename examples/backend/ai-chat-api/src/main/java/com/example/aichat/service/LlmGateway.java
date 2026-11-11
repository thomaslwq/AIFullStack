package com.example.aichat.service;

import com.example.aichat.common.BizException;
import com.example.aichat.dto.LlmMessage;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.List;
import java.util.Map;

/**
 * 大模型网关：后端统一代理模型调用，密钥不暴露给前端。
 * 生产环境应增加连接池、超时、熔断与重试。
 */
@Service
public class LlmGateway {

    private final HttpClient httpClient = HttpClient.newHttpClient();
    private final ObjectMapper mapper = new ObjectMapper();

    private final String baseUrl;
    private final String apiKey;

    public LlmGateway(@Value("${app.llm.base-url}") String baseUrl,
                      @Value("${app.llm.api-key}") String apiKey) {
        this.baseUrl = baseUrl;
        this.apiKey = apiKey;
    }

    public String chat(List<LlmMessage> messages) {
        try {
            var body = Map.of(
                    "model", "gpt-4o-mini",
                    "messages", messages,
                    "temperature", 0.3,
                    "max_tokens", 1024
            );

            HttpRequest request = HttpRequest.newBuilder(URI.create(baseUrl + "/chat/completions"))
                    .header("Content-Type", "application/json")
                    .header("Authorization", "Bearer " + apiKey)
                    .POST(HttpRequest.BodyPublishers.ofString(mapper.writeValueAsString(body)))
                    .build();

            HttpResponse<String> resp = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (resp.statusCode() >= 400) {
                throw new BizException(502, "模型服务暂时不可用");
            }

            JsonNode root = mapper.readTree(resp.body());
            return root.path("choices").get(0)
                    .path("message").path("content").asText();
        } catch (BizException e) {
            throw e;
        } catch (Exception e) {
            throw new BizException(502, "调用模型失败：" + e.getMessage());
        }
    }
}
