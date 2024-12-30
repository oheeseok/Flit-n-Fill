package org.example.backend.api.s3;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.DeleteObjectRequest;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.backend.exceptions.S3FileNotDeletedException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URLDecoder;

@Service
@RequiredArgsConstructor
@Slf4j
public class S3Service {
    private final AmazonS3 amazonS3;

    @Value("${cloud.aws.s3.bucket}")
    private String bucketName;

    public String uploadFile(MultipartFile file, String folder) throws IOException {
        // 파일 이름 생성 (중복 방지)
        String fileName = folder + "/" + System.currentTimeMillis() + "_" + file.getOriginalFilename();

        // 파일 메타데이터 설정
        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentLength(file.getSize());
        metadata.setContentType(file.getContentType());

        // S3에 파일 업로드
        amazonS3.putObject(new PutObjectRequest(bucketName, fileName, file.getInputStream(), metadata));

        // 업로드된 파일의 URL 반환
        return amazonS3.getUrl(bucketName, fileName).toString();
    }

    public void deleteFile(String fileUrl) {
        try {
            if (fileUrl != null && ! fileUrl.isEmpty()) {
                if (fileUrl.contains("amazonaws.com")) {
                    // URL에서 파일 키 추출
                    String fileKey = fileUrl.substring(fileUrl.indexOf(".com/") + 5); // ".com/" 이후 경로 추출
                    fileKey = URLDecoder.decode(fileKey.trim(), "UTF-8"); // 디코딩 및 정리
//
//                    log.info("버킷 이름: {}", bucketName);
//                    log.info("파일 키: {}", fileKey);

                    // S3에서 파일 존재 확인
                    if (amazonS3.doesObjectExist(bucketName, fileKey)) {
                        amazonS3.deleteObject(new DeleteObjectRequest(bucketName, fileKey));
                        log.info("S3 파일 삭제됨: {}", fileKey);
                    } else {
                        log.warn("S3에서 파일이 존재하지 않음: {}", fileKey);
                    }
                }
            }
        } catch (Exception e) {
            log.error("파일 삭제 중 오류 발생: {}", e.getMessage());
            throw new S3FileNotDeletedException("파일 삭제 중 오류 발생");
        }
    }
}
