# Agriculture Scheme Portal

A comprehensive React-based web application for exploring government agriculture schemes, tracking GDP data, and analyzing crop yield reports.

## Features

### 🏛️ Government Schemes Section
- Browse and search through government agriculture schemes
- Filter by crop type, subsidy type, and state
- View detailed benefits and eligibility criteria
- Special display for livestock insurance schemes with animal coverage
- Responsive card layout with neumorphism design

### 📈 Agriculture GDP Analysis
- Interactive line chart showing GDP trends over years
- Highlight current year's performance
- Statistical summaries and growth analysis
- Responsive chart with tooltips

### 🌾 Crop Yield Reports
- Comprehensive yield data in table and chart views
- Year-over-year growth comparison
- Performance indicators and trend analysis
- Bar chart visualization with custom tooltips

### 📄 Report Export
- Generate comprehensive PDF reports
- Includes all sections: schemes, GDP, and yield data
- Downloadable with professional formatting
- Statistical summaries and insights

### 🎨 UI/UX Features
- Dark/Light mode toggle
- Mobile-first responsive design
- Neumorphism-style cards and components
- Smooth animations and transitions
- Accessibility-friendly design

## Technology Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS + Custom Neumorphism styles
- **Charts**: Recharts library
- **Icons**: Lucide React
- **PDF Generation**: jsPDF + jsPDF-AutoTable
- **HTTP Client**: Axios

## Installation

1. Install dependencies:
```bash
npm install recharts jspdf jspdf-autotable lucide-react
```

2. Set up environment variables (optional):
```bash
cp .env.example .env
# Edit .env with your API URLs
```

3. Import the component in your app:
```javascript
import SchemePortalPage from './components/SchemePortalPage';
```

## API Configuration

The portal supports external APIs for data fetching. Configure these environment variables:

```env
VITE_SCHEMES_API_URL=https://api.example.com/schemes
VITE_GDP_API_URL=https://api.example.com/gdp  
VITE_YIELD_API_URL=https://api.example.com/yield
```

If no APIs are configured, the portal uses comprehensive mock data.

## Component Structure

```
SchemePortalPage.jsx          # Main container with navigation
├── SchemeCard.jsx           # Government schemes section
├── GDPChart.jsx            # Agriculture GDP analysis
├── YieldReport.jsx         # Crop yield reports
├── ReportExport.jsx        # PDF export functionality
└── AgricultureSchemePortal.css  # Custom neumorphism styles
```

## Usage

### Navigation
The portal includes a built-in navigation system with sections for:
- Government Schemes
- Agriculture GDP
- Yield Report  
- Export Report

### Dark Mode
Toggle between light and dark themes using the sun/moon icon in the header.

### Mobile Support
Fully responsive design with mobile-optimized layouts and touch-friendly interactions.

### Search & Filtering
- Search schemes by name or description
- Filter by crop type, subsidy type, and state
- Real-time filtering with instant results

### Data Export
Generate comprehensive PDF reports including:
- Schemes summary with benefits and eligibility
- GDP trends and statistical analysis
- Yield performance and growth data
- Professional formatting with charts and tables

## Customization

### Styling
The portal uses Tailwind CSS with custom neumorphism effects. Modify `AgricultureSchemePortal.css` for custom styling.

### Data Sources
Replace mock data with real API endpoints by updating the environment variables and API call logic in each component.

### Additional Features
The modular design allows easy addition of new sections or modification of existing ones.

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Responsive design for all screen sizes

## Accessibility

- Keyboard navigation support
- High contrast mode compatibility
- Screen reader friendly
- Reduced motion support for accessibility preferences

## Performance

- Lazy loading for large datasets
- Optimized chart rendering
- Efficient state management
- Mobile-optimized animations
