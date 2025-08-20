# 🏢 Vail Williams Property Brochure Generator

A comprehensive Next.js application that automatically generates professional property brochures for Vail Williams estate agents. The system integrates real-time data from multiple sources and outputs branded PDF/HTML brochures with AI-enhanced descriptions.

## ✨ Features

### 🎯 Core Functionality
- **Property Input Form** with address autocomplete and drag & drop photo upload
- **Real-time Brochure Preview** with professional Vail Williams branding
- **PDF Export** using Puppeteer for high-quality print-ready documents
- **Responsive Design** optimized for desktop and mobile devices

### 🔌 API Integrations
- **Gov.uk EPC API** - Automatic energy performance certificate data
- **Google Maps APIs** - Address autocomplete, static maps, and transport links
- **OpenRouter AI** - Enhanced property descriptions and market analysis
- **Neon Database** - Caching and data persistence

### 🎨 Professional Branding
- **Vail Williams Color Scheme** - Orange (#FF6B35) and Teal (#2DA5B8)
- **Three Diamond Logo** design element throughout
- **Professional Layout** matching estate agency standards
- **Print-optimized** PDF output

## 🚀 Quick Start

### 1. Clone and Install
```bash
git clone https://github.com/philvuai/VailWilliams.git
cd VailWilliams
npm install
```

### 2. Environment Setup
Copy the environment template:
```bash
cp .env.example .env.local
```

Add your API keys to `.env.local`:
```env
# Google Maps API
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# EPC API (Gov.uk)
EPC_API_BASE_URL=https://epc.opendatacommunities.org/api/v1
EPC_API_KEY=your_epc_api_key_here

# OpenRouter API
OPENROUTER_API_KEY=your_openrouter_api_key_here
OPENROUTER_API_URL=https://openrouter.ai/api/v1

# Database (Neon)
DATABASE_URL=your_neon_database_connection_string

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

⚠️ **SECURITY**: Never commit your actual API keys to version control. The `.env.local` file is already gitignored.

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 📦 Deployment to Netlify

### Method 1: GitHub Integration (Recommended)

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Initial commit"
   git push -u origin main
   ```

2. **Connect to Netlify**:
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Connect your GitHub repository

3. **Configure Build Settings**:
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Node version: 18

4. **Add Environment Variables**:
   Go to Site settings → Environment variables and add all the variables from your `.env.local` file.

5. **Deploy**: Netlify will automatically build and deploy your site.

### Method 2: Manual Deploy

1. **Build locally**:
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**:
   - Drag and drop the `.next` folder to Netlify's deploy interface
   - Or use Netlify CLI: `netlify deploy --prod --dir=.next`

## 🏗️ System Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Next.js App  │────│  API Routes      │────│  External APIs  │
│   (Frontend)   │    │  (Backend)       │    │  (Integrations) │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       ├─ Gov.uk EPC API
    ┌────────┐              ┌─────────┐                  ├─ Google Maps API
    │ Forms  │              │Database │                  ├─ OpenRouter AI
    │Preview │              │(Neon)   │                  └─ Places API
    │Export  │              └─────────┘                  
    └────────┘                                           
```

## 🔧 API Endpoints

### Property Brochure Generation
- **`POST /api/brochure/generate`** - Generate brochure with PDF export
- **`GET /api/epc/search`** - Search EPC data by postcode/address
- **`POST /api/ai/enhance`** - AI-enhance property descriptions

### Request/Response Examples

#### Generate Brochure
```typescript
POST /api/brochure/generate
{
  "property": {
    "address": "123 High Street, London",
    "postcode": "SW1A 1AA",
    "propertyType": "Commercial",
    "size": "2,500 sq ft",
    "agent": { "id": "1", "name": "Sarah Johnson", ... },
    "photos": [...]
  },
  "format": "pdf" // or "html"
}
```

#### EPC Data Search
```typescript
GET /api/epc/search?postcode=SW1A1AA&propertyType=Commercial

Response:
{
  "success": true,
  "data": {
    "rows": [{
      "currentEnergyRating": "B",
      "currentEnergyEfficiency": 85,
      "co2Emissions": 45.2,
      ...
    }]
  }
}
```

## 🎨 Component Structure

```
src/
├── app/
│   ├── api/                    # API routes
│   │   ├── epc/search/         # EPC data integration
│   │   ├── ai/enhance/         # AI enhancement
│   │   └── brochure/generate/  # PDF generation
│   └── page.tsx               # Main application
├── components/
│   ├── PropertyForm.tsx       # Property input form
│   ├── BrochureTemplate.tsx   # Brochure design template
│   └── ...
├── lib/
│   ├── googleMaps.ts          # Google Maps utilities
│   └── ...
└── types/
    └── index.ts               # TypeScript definitions
```

## 🔌 Integration Guides

### Google Maps Setup
1. Enable APIs in Google Cloud Console:
   - Maps JavaScript API
   - Places API
   - Geocoding API
   - Maps Static API

2. Create API key and add domain restrictions
3. Add to environment variables

### EPC API Access
1. Request access at [epc.opendatacommunities.org](https://epc.opendatacommunities.org)
2. Get API credentials
3. Add to environment variables

### OpenRouter AI Setup
1. Sign up at [openrouter.ai](https://openrouter.ai)
2. Create API key
3. Select Claude 3.5 Sonnet model
4. Add to environment variables

### Neon Database Setup
1. Create account at [neon.tech](https://neon.tech)
2. Create new database
3. Copy connection string
4. Add to environment variables

## 🎯 Usage Guide

### For Estate Agents

1. **Enter Property Details**:
   - Type address (autocomplete will help)
   - Select property type (Commercial/Residential/Industrial)
   - Add property size information
   - Choose contact agent

2. **Upload Photos**:
   - Drag & drop up to 10 photos
   - Supported formats: JPEG, PNG, WebP
   - Maximum 10MB per photo

3. **Generate Brochure**:
   - System automatically fetches EPC data
   - AI enhances property description
   - Google Maps adds location information
   - Preview shows complete brochure

4. **Export PDF**:
   - Click "Export PDF" for print-ready file
   - Professional A4 format
   - Vail Williams branding throughout

### Brochure Includes

✅ **Property Information** - Address, type, size, photos
✅ **EPC Rating** - Energy performance certificate data  
✅ **AI Description** - Enhanced property description
✅ **Market Analysis** - Location benefits and potential
✅ **Transport Links** - Nearby stations and transport
✅ **Location Map** - Google Maps static image
✅ **Agent Contact** - Full contact information
✅ **Professional Branding** - Vail Williams design

## 🛠️ Customization

### Adding New Agents
Update the `mockAgents` array in `src/app/page.tsx`:
```typescript
const mockAgents: Agent[] = [
  {
    id: '4',
    name: 'New Agent Name',
    email: 'agent@vailwilliams.com',
    phone: '+44 20 7123 4567',
    title: 'Property Consultant'
  }
];
```

### Modifying Branding
Update colors in `src/components/BrochureTemplate.tsx`:
```typescript
// Current Vail Williams colors
const colors = {
  primary: '#FF6B35',   // Orange
  secondary: '#2DA5B8', // Teal
};
```

### Custom Property Types
Add to `src/types/index.ts`:
```typescript
export interface Property {
  propertyType: 'Commercial' | 'Residential' | 'Industrial' | 'Mixed Use';
}
```

## 🧪 Testing

### Run Tests
```bash
npm run test
```

### Test API Endpoints
```bash
# Test EPC API
curl "http://localhost:3000/api/epc/search?postcode=SW1A1AA&propertyType=Commercial"

# Test AI Enhancement
curl -X POST http://localhost:3000/api/ai/enhance \
  -H "Content-Type: application/json" \
  -d '{"property": {"address": "Test Address", "propertyType": "Commercial"}}'
```

## 📊 Performance & Optimization

- **Next.js 14** with App Router for optimal performance
- **Image Optimization** automatic with Next.js
- **PDF Generation** optimized with Puppeteer
- **API Caching** reduces external API calls
- **Static Assets** cached with CDN on Netlify

## 🔒 Security Features

- **Environment Variables** secure API key storage
- **Input Validation** with Zod schemas
- **XSS Protection** built-in Next.js security
- **HTTPS Enforced** on Netlify deployment
- **API Rate Limiting** prevents abuse

## 🐛 Troubleshooting

### Common Issues

**Google Maps not loading:**
- Check API key is correct
- Verify domain is authorized
- Ensure all required APIs are enabled

**EPC data not found:**
- Verify postcode format (UK only)
- Check EPC API credentials
- Some properties may not have EPC data

**PDF generation fails:**
- Check Puppeteer installation
- Verify memory limits on hosting
- Try reducing image sizes

**AI enhancement not working:**
- Verify OpenRouter API key
- Check model availability
- Review API usage limits

### Getting Help

1. Check the console for error messages
2. Verify all environment variables are set
3. Test API endpoints individually
4. Contact support: info@vailwilliams.com

## 📄 License

© 2024 Vail Williams LLP. All rights reserved.

This software is proprietary and confidential. Unauthorized copying, distribution, or modification is strictly prohibited.

---

## 🎯 Ready for Production

Your Vail Williams Property Brochure Generator is now complete and ready for deployment! 

### What's Included:
✅ **Full Next.js Application** with TypeScript  
✅ **Professional UI** with Vail Williams branding  
✅ **API Integrations** (EPC, Google Maps, AI)  
✅ **PDF Generation** with Puppeteer  
✅ **Deployment Ready** for Netlify  
✅ **Comprehensive Documentation**

### Next Steps:
1. Add your API keys to environment variables
2. Deploy to Netlify
3. Test with real property data
4. Train your team on usage

**Perfect for streamlining Vail Williams' property marketing process!** 🏢✨
