const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());

// Middleware to parse raw text body
app.use(express.text({ type: 'text/html', limit: '10mb' }));

// Endpoint to generate the PDF
app.post('/generate-pdf', async (req, res) => {
    const htmlContent = req.body;

    if (!htmlContent) {
        return res.status(400).send('Bad Request: No HTML content provided.');
    }

    console.log('Received request to generate PDF...');

    let browser;
    try {
        browser = await puppeteer.launch({ 
            headless: "new",
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        
        const page = await browser.newPage();

        // Set viewport to A4 size
        await page.setViewport({ width: 1240, height: 1754 });
        
        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

        // Wait for any fonts or images to load
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
        res.setHeader('Content-Disposition', 'attachment; filename=IntersectAI-ICP.pdf');
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
    console.log(`PDF generation server listening at http://localhost:${port}`);
});
