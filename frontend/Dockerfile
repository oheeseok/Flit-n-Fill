# 1단계: 빌드 단계 (Node.js 20 환경에서 리액트 앱을 빌드)
FROM node:20 AS build

# 애플리케이션 작업 디렉토리 설정
WORKDIR /app

# 패키지 파일들을 컨테이너의 작업 디렉토리로 복사
COPY package.json package-lock.json ./

# 필요한 패키지들을 설치
RUN npm install

# 애플리케이션 소스 코드 복사
COPY . .

# 리액트 애플리케이션을 빌드
RUN npm run build

# 2단계: 서버 단계 (Nginx를 사용하여 빌드된 파일을 서빙)
FROM nginx:alpine

# 빌드된 리액트 파일들을 Nginx 기본 웹 디렉토리로 복사
COPY --from=build /app/dist /usr/share/nginx/html


# Nginx가 사용하는 80번 포트 열기
EXPOSE 80

# Nginx 실행 명령
CMD ["nginx", "-g", "daemon off;"]