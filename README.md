# Theme Extractor

웹사이트의 테마 및 디자인 시스템을 자동으로 추출하는 도구입니다.

## 설치

```bash
npm install
```

## 사용법

### 기본 사용법

```bash
node extract-linear-theme.js
```

### 추출되는 데이터

- **색상 시스템**: 배경색, 텍스트 색상, 보더 색상 등
- **타이포그래피**: 폰트 패밀리, 크기, 굵기, 줄간격 등
- **스페이싱**: 마진, 패딩, 간격 등
- **레이아웃**: 디스플레이, 플렉스, 그리드 속성 등
- **컴포넌트 스타일**: 버튼, 카드, 헤딩 등의 스타일
- **CSS 변수**: 모든 CSS 커스텀 프로퍼티
- **메타 정보**: 뷰포트, 브라우저 정보 등

### 출력 파일

실행하면 다음 파일들이 생성됩니다:

- `linear-theme-YYYY-MM-DD.json`: 추출된 테마 데이터
- `linear-screenshot-YYYY-MM-DD.png`: 전체 페이지 스크린샷

### 대상 웹사이트 변경

`extract-linear-theme.js` 파일에서 URL을 수정하세요:

```javascript
await page.goto('https://your-website.com/', {
  waitUntil: 'domcontentloaded',
  timeout: 60000
});
```

### 특정 요소만 추출하기

파일 하단의 `extractSpecificElements` 함수를 사용할 수 있습니다:

```javascript
extractSpecificElements([
  '.primary-button',
  '.hero-section',
  '.navigation',
  '.card'
]).then(data => console.log(data));
```

## 추출된 데이터 구조

```json
{
  "body": {
    "colors": { "backgroundColor": "...", "color": "..." },
    "typography": { "fontFamily": "...", "fontSize": "..." },
    "spacing": { "margin": "...", "padding": "..." },
    "layout": { "display": "...", "flexDirection": "..." }
  },
  "navigation": { /* 네비게이션 스타일 */ },
  "buttons": [ /* 버튼 스타일 배열 */ ],
  "headings": { 
    "h1": { /* h1 스타일 */ },
    "h2": { /* h2 스타일 */ }
  },
  "cards": [ /* 카드/컨테이너 스타일 배열 */ ],
  "cssVariables": { /* CSS 변수들 */ },
  "viewport": { "width": 1920, "height": 1080 },
  "meta": { "title": "...", "url": "...", "timestamp": "..." }
}
```

## 문제 해결

### 로딩이 느린 경우
대기 시간을 늘려주세요:
```javascript
await page.waitForTimeout(8000); // 8초 대기
```

### 특정 요소가 추출되지 않는 경우
셀렉터를 수정하거나 추가하세요:
```javascript
navigation: document.querySelector('nav, header, [class*="nav"], [class*="header"], .your-nav-class'),
```

### 브라우저가 열리지 않는 경우
headless 모드로 실행하세요:
```javascript
const browser = await chromium.launch({ headless: true });
```

## 요구사항

- Node.js 14 이상
- Playwright
- 인터넷 연결

## 라이센스

MIT
