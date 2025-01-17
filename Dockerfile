# 첫 번째 단계: 빌드 단계
FROM node:16-alpine AS builder

WORKDIR /app/website_be

# 소스 코드와 package.json 파일을 복사
ADD website_be/package.json website_be/package-lock.json ./

# 의존성 설치
RUN npm install

# 나머지 소스 코드를 복사
ADD website_be /app/website_be

# 애플리케이션 빌드
RUN npm run build

# 두 번째 단계: 실행 단계
FROM node:16-alpine

WORKDIR /app

# 빌드 단계에서 생성된 빌드 아티팩트만 복사
COPY --from=builder /app/website_be/dist /app/dist
COPY --from=builder /app/website_be/package.json /app/website_be/package-lock.json /app/

# 프로덕션 의존성만 설치
RUN npm install --only=production

# 애플리케이션 포트 노출
EXPOSE 3000

# 애플리케이션 시작 명령
ENTRYPOINT ["npm", "run", "start:prod"]
