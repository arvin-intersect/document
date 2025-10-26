// api/generate-html.js
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

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

.page { width: 210mm; min-height: 297mm; margin: 20px auto; background: white; position: relative; overflow: hidden; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
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

.print-btn { position: fixed; bottom: 30px; right: 30px; background: linear-gradient(135deg, #1FBCBC 0%, #4F6373 100%); color: white; padding: 14px 28px; font-size: 16px; font-weight: 600; border: none; cursor: pointer; border-radius: 8px; box-shadow: 0 4px 20px rgba(31,188,188,0.3); z-index: 1000; }
.print-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 25px rgba(31,188,188,0.4); }

@media print { 
    body { background: white; }
    .page { margin: 0; box-shadow: none; page-break-after: always; }
    .print-btn { display: none; }
}
</style>
</head>
<body>
${content}
<button class="print-btn" onclick="window.print()">🖨️ Print / Save as PDF</button>
</body>
</html>`;
};

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { content } = req.body;
  
  if (!content) {
    return res.status(400).json({ error: 'No content provided' });
  }

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

5. ALWAYS wrap content with <span> inside skewed elements (.pain-points li, .solutions li, .cta-point)

6. Create 2-3 pages maximum. Each page should be a complete <div class="page">...</div>

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
    
    res.status(200).json({ html: fullHtml });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error generating document: ' + error.message });
  }
}
