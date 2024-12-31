# Step 1: OpenJDK 17 Alpine 이미지를 사용
FROM openjdk:17-alpine

# Step 2: 작업 디렉토리 설정
WORKDIR /app

# Step 3: JAR 파일을 Docker 이미지로 복사
COPY ./build/libs/backend-0.0.1-SNAPSHOT.jar /app/backend.jar

# Step 4: MySQL이 준비될 때까지 대기 (30초 대기)
CMD sleep 10 && java -jar /app/backend.jar

