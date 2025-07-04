# The Ai Business - Premium AI Solutions Website

A cutting-edge, modern website for The Ai Business, featuring glassmorphism effects, smooth animations, dark mode, and a premium design aesthetic inspired by Apple and Stripe.

## 🚀 Features

- **Modern Design**: Glassmorphism effects, gradient backgrounds, asymmetrical layouts
- **Dark Mode**: Toggle between light and dark themes
- **Smooth Animations**: Floating elements, scroll animations, hover effects
- **Responsive**: Fully responsive design for all devices
- **AI Partner Logos**: Displays logos for ChatGPT, Claude, Granola, Co-Pilot, Gemini
- **Contact Form**: Professional contact form with email backend
- **Email Notifications**: Automatic email sending to phil@vu.co.uk
- **Auto-Reply**: Sends professional auto-reply to form submissions

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript, Tailwind CSS
- **Icons**: Lucide Icons
- **Backend**: Netlify Functions (Serverless)
- **Email**: Nodemailer
- **Hosting**: Netlify
- **Styling**: Custom CSS with Tailwind utilities

## 📱 Installation

1. **Clone or download the files**
   ```bash
   # Navigate to the project directory
   cd /Users/philwebb
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install Netlify CLI (for local development)**
   ```bash
   npm install -g netlify-cli
   ```

4. **Set up email credentials**
   - For Gmail (recommended):
     - Enable 2-factor authentication
     - Generate an app password at: https://myaccount.google.com/apppasswords
     - You'll add these as environment variables in Netlify

## 🚀 Running the Application

### Local Development
```bash
npm run dev
```

The website will be available at: `http://localhost:8888`

### Manual Testing
You can also open `index.html` directly in your browser for basic testing (email functionality requires Netlify deployment).

## 📧 Email Configuration

The contact form sends emails to **phil@vu.co.uk** and includes:

- Company information
- Contact details
- AI requirements/comments
- Timestamp
- Auto-reply to the submitter

### Email Features
- **Professional HTML templates** with gradient styling
- **Auto-reply system** for customer engagement
- **Detailed inquiry formatting** for easy processing
- **Mobile-friendly email templates**

## 🎨 Design Features

### Visual Elements
- **Glassmorphism**: Translucent cards with backdrop blur
- **Gradient Backgrounds**: Animated gradient backgrounds
- **Floating Navigation**: Fixed navigation with glassmorphism
- **Asymmetrical Layouts**: Modern, non-conventional layouts
- **Hover Interactions**: Logo rotations and card elevations

### Animations
- **Scroll Animations**: Elements fade in as they come into view
- **Floating Elements**: Dynamic floating particles
- **Button Effects**: Pulse glow effects on CTAs
- **Smooth Transitions**: All interactions have smooth transitions

### Responsive Design
- **Mobile-First**: Designed for mobile, enhanced for desktop
- **Flexible Grid**: Asymmetrical grid that adapts to screen size
- **Touch-Friendly**: Large touch targets for mobile users

## 🔧 Customization

### Colors
The website uses a gradient color scheme. Main colors can be modified in the CSS:
- Primary gradient: `#667eea` to `#764ba2`
- Secondary gradients: Various blue, purple, and pink combinations

### Content
- **Company name**: "The Ai Business"
- **Target audience**: SMEs (Small to Medium Enterprises)
- **AI Partners**: ChatGPT, Claude, Granola, Co-Pilot, Gemini
- **Contact email**: phil@vu.co.uk

### Icons
Icons are provided by Lucide and can be easily replaced or modified in the HTML.

## 📱 Browser Support

- **Modern Browsers**: Chrome, Firefox, Safari, Edge (latest versions)
- **Mobile**: iOS Safari, Chrome Mobile, Samsung Internet
- **Features**: CSS Grid, Flexbox, Backdrop Filter, CSS Variables

## 🔒 Security Considerations

- **Environment Variables**: Sensitive data stored in .env file
- **CORS**: Configured for security
- **Input Validation**: Form validation on frontend and backend
- **Email Security**: Uses app passwords, not main account passwords

## 📈 Performance

- **Lightweight**: Minimal dependencies, optimized loading
- **CDN Assets**: Tailwind and Lucide loaded from CDN
- **Optimized Images**: SVG icons for crisp display
- **Lazy Loading**: Animations trigger on scroll

## 🚀 Netlify Deployment

### Method 1: Git Integration (Recommended)
1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_GITHUB_URL
   git push -u origin main
   ```

2. **Connect to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Connect your GitHub repository
   - Build settings are automatically detected from `netlify.toml`

3. **Add Environment Variables**
   - In Netlify dashboard → Site Settings → Environment Variables
   - Add:
     - `EMAIL_USER`: your-email@gmail.com
     - `EMAIL_PASS`: your-app-password

4. **Deploy**
   - Netlify will automatically build and deploy
   - Your site will be available at: `your-site-name.netlify.app`

### Method 2: Manual Deploy
1. **Build locally**
   ```bash
   npm run build
   ```

2. **Drag and drop**
   - Drag the entire project folder to Netlify
   - Add environment variables in dashboard

### Method 3: Netlify CLI
```bash
netlify deploy --prod
```

## 📞 Support

For technical support or customization requests, contact the development team.

## 🔄 Updates

The website is designed to be easily updatable:
- **Content**: Modify HTML content directly
- **Styling**: Update CSS variables for color changes
- **Features**: Add new sections following existing patterns

---

**The Ai Business** - Transforming SMEs with cutting-edge AI solutions
