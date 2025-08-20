import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import puppeteer from 'puppeteer';

// Validation schema
const generateSchema = z.object({
  property: z.object({
    address: z.string(),
    postcode: z.string(),
    propertyType: z.string(),
    bedrooms: z.number().optional(),
    bathrooms: z.number().optional(),
    size: z.number().optional(),
    price: z.number().optional(),
    description: z.string().optional(),
  }),
  photos: z.array(z.string()).optional(),
  agent: z.object({
    name: z.string(),
    email: z.string(),
    phone: z.string(),
  }),
  enhanced: z.object({
    enhanced_description: z.string(),
    market_analysis: z.string(),
    key_features: z.array(z.string()),
    target_buyer: z.string(),
    investment_potential: z.string(),
  }).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = generateSchema.parse(body);

    // Generate brochure HTML
    const brochureHTML = generateBrochureHTML(validatedData);

    // Generate PDF using Puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-gpu',
      ],
    });

    const page = await browser.newPage();
    await page.setContent(brochureHTML, { waitUntil: 'networkidle0' });

    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        right: '20mm',
        bottom: '20mm',
        left: '20mm',
      },
    });

    await browser.close();

    return new NextResponse(pdf as BodyInit, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="property-brochure-${validatedData.property.postcode}.pdf"`,
      },
    });
  } catch (error) {
    console.error('Error generating brochure:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to generate brochure' },
      { status: 500 }
    );
  }
}

function generateBrochureHTML(data: z.infer<typeof generateSchema>) {
  const { property, photos = [], agent, enhanced } = data;

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Property Brochure - ${property.address}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Arial', sans-serif;
          line-height: 1.6;
          color: #333;
          background: white;
        }
        
        .container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        
        .header {
          text-align: center;
          margin-bottom: 30px;
          padding: 20px;
          background: linear-gradient(135deg, #FF6B35, #2DA5B8);
          color: white;
          border-radius: 8px;
        }
        
        .logo {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 10px;
        }
        
        .property-title {
          font-size: 28px;
          font-weight: bold;
          margin-bottom: 10px;
        }
        
        .property-details {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 30px;
        }
        
        .detail-item {
          padding: 15px;
          background: #f8f9fa;
          border-radius: 8px;
          border-left: 4px solid #FF6B35;
        }
        
        .detail-label {
          font-weight: bold;
          color: #2DA5B8;
          margin-bottom: 5px;
        }
        
        .photos-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
          margin-bottom: 30px;
        }
        
        .photo {
          width: 100%;
          height: 200px;
          object-fit: cover;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        
        .section {
          margin-bottom: 25px;
          padding: 20px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .section-title {
          font-size: 20px;
          font-weight: bold;
          color: #2DA5B8;
          margin-bottom: 15px;
          border-bottom: 2px solid #FF6B35;
          padding-bottom: 5px;
        }
        
        .features-list {
          list-style: none;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 10px;
        }
        
        .features-list li {
          padding: 8px 12px;
          background: #f0f9ff;
          border-radius: 4px;
          border-left: 3px solid #2DA5B8;
        }
        
        .agent-contact {
          background: linear-gradient(135deg, #2DA5B8, #FF6B35);
          color: white;
          text-align: center;
          padding: 25px;
          border-radius: 8px;
          margin-top: 30px;
        }
        
        .agent-name {
          font-size: 22px;
          font-weight: bold;
          margin-bottom: 10px;
        }
        
        .contact-info {
          font-size: 16px;
          margin: 5px 0;
        }
        
        @media print {
          body {
            background: white;
          }
          
          .container {
            max-width: none;
            margin: 0;
            padding: 0;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">◆ ◆ ◆ VAIL WILLIAMS</div>
          <div class="property-title">${property.address}</div>
          <div>${property.postcode}</div>
        </div>
        
        <div class="property-details">
          <div class="detail-item">
            <div class="detail-label">Property Type</div>
            <div>${property.propertyType}</div>
          </div>
          ${property.bedrooms ? `
          <div class="detail-item">
            <div class="detail-label">Bedrooms</div>
            <div>${property.bedrooms}</div>
          </div>
          ` : ''}
          ${property.bathrooms ? `
          <div class="detail-item">
            <div class="detail-label">Bathrooms</div>
            <div>${property.bathrooms}</div>
          </div>
          ` : ''}
          ${property.size ? `
          <div class="detail-item">
            <div class="detail-label">Size</div>
            <div>${property.size} sq ft</div>
          </div>
          ` : ''}
          ${property.price ? `
          <div class="detail-item">
            <div class="detail-label">Price</div>
            <div>£${property.price.toLocaleString()}</div>
          </div>
          ` : ''}
        </div>
        
        ${photos.length > 0 ? `
        <div class="section">
          <div class="section-title">Property Images</div>
          <div class="photos-grid">
            ${photos.map(photo => `<img src="${photo}" alt="Property photo" class="photo">`).join('')}
          </div>
        </div>
        ` : ''}
        
        ${enhanced ? `
        <div class="section">
          <div class="section-title">Property Description</div>
          <p>${enhanced.enhanced_description}</p>
        </div>
        
        <div class="section">
          <div class="section-title">Key Features</div>
          <ul class="features-list">
            ${enhanced.key_features.map(feature => `<li>${feature}</li>`).join('')}
          </ul>
        </div>
        
        <div class="section">
          <div class="section-title">Market Analysis</div>
          <p>${enhanced.market_analysis}</p>
        </div>
        
        <div class="section">
          <div class="section-title">Investment Potential</div>
          <p>${enhanced.investment_potential}</p>
        </div>
        ` : ''}
        
        ${property.description ? `
        <div class="section">
          <div class="section-title">Additional Information</div>
          <p>${property.description}</p>
        </div>
        ` : ''}
        
        <div class="agent-contact">
          <div class="agent-name">${agent.name}</div>
          <div class="contact-info">📧 ${agent.email}</div>
          <div class="contact-info">📞 ${agent.phone}</div>
          <div style="margin-top: 15px; font-size: 14px;">
            VAIL WILLIAMS - COMMERCIAL PROPERTY EXPERTS
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}
