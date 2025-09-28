# Scheme Portal CSS System

## Overview

The Scheme Portal uses a dedicated CSS system with higher specificity to prevent conflicts with the main App.css styles. All scheme portal components are wrapped in a `.scheme-portal-container` class to ensure proper styling isolation.

## Key Features

### 1. **CSS Isolation**
- All styles are prefixed with `.scheme-portal-container` for higher specificity
- Uses `!important` declarations to override conflicting App.css styles
- Custom CSS variables prefixed with `--sp-` to avoid conflicts

### 2. **Theme System**
- Light/Dark mode support with `.dark` class modifier
- Consistent color palette with agriculture-focused design
- Smooth transitions and animations

### 3. **Component Classes**

#### Main Container
```jsx
<div className="scheme-portal-container">
  {/* All portal content */}
</div>
```

#### Header & Navigation
```jsx
<header className="scheme-portal-header">
  <div className="scheme-portal-nav">
    <div className="scheme-portal-logo">
      <div className="scheme-portal-nav-links">
        <a className="scheme-portal-nav-link">
```

#### Cards & Content
```jsx
<div className="scheme-card">         // Scheme cards
<div className="chart-container">     // Chart containers
<div className="portal-section">      // Main sections
```

#### Forms & Buttons
```jsx
<input className="form-input">
<select className="form-select">
<button className="btn btn-primary">
<button className="theme-toggle">
```

### 4. **Responsive Design**
- Mobile-first approach
- Breakpoints: 768px (tablet), 480px (mobile)
- Collapsible mobile navigation

### 5. **Dark Mode**
Add the `dark` class to the container:
```jsx
<div className={`scheme-portal-container ${darkMode ? 'dark' : ''}`}>
```

## Usage Instructions

1. **Import the CSS** in your component:
```jsx
import './SchemePortal.css';
```

2. **Wrap your content** in the container:
```jsx
const MyComponent = () => {
  return (
    <div className="scheme-portal-container">
      {/* Your content */}
    </div>
  );
};
```

3. **Use the provided classes** for styling consistency

## CSS Variables

### Colors
- `--sp-primary-green`: Main green color
- `--sp-secondary-blue`: Accent blue
- `--sp-neutral-gray`: Text gray
- `--sp-white/black`: Theme-aware whites/blacks

### Shadows & Effects
- `--sp-shadow-sm/md/lg/xl`: Elevation shadows
- `--sp-radius-sm/md/lg/xl`: Border radius
- `--sp-transition-fast/normal/slow`: Animation timing

## Troubleshooting

### CSS Not Applying
1. Ensure the container class is present
2. Check import order (SchemePortal.css should be imported in component)
3. Verify no typos in class names

### Theme Issues
1. Make sure `dark` class is toggled on container
2. Check localStorage for theme persistence
3. Verify CSS variables are defined

### Mobile Responsiveness
1. Test on different screen sizes
2. Check mobile navigation functionality
3. Verify touch interactions work properly

## Best Practices

1. **Always use the container class** as the root wrapper
2. **Import CSS in component files** rather than globally
3. **Use provided utility classes** instead of inline styles
4. **Test both light and dark themes** during development
5. **Verify mobile responsiveness** on actual devices

## File Structure
```
src/components/
├── SchemePortal.css           # Main stylesheet
├── SchemePortalPage.jsx       # Main container component
├── SchemeCard.jsx            # Individual components
├── GDPChart.jsx
├── YieldReport.jsx
└── ReportExport.jsx
```
