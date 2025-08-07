const { chromium } = require('playwright');
const fs = require('fs');

async function extractLinearTheme() {
  // 브라우저 실행
  const browser = await chromium.launch({ 
    headless: false, // 디버깅을 위해 브라우저 창을 보고 싶다면 false로 설정
    slowMo: 500, // 지연시간을 줄임
    args: [
      '--disable-blink-features=AutomationControlled',
      '--disable-web-security',
      '--disable-features=VizDisplayCompositor'
    ] // 브라우저 최적화 옵션
  });
  
  const page = await browser.newPage();
  
  // User-Agent 설정으로 봇 탐지 우회
  await page.setExtraHTTPHeaders({
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  
  // 뷰포트 설정
  await page.setViewportSize({ width: 1920, height: 1080 });
  
  try {
    console.log('Zighang 페이지 로딩 중...');

    // 더 관대한 로딩 조건으로 변경
    await page.goto('https://zighang.com/it/', {
      waitUntil: 'domcontentloaded', // networkidle 대신 domcontentloaded 사용
      timeout: 60000 // 타임아웃을 60초로 증가
    });
    
    console.log('페이지 기본 로딩 완료, 추가 로딩 대기 중...');
    
    // 페이지가 완전히 로드될 때까지 더 긴 시간 대기
    await page.waitForTimeout(8000);
    
    // 선택적으로 특정 엘리먼트가 로드될 때까지 대기
    try {
      await page.waitForSelector('body', { timeout: 10000 });
      console.log('body 엘리먼트 로딩 확인됨');
    } catch (e) {
      console.log('body 엘리먼트 대기 중 타임아웃, 계속 진행...');
    }
    
    // 추가 컴포넌트 로딩 대기
    console.log('컴포넌트 완전 로딩을 위해 추가 대기...');
    await page.waitForTimeout(3000);
    
    console.log('테마 데이터 추출 중...');
    
    // 테마 데이터 추출 스크립트 실행
    const themeData = await page.evaluate(() => {
      const theme = {
        colors: {},
        typography: {},
        spacing: {},
        components: {},
        layout: {}
      };
      
      // CSS 변수 추출 (Linear가 CSS 변수를 사용하는 경우)
      const rootStyles = getComputedStyle(document.documentElement);
      const cssVariables = {};
      
      // CSS 커스텀 프로퍼티 추출
      for (let i = 0; i < rootStyles.length; i++) {
        const property = rootStyles[i];
        if (property.startsWith('--')) {
          cssVariables[property] = rootStyles.getPropertyValue(property).trim();
        }
      }
      
      // 주요 엘리먼트들의 스타일 추출
      const elements = {
        body: document.body,
        navigation: document.querySelector('nav, header, [class*="nav"], [class*="header"]'),
        buttons: document.querySelectorAll('button, [role="button"], .button'),
        headings: document.querySelectorAll('h1, h2, h3, h4, h5, h6'),
        cards: document.querySelectorAll('[class*="card"], [class*="panel"], [class*="container"]'),
        links: document.querySelectorAll('a'),
        inputs: document.querySelectorAll('input, textarea, select')
      };
      
      // 색상 추출
      function extractColors(element) {
        if (!element) return {};
        const styles = getComputedStyle(element);
        return {
          backgroundColor: styles.backgroundColor,
          color: styles.color,
          borderColor: styles.borderColor,
          outlineColor: styles.outlineColor
        };
      }
      
      // 타이포그래피 추출
      function extractTypography(element) {
        if (!element) return {};
        const styles = getComputedStyle(element);
        return {
          fontFamily: styles.fontFamily,
          fontSize: styles.fontSize,
          fontWeight: styles.fontWeight,
          lineHeight: styles.lineHeight,
          letterSpacing: styles.letterSpacing
        };
      }
      
      // 스페이싱 추출
      function extractSpacing(element) {
        if (!element) return {};
        const styles = getComputedStyle(element);
        return {
          margin: styles.margin,
          padding: styles.padding,
          gap: styles.gap
        };
      }
      
      // 레이아웃 추출
      function extractLayout(element) {
        if (!element) return {};
        const styles = getComputedStyle(element);
        return {
          display: styles.display,
          flexDirection: styles.flexDirection,
          justifyContent: styles.justifyContent,
          alignItems: styles.alignItems,
          gridTemplateColumns: styles.gridTemplateColumns,
          width: styles.width,
          maxWidth: styles.maxWidth
        };
      }
      
      // body 스타일
      theme.body = {
        colors: extractColors(elements.body),
        typography: extractTypography(elements.body),
        spacing: extractSpacing(elements.body),
        layout: extractLayout(elements.body)
      };
      
      // 내비게이션 스타일
      if (elements.navigation) {
        theme.navigation = {
          colors: extractColors(elements.navigation),
          typography: extractTypography(elements.navigation),
          spacing: extractSpacing(elements.navigation),
          layout: extractLayout(elements.navigation)
        };
      }
      
      // 버튼 스타일들
      theme.buttons = [];
      elements.buttons.forEach((button, index) => {
        if (index < 10) { // 처음 10개 버튼만
          const buttonData = {
            className: button.className,
            colors: extractColors(button),
            typography: extractTypography(button),
            spacing: extractSpacing(button),
            layout: extractLayout(button),
            borderRadius: getComputedStyle(button).borderRadius,
            boxShadow: getComputedStyle(button).boxShadow,
            transform: getComputedStyle(button).transform,
            transition: getComputedStyle(button).transition
          };
          theme.buttons.push(buttonData);
        }
      });
      
      // 헤딩 스타일들
      theme.headings = {};
      elements.headings.forEach(heading => {
        const tagName = heading.tagName.toLowerCase();
        if (!theme.headings[tagName]) {
          theme.headings[tagName] = {
            colors: extractColors(heading),
            typography: extractTypography(heading),
            spacing: extractSpacing(heading)
          };
        }
      });
      
      // 카드/컨테이너 스타일들
      theme.cards = [];
      elements.cards.forEach((card, index) => {
        if (index < 5) { // 처음 5개 카드만
          const cardStyles = getComputedStyle(card);
          const cardData = {
            className: card.className,
            colors: extractColors(card),
            spacing: extractSpacing(card),
            layout: extractLayout(card),
            borderRadius: cardStyles.borderRadius,
            boxShadow: cardStyles.boxShadow,
            border: cardStyles.border,
            backdropFilter: cardStyles.backdropFilter
          };
          theme.cards.push(cardData);
        }
      });
      
      // CSS 변수들
      theme.cssVariables = cssVariables;
      
      // 뷰포트 및 브레이크포인트 정보
      theme.viewport = {
        width: window.innerWidth,
        height: window.innerHeight,
        devicePixelRatio: window.devicePixelRatio
      };
      
      // 메타 정보
      theme.meta = {
        title: document.title,
        url: window.location.href,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent
      };
      
      return theme;
    });
    
    // 추출된 데이터를 JSON 파일로 저장
    const fileName = `linear-theme-${new Date().toISOString().split('T')[0]}.json`;
    fs.writeFileSync(fileName, JSON.stringify(themeData, null, 2));
    
    console.log(`테마 데이터가 ${fileName} 파일로 저장되었습니다.`);
    console.log('추출된 주요 정보:');
    console.log(`- CSS 변수: ${Object.keys(themeData.cssVariables).length}개`);
    console.log(`- 버튼 스타일: ${themeData.buttons.length}개`);
    console.log(`- 카드 스타일: ${themeData.cards.length}개`);
    console.log(`- 헤딩 스타일: ${Object.keys(themeData.headings).length}개`);
    
    // 추가로 스크린샷도 저장
    await page.screenshot({ 
      path: `linear-screenshot-${new Date().toISOString().split('T')[0]}.png`,
      fullPage: true 
    });
    console.log('전체 페이지 스크린샷도 저장되었습니다.');
    
    return themeData;
    
  } catch (error) {
    console.error('오류가 발생했습니다:', error);
  } finally {
    await browser.close();
  }
}

// 스크립트 실행
extractLinearTheme().then(() => {
  console.log('테마 추출 완료!');
}).catch(error => {
  console.error('스크립트 실행 중 오류:', error);
});

// 사용법을 위한 추가 함수들
async function extractSpecificElements(selectors) {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('https://zighang.com/it/');
  
  const specificData = await page.evaluate((selectors) => {
    const results = {};
    
    selectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      results[selector] = [];
      
      elements.forEach(element => {
        const styles = getComputedStyle(element);
        results[selector].push({
          innerHTML: element.innerHTML.substring(0, 100), // 처음 100글자만
          styles: {
            backgroundColor: styles.backgroundColor,
            color: styles.color,
            fontSize: styles.fontSize,
            fontWeight: styles.fontWeight,
            padding: styles.padding,
            margin: styles.margin,
            borderRadius: styles.borderRadius,
            boxShadow: styles.boxShadow
          }
        });
      });
    });
    
    return results;
  }, selectors);
  
  await browser.close();
  return specificData;
}

// 특정 엘리먼트들을 추출하고 싶다면 이렇게 사용:
// extractSpecificElements([
//   '.primary-button',
//   '.hero-section',
//   '.navigation',
//   '.card'
// ]).then(data => console.log(data));