# 빌드 스테이지
FROM node:20-alpine AS builder

# 작업 디렉터리 설정
WORKDIR /app

# 필요한 빌드 도구 설치
RUN apk add --no-cache python3 make g++ && npm install -g pnpm

# 루트 레벨의 패키지 파일들 복사
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./

# packages의 package.json 파일들 복사
COPY ./packages/backend ./packages/backend/
COPY ./packages/shared ./packages/shared/

# 의존성 설치 (husky 설치 건너뛰기)
RUN HUSKY=0 pnpm install --no-frozen-lockfile

# 소스 코드 복사
COPY ./packages/backend ./packages/backend
COPY ./packages/shared ./packages/shared
COPY ./tsconfig.json ./

# 백엔드 빌드
RUN cd ./packages/backend && pnpm build

# 프로덕션 스테이지
FROM node:20-alpine AS production

WORKDIR /app

# 필요한 런타임 도구 설치
RUN npm install -g pnpm

# 빌드 스테이지에서 필요한 파일들만 복사
COPY --from=builder /app/package.json /app/pnpm-workspace.yaml ./
COPY --from=builder /app/packages/backend/package.json ./packages/backend/
COPY --from=builder /app/packages/shared/package.json ./packages/shared/

# 프로덕션 의존성만 설치 (husky 설치 건너뛰기)
RUN HUSKY=0 pnpm install --no-frozen-lockfile --prod --ignore-scripts

# 빌드된 백엔드 파일들 복사
COPY --from=builder /app/packages/backend/dist ./packages/backend/dist

# shared 패키지 소스 복사
COPY --from=builder /app/packages/shared ./packages/shared

# 작업 디렉터리를 백엔드로 변경
WORKDIR /app/packages/backend

# 포트 설정
EXPOSE 3000

# 애플리케이션 실행
CMD ["node", "dist/main"]