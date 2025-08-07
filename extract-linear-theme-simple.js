const { chromium } = require('playwright');
const fs = require('fs');

async function extractLinearTheme() {
  console.log('브라우저 실행 중...');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 200
  });
  
  const page = await browser.newPage();
  
  try {
    console.log('Linear 페이지 로딩 시도 중...');
    
    // 간단한 로딩 전략 - 타임아웃을 없애고 기본 로딩만 기다림
    await page.goto('https://linear.app/', { 
      waitUntil: 'load', // domcontentloaded보다 더 기본적인 조건
      timeout: 0 // 타임아웃 제거
    });
    
    console.log('기본 페이지 로딩 완료, 3초 대기...');
    await page.waitForTimeout(3000);
    
    console.log('테마 데이터 추출 시작...');
    
    // 간단한 테마 데이터 추출
    const themeData = await page.evaluate(() => {
      const theme = {
        timestamp: new Date().toISOString(),
        url: window.location.href,
        colors: {},
        typography: {},
        cssVariables: {}
      };
      
      // CSS 변수 추출
      const rootStyles = getComputedStyle(document.documentElement);
      for (let i = 0; i < rootStyles.length; i++) {
        const property = rootStyles[i];
        if (property.startsWith('--')) {
          theme.cssVariables[property] = rootStyles.getPropertyValue(property).trim();
        }
      }
      
      // Body 스타일
      const bodyStyles = getComputedStyle(document.body);
      theme.body = {
        backgroundColor: bodyStyles.backgroundColor,
        color: bodyStyles.color,
        fontFamily: bodyStyles.fontFamily,
        fontSize: bodyStyles.fontSize
      };
      
      // 모든 버튼 찾기
      const buttons = document.querySelectorAll('button');
      theme.buttons = [];
      for (let i = 0; i < Math.min(buttons.length, 5); i++) {
        const btn = buttons[i];
        const styles = getComputedStyle(btn);
        theme.buttons.push({
          backgroundColor: styles.backgroundColor,
          color: styles.color,
          borderRadius: styles.borderRadius,
          padding: styles.padding,
          fontSize: styles.fontSize
        });
      }
      
      return theme;
    });
    
    // 결과 저장
    const fileName = `linear-theme-simple-${new Date().toISOString().split('T')[0]}.json`;
    fs.writeFileSync(fileName, JSON.stringify(themeData, null, 2));
    
    console.log(`테마 데이터가 ${fileName}에 저장되었습니다.`);
    console.log(`CSS 변수 개수: ${Object.keys(themeData.cssVariables).length}`);
    console.log(`버튼 스타일 개수: ${themeData.buttons.length}`);
    
    return themeData;
    
  } catch (error) {
    console.error('오류 발생:', error.message);
    console.log('페이지 상태를 확인해보세요...');
  } finally {
    console.log('브라우저를 5초 후에 닫습니다...');
    await page.waitForTimeout(5000);
    await browser.close();
  }
}

// 실행
extractLinearTheme().then(() => {
  console.log('완료!');
}).catch(error => {
  console.error('스크립트 오류:', error);
});
