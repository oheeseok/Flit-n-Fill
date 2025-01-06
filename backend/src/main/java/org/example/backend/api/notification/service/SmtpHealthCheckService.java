package org.example.backend.api.notification.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.apache.commons.net.smtp.SMTPClient;
import org.apache.commons.net.smtp.SMTPReply;

@Service
public class SmtpHealthCheckService {

    @Value("${spring.mail.host}")
    private String smtpHost;

    @Value("${spring.mail.port}")
    private int smtpPort;

    public boolean checkSmtpHealth() {
        SMTPClient client = new SMTPClient();
        try {
            client.connect(smtpHost, smtpPort);
            int replyCode = client.getReplyCode();

            if (!SMTPReply.isPositiveCompletion(replyCode)) {
                client.disconnect();
                return false; // 실패
            }

            client.helo("localhost"); // EHLO/HELO 명령어 전송
            client.disconnect();
            return true; // 성공
        } catch (Exception e) {
            System.err.println("SMTP health check failed: " + e.getMessage());
            return false;
        }
    }
}
