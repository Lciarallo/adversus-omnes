import puppeteer from 'puppeteer-core';
import { spawn } from 'child_process';

async function main() {
  const targetUrl = process.argv[2] || 'http://localhost:4173';
  let serverProcess = null;

  if (targetUrl.includes('localhost:4173')) {
    serverProcess = spawn('npx', ['vite', 'preview', '--port', '4173'], {
      stdio: 'ignore'
    });
    // Wait for preview server to start
    await new Promise(r => setTimeout(r, 1200));
  }

  const browser = await puppeteer.launch({
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium-browser',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--headless=new']
  });

  const viewports = [
    { name: 'Small Phone (320px)', width: 320, height: 568 },
    { name: 'Android Typical (360px)', width: 360, height: 800 },
    { name: 'iPhone SE (375px)', width: 375, height: 667 },
    { name: 'iPhone Standard (390px)', width: 390, height: 844 },
    { name: 'iPhone Pro Max (430px)', width: 430, height: 932 }
  ];

  console.log(`\n🔍 Executando auditoria de estouro horizontal móvel em: ${targetUrl}\n`);
  let totalErrors = 0;

  for (const vp of viewports) {
    const page = await browser.newPage();
    await page.setViewport(vp);
    await page.goto(targetUrl, { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 400));

    const metrics = await page.evaluate(() => {
      const docEl = document.documentElement;
      const body = document.body;
      const scrollWidth = Math.max(docEl.scrollWidth, body.scrollWidth);
      const clientWidth = docEl.clientWidth;
      return { scrollWidth, clientWidth, overflowX: scrollWidth - clientWidth };
    });

    if (metrics.overflowX > 0) {
      console.error(`❌ [${vp.name}]: Estouro de ${metrics.overflowX}px (scroll: ${metrics.scrollWidth}px, tela: ${metrics.clientWidth}px)`);
      totalErrors++;
    } else {
      console.log(`✅ [${vp.name}]: 0px de estouro horizontal (perfeitamente alinhado a ${metrics.clientWidth}px)`);
    }

    await page.close();
  }

  await browser.close();

  if (serverProcess) {
    serverProcess.kill();
  }

  console.log(totalErrors === 0 ? '\n🎉 Todos os viewports aprovados com 0px de estouro!' : `\n⚠️ Total de falhas: ${totalErrors}`);
  process.exit(totalErrors === 0 ? 0 : 1);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
