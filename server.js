const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
const port = 3000;

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.text({ type: 'text/html', limit: '10mb' }));

// Template with your exact styling
const getDocumentTemplate = (content, logoBase64) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>AI Generated Document</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@300;400;600;700&display=swap');

* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'Source Sans 3', sans-serif; background: #f5f5f5; color: #323E46; line-height: 1.5; }

.page { width: 210mm; min-height: 297mm; margin: 0 auto; background: white; position: relative; overflow: hidden; page-break-after: always; }
.page-content { padding: 15mm; }

.cover-page { background: linear-gradient(135deg, #4F6373 0%, #323E46 100%); display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; }
.logo { margin-bottom: -50px; height: 180px; }
.logo img { height: 100%; width: auto; max-width: 100%; object-fit: contain; }
h1 { color: #ECEDF4; font-size: 54px; font-weight: 300; margin-bottom: 20px; }
.subtitle { color: #B2BFCA; font-size: 22px; font-weight: 300; }

h2 { color: #4F6373; font-size: 28px; font-weight: 600; margin-bottom: 16px; padding-bottom: 6px; position: relative; }
h2::after { content: ''; position: absolute; bottom: 0; left: 0; width: 60px; height: 3px; background: #1FBCBC; }

p { font-size: 14px; margin-bottom: 12px; color: #4F6373; }

.section-box { background: #ECEDF4; padding: 14px; margin: 12px 0; }

.industries { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin: 10px 0; }
.industry-card { background: linear-gradient(135deg, #ECEDF4 0%, #fff 100%); padding: 10px; border-left: 4px solid #1FBCBC; font-weight: 600; font-size: 13px; color: #323E46; }

.profile-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin: 10px 0; }
.profile-item { padding: 10px; background: #ECEDF4; border-radius: 4px; }
.profile-label { font-size: 11px; font-weight: 600; color: #788DA5; text-transform: uppercase; margin-bottom: 4px; }
.profile-value { font-size: 14px; font-weight: 600; color: #323E46; }

.pain-points, .solutions { list-style: none; margin: 10px 0; }
.pain-points li, .solutions li { padding: 10px 12px 10px 36px; margin: 6px 0; background: #ECEDF4; position: relative; font-size: 13px; transform: skewX(-3deg); }
.pain-points li > *, .solutions li > * { transform: skewX(3deg); display: inline-block; }
.pain-points li::before { content: '✕'; position: absolute; left: 14px; top: 50%; transform: translateY(-50%) skewX(3deg); color: #4F6373; font-weight: 700; font-size: 16px; }
.solutions li::before { content: '✓'; position: absolute; left: 14px; top: 50%; transform: translateY(-50%) skewX(3deg); color: #1FBCBC; font-weight: 700; font-size: 16px; }

.personas-table { width: 100%; border-collapse: collapse; font-size: 12px; margin: 8px 0; }
.personas-table thead { background: #4F6373; color: white; }
.personas-table th, .personas-table td { padding: 8px; text-align: left; }
.personas-table td { border-bottom: 1px solid #B2BFCA; }
.persona-role { color: #1FBCBC; font-weight: 700; }

.snapshot-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin: 8px 0; }
.snapshot-card { background: linear-gradient(135deg, #4F6373 0%, #323E46 100%); padding: 14px; color: white; }
.snapshot-attribute { font-size: 10px; font-weight: 600; color: #B2BFCA; text-transform: uppercase; margin-bottom: 4px; }
.snapshot-value { font-size: 14px; font-weight: 700; color: #1FBCBC; }

.cta-box { background: linear-gradient(135deg, #1FBCBC 0%, #4F6373 100%); padding: 20px; color: white; margin: 12px 0; }
.cta-box h2 { font-size: 22px; margin-bottom: 10px; color: white; }
.cta-box h2::after { display: none; }
.cta-point { font-size: 13px; font-weight: 600; padding: 10px; margin-bottom: 6px; background: rgba(255,255,255,0.15); transform: skewX(-3deg); }
.cta-point > * { transform: skewX(3deg); display: inline-block; }

.features-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin: 10px 0; }
.feature-card { background: #ECEDF4; padding: 12px; border-radius: 4px; border-left: 3px solid #1FBCBC; }
.feature-title { font-weight: 700; color: #323E46; margin-bottom: 4px; font-size: 13px; }
.feature-desc { font-size: 12px; color: #4F6373; }

@media print { 
    body { background: white; }
    .page { margin: 0; box-shadow: none; page-break-after: always; }
}
</style>
</head>
<body>
${content}
</body>
</html>`;
};

// Endpoint to generate HTML from raw content using Gemini
app.post('/generate-html', async (req, res) => {
  const { content } = req.body;
  
  if (!content) {
    return res.status(400).send('Bad Request: No content provided.');
  }

  console.log('Generating document with Gemini AI...');

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    
    const prompt = `You are an expert document designer. Convert the following raw business content into a beautiful, professional HTML document body content (without <!DOCTYPE>, <html>, <head>, or <body> tags - just the inner content).

CRITICAL REQUIREMENTS:
1. Use ONLY these pre-defined CSS classes (do not create new ones):
   - .page, .page-content, .cover-page, .logo
   - .section-box, .industries, .industry-card
   - .profile-grid, .profile-item, .profile-label, .profile-value
   - .pain-points, .solutions (for lists)
   - .personas-table, .persona-role
   - .snapshot-grid, .snapshot-card, .snapshot-attribute, .snapshot-value
   - .cta-box, .cta-point
   - .features-grid, .feature-card, .feature-title, .feature-desc

2. Document Structure:
   - First page: Cover page with logo, title, and subtitle
     <div class="page cover-page">
       <div class="page-content">
         <div class="logo"><img src="{{LOGO}}" alt="Logo"></div>
         <h1>[Main Title]</h1>
         <p class="subtitle">[Tagline or subtitle]</p>
       </div>
     </div>
   
   - Following pages: Content sections
     <div class="page">
       <div class="page-content">
         <h2>[Section Title]</h2>
         [Section content using appropriate classes]
       </div>
     </div>

3. For pain points, use:
   <ul class="pain-points">
     <li><span>[Pain point text]</span></li>
   </ul>

4. For solutions/benefits, use:
   <ul class="solutions">
     <li><span>[Solution text]</span></li>
   </ul>

5. For profile data, use:
   <div class="profile-grid">
     <div class="profile-item">
       <div class="profile-label">[Label]</div>
       <div class="profile-value">[Value]</div>
     </div>
   </div>

6. For key metrics/snapshot data, use:
   <div class="snapshot-grid">
     <div class="snapshot-card">
       <div class="snapshot-attribute">[Attribute]</div>
       <div class="snapshot-value">[Value]</div>
     </div>
   </div>

7. For industry/category lists, use:
   <div class="industries">
     <div class="industry-card">[Industry name]</div>
   </div>

8. For CTA sections, use:
   <div class="cta-box">
     <h2>[CTA Title]</h2>
     <div class="cta-point"><span>[Point text]</span></div>
   </div>

9. ALWAYS wrap content with <span> inside skewed elements (.pain-points li, .solutions li, .cta-point)

10. Create 2-3 pages maximum. Each page should be a complete <div class="page">...</div>

Raw Content:
${content}

Return ONLY the HTML body content (the div elements), no explanations, no markdown, no code blocks.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let htmlContent = response.text();
    
    // Clean up any markdown code blocks
    htmlContent = htmlContent.replace(/```html\n?/g, '').replace(/```\n?/g, '').trim();
    
    // Insert logo
    const logoBase64 = process.env.LOGO_BASE64 || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    htmlContent = htmlContent.replace(/\{\{LOGO\}\}/g, logoBase64);
    
    // Wrap in template
    const fullHtml = getDocumentTemplate(htmlContent, logoBase64);
    
    res.json({ html: fullHtml });
    console.log('Document generated successfully.');
  } catch (error) {
    console.error('Error generating HTML:', error);
    res.status(500).send('Error generating document: ' + error.message);
  }
});

// Endpoint to generate PDF from HTML
app.post('/generate-pdf', async (req, res) => {
  const htmlContent = req.body;
  
  if (!htmlContent) {
    return res.status(400).send('Bad Request: No HTML content provided.');
  }

  console.log('Generating PDF...');
  let browser;
  
  try {
    browser = await puppeteer.launch({
      headless: "new",
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.setViewport({ width: 1240, height: 1754 });
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    await page.evaluateHandle('document.fonts.ready');
    
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' },
      displayHeaderFooter: false,
      preferCSSPageSize: true
    });
    
    await browser.close();
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=Generated-Document.pdf');
    res.send(pdfBuffer);
    
    console.log('PDF generated and sent successfully.');
  } catch (error) {
    console.error('Error generating PDF:', error);
    if (browser) {
      await browser.close();
    }
    res.status(500).send('Internal Server Error: Could not generate PDF.');
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
  console.log(`📄 Endpoints:`);
  console.log(`   POST /generate-html - Generate HTML from content`);
  console.log(`   POST /generate-pdf - Convert HTML to PDF`);
});
