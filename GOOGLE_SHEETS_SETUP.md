# Google Sheets API 설정 가이드

에어드롭 신청 데이터를 Google Sheets에 자동으로 저장하기 위한 설정 방법입니다.

## 1. Google Cloud Console 프로젝트 생성

1. [Google Cloud Console](https://console.cloud.google.com/)에 접속
2. 새 프로젝트 생성 또는 기존 프로젝트 선택
3. 프로젝트 이름: `satoshi-meme-airdrop` (또는 원하는 이름)

## 2. Google Sheets API 활성화

1. Google Cloud Console에서 "API 및 서비스" → "라이브러리" 클릭
2. "Google Sheets API" 검색 후 선택
3. "사용 설정" 클릭

## 3. 서비스 계정 생성 및 키 다운로드

1. "API 및 서비스" → "사용자 인증 정보" 클릭
2. "사용자 인증 정보 만들기" → "서비스 계정" 선택
3. 서비스 계정 정보 입력:
   - 서비스 계정 이름: `sheets-api-service`
   - 서비스 계정 ID: `sheets-api-service`
   - 설명: `For airdrop data collection`
4. "만들기 및 계속" 클릭
5. 역할에서 "편집자" 또는 "기본 > 편집자" 선택
6. "완료" 클릭
7. 생성된 서비스 계정 클릭
8. "키" 탭으로 이동
9. "키 추가" → "새 키 만들기" → "JSON" 선택
10. JSON 키 파일 다운로드 (안전한 곳에 보관)

## 4. Google Sheets 문서 생성 및 설정

1. [Google Sheets](https://sheets.google.com)에서 새 스프레드시트 생성
2. 문서 이름: `Satoshi Meme Airdrop Applications`
3. 첫 번째 행에 헤더 추가:
   - A1: `제출시간`
   - B1: `지갑주소`
   - C1: `이메일`
   - D1: `IP주소`
   - E1: `User Agent`

4. 스프레드시트 URL에서 ID 복사:
   ```
   https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit#gid=0
   ```
   여기서 `SPREADSHEET_ID` 부분이 필요한 ID입니다.

5. **중요**: 스프레드시트를 서비스 계정과 공유
   - 스프레드시트에서 "공유" 클릭
   - 서비스 계정 이메일 주소 입력 (JSON 키 파일의 `client_email` 값)
   - 권한: "편집자"로 설정
   - "보내기" 클릭

## 5. 환경 변수 설정

1. 프로젝트 루트에 `.env.local` 파일 생성
2. 다운로드한 JSON 키 파일에서 값들을 복사하여 설정:

```env
# Google Service Account 정보 (JSON 키 파일에서 복사)
GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n실제_프라이빗_키_내용\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEETS_CLIENT_EMAIL="sheets-api-service@your-project.iam.gserviceaccount.com"

# Google Sheets 문서 ID
GOOGLE_SHEETS_SPREADSHEET_ID="your_actual_spreadsheet_id"

# 기존 설정들
NEXT_PUBLIC_GTM_ID="GTM-XXXXXXX"
NEXT_PUBLIC_GOOGLE_ADS_ID="AW-17384712576"
```

### 주의사항:
- `GOOGLE_SHEETS_PRIVATE_KEY`의 경우 JSON 파일의 `private_key` 값을 복사하되, 이스케이프 문자(`\n`)는 그대로 유지해야 합니다
- 절대로 JSON 키 파일을 Git에 커밋하지 마세요
- `.env.local` 파일도 `.gitignore`에 포함되어 있는지 확인하세요

## 6. 배포 환경 설정

### Netlify 환경 변수 설정:
1. Netlify 대시보드에서 사이트 선택
2. "Site settings" → "Environment variables" 클릭
3. 위의 환경 변수들을 모두 추가:
   - `GOOGLE_SHEETS_PRIVATE_KEY`
   - `GOOGLE_SHEETS_CLIENT_EMAIL`
   - `GOOGLE_SHEETS_SPREADSHEET_ID`

## 7. 테스트

1. 개발 서버 시작: `bun run dev`
2. 에어드롭 페이지에서 테스트 신청 제출
3. Google Sheets에 데이터가 자동으로 추가되는지 확인

## 문제 해결

### 일반적인 오류들:

1. **403 Forbidden 에러**:
   - 스프레드시트가 서비스 계정과 공유되었는지 확인
   - 서비스 계정에 편집 권한이 있는지 확인

2. **Private key 오류**:
   - 환경 변수의 private_key에서 `\n` 문자가 올바르게 설정되었는지 확인
   - 따옴표 안에 전체 키가 포함되었는지 확인

3. **Spreadsheet not found**:
   - SPREADSHEET_ID가 올바른지 확인
   - 스프레드시트가 존재하고 접근 가능한지 확인

## 데이터 확인

성공적으로 설정되면 에어드롭 신청 시마다 다음 정보가 Google Sheets에 자동 저장됩니다:
- 제출 시간 (한국 시간)
- 지갑 주소
- 이메일 (선택사항)
- 신청자 IP 주소
- 브라우저 정보 (User Agent)

이를 통해 중복 신청 방지 및 신청자 관리를 효율적으로 할 수 있습니다.
