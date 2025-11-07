# 🎨 Visual Style Guide - Financial Tracker & Farm Notepad

## Color Reference

### Financial Tracker Color System

#### Primary Colors
```css
Primary Green: #10b981 rgb(16, 185, 129)
Primary Dark:  #059669 rgb(5, 150, 105)
Secondary:     #6366f1 rgb(99, 102, 241)
Success:       #22c55e rgb(34, 197, 94)
Danger:        #ef4444 rgb(239, 68, 68)
```

#### Component Colors
```
Summary Cards:
├── Income Card: Green (#22c55e) top border
├── Expense Card: Red (#ef4444) top border
└── Profit/Loss: Purple (#6366f1) / Red (#ef4444) top border

Transactions:
├── Income Icon: Green gradient background (linear-gradient(135deg, #d1fae5, #a7f3d0))
└── Expense Icon: Red gradient background (linear-gradient(135deg, #fee2e2, #fecaca))

Form Section:
└── Light green gradient background (linear-gradient(135deg, #f0fdf4, #ecfdf5))
```

### Farm Notepad Color System

#### Category Colors
```css
General:      #6b7280 (Gray) → Icon: 📋
Planting:     #10b981 (Green) → Icon: 🌱
Harvest:      #f59e0b (Orange) → Icon: 🌾
Weather:      #3b82f6 (Blue) → Icon: ☁️
Maintenance:  #ef4444 (Red) → Icon: 🔧
Observations: #8b5cf6 (Purple) → Icon: 👁️
```

#### Category Gradients
```
General:      linear-gradient(135deg, #f3f4f6, #e5e7eb)
Planting:     linear-gradient(135deg, #d1fae5, #a7f3d0)
Harvest:      linear-gradient(135deg, #fed7aa, #fbbf6b)
Weather:      linear-gradient(135deg, #dbeafe, #bfdbfe)
Maintenance:  linear-gradient(135deg, #fecaca, #fca5a5)
Observations: linear-gradient(135deg, #e9d5ff, #d8b4fe)
```

---

## Typography Scale

### Financial Tracker
```
Header Title:     1.875rem (30px) - Bold 700
Section Headers:  1.25rem (20px) - Bold 700
Summary Amount:   2rem (32px) - Bold 700
Summary Label:    0.875rem (14px) - SemiBold 600
Transaction:      0.875rem (14px) - SemiBold 600
Meta Info:        0.75rem (12px) - Regular 400
Button Text:      0.875rem (14px) - SemiBold 600
```

### Farm Notepad
```
Header Title:     1.875rem (30px) - Bold 700
Note Title:       1.125rem (18px) - Bold 700
Section Headers:  1.125rem (18px) - Bold 700
Note Content:     0.875rem (14px) - Regular 400
Category Badge:   0.75rem (12px) - SemiBold 600
Meta Info:        0.75rem (12px) - Regular 400
Button Text:      0.875rem (14px) - SemiBold 600
```

---

## Spacing System

### Padding Scale
```
xs:  0.5rem (8px)
sm:  0.75rem (12px)
md:  1rem (16px)
lg:  1.5rem (24px)
xl:  2rem (32px)
```

### Component Padding
```
Container:        2rem (32px)
Cards:            1.5rem (24px)
Buttons:          0.75rem 1.5rem (12px 24px)
Input Fields:     0.625rem 0.75rem (10px 12px)
Form Groups:      1rem gap (16px)
```

### Margin Scale
```
Section Gap:      2rem (32px)
Card Gap:         1.5rem (24px)
Element Gap:      1rem (16px)
Small Gap:        0.75rem (12px)
Tiny Gap:         0.5rem (8px)
```

---

## Border Radius System

```css
Standard:     12px (--ft-radius / --np-radius)
Large:        16px (--ft-radius-lg / --np-radius-lg)
Pills:        6px (Category badges)
Circles:      50% (Icons, profile images)
```

---

## Shadow System

### Elevation Levels
```css
Level 1 (Default):
box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 
            0 2px 4px -1px rgba(0, 0, 0, 0.06);

Level 2 (Hover):
box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 
            0 10px 10px -5px rgba(0, 0, 0, 0.04);

Button Shadow:
box-shadow: 0 4px 6px rgba(16, 185, 129, 0.3);

Button Hover Shadow:
box-shadow: 0 8px 12px rgba(16, 185, 129, 0.4);
```

---

## Animation Reference

### Keyframe Animations

#### 1. fadeInUp
```css
Duration: 0.5s
Easing: ease-out
Effect: Container entrance from bottom
```

#### 2. gradient-shift
```css
Duration: 3s (Financial) / 4s (Notepad)
Easing: linear
Effect: Continuous color animation
```

#### 3. slideDown
```css
Duration: 0.3s
Easing: ease-out
Effect: Note editor reveal
```

#### 4. noteCardFadeIn
```css
Duration: 0.4s
Easing: ease-out
Effect: Note card appearance
```

#### 5. spin
```css
Duration: 0.8s
Easing: linear
Effect: Loading spinner rotation
```

### Transition Timings
```css
Standard: 0.3s cubic-bezier(0.4, 0, 0.2, 1)
Hover Effects: transform, box-shadow, border-color
Focus Effects: border-color, box-shadow
```

### Transform Effects
```
Hover Card:     translateY(-4px)
Hover Button:   translateY(-2px)
Hover Icon:     scale(1.1)
Active Button:  translateY(0)
Transaction:    translateX(4px)
```

---

## Component Breakdown

### Financial Tracker Components

#### 1. Summary Cards
```
Layout: CSS Grid (auto-fit, minmax(220px, 1fr))
Gap: 1.5rem
Style: White background, colored top border
Hover: translateY(-4px) + shadow-lg
```

#### 2. Filters Section
```
Layout: White card with grid layout
Grid: auto-fit, minmax(200px, 1fr)
Gap: 1rem
Focus: Primary color border + ring
```

#### 3. Add Transaction Form
```
Background: Green gradient (linear-gradient(135deg, #f0fdf4, #ecfdf5))
Border: 2px solid rgba(16, 185, 129, 0.2)
Layout: Grid layout for form fields
```

#### 4. Transaction List
```
Layout: Vertical flex column
Gap: 0.75rem
Max Height: 500px with custom scrollbar
Item Layout: 4-column grid (icon, details, amount, actions)
```

### Farm Notepad Components

#### 1. Search Filter Bar
```
Layout: Horizontal flex with wrap
Gap: 1rem
Background: White with shadow
Components: Search input, category filter, new note button
```

#### 2. Category Pills
```
Layout: Horizontal flex with wrap
Gap: 0.75rem
Style: Gradient backgrounds per category
Active State: Border + scale(1.05) + shadow
```

#### 3. Note Editor
```
Animation: slideDown (0.3s ease-out)
Background: Green gradient
Border: 2px solid rgba(16, 185, 129, 0.2)
Layout: Vertical flex column
```

#### 4. Notes Grid
```
Layout: CSS Grid (auto-fill, minmax(320px, 1fr))
Gap: 1.5rem
Animation: noteCardFadeIn per card
```

#### 5. Note Card
```
Background: White
Top Border: 4px colored (category-specific)
Hover: translateY(-4px) + shadow-lg
Layout: Flex column
```

---

## Button States

### Primary Buttons (Add, Save, New Note)
```
Default:  Green gradient + shadow
Hover:    translateY(-2px) + enhanced shadow
Active:   translateY(0)
Focus:    Primary border + ring
```

### Secondary Buttons (Cancel)
```
Default:  Transparent with border
Hover:    Red background + red border
Active:   Maintained red state
```

### Icon Buttons (Edit, Delete)
```
Default:  Transparent
Hover:    Colored background + scale(1.1)
Colors:   Blue (edit), Red (delete)
```

### PDF Export Button
```
Default:  Green gradient + shadow
Hover:    translateY(-2px) + enhanced shadow
Icon:     Displayed inline with text
```

---

## Form Elements

### Input Fields
```
Border: 2px solid #e5e7eb
Border Radius: 12px
Padding: 0.625rem 0.75rem
Background: White

Focus State:
  Border: Primary color (#10b981)
  Box Shadow: 0 0 0 3px rgba(16, 185, 129, 0.1)
```

### Select Dropdowns
```
Same styling as input fields
Cursor: pointer
Arrow: Browser default
```

### Text Areas
```
Same styling as input fields
Min Height: 120px
Resize: vertical
Font: inherit (matches site typography)
```

---

## Icon System

### Financial Tracker Icons
```
💰 - Header icon
💵 - Income indicator
💸 - Expense indicator
📊 - Category breakdown
🗑️ - Delete action
```

### Farm Notepad Icons
```
📓 - Header icon
🔍 - Search icon
➕ - Add new note
✏️ - Edit action
🗑️ - Delete action

Categories:
📋 - General
🌱 - Planting
🌾 - Harvest
☁️ - Weather
🔧 - Maintenance
👁️ - Observations
```

---

## Responsive Breakpoints

### Desktop (> 768px)
```
Financial Tracker:
  - Multi-column grid for summary cards
  - 4-column transaction layout
  - Side-by-side filter options

Farm Notepad:
  - Multi-column notes grid
  - Horizontal search bar
  - Category pills in row
```

### Mobile (≤ 768px)
```
Financial Tracker:
  - Single column layout
  - 2-column transaction layout (icon+details, amount+actions)
  - Stacked filters
  - Full-width buttons

Farm Notepad:
  - Single column notes
  - Stacked search bar
  - Full-width buttons
  - Centered category pills
```

---

## Accessibility Features

### Focus Indicators
```
Outline: None (using border + ring instead)
Border: 2px solid primary color
Ring: 0 0 0 3px rgba(16, 185, 129, 0.1)
Transition: Smooth 0.3s
```

### Color Contrast
```
All text: Meets WCAG AA standards
Minimum ratio: 4.5:1 for normal text
Minimum ratio: 3:1 for large text
Category colors: Tested for differentiation
```

### Interactive Elements
```
Minimum touch target: 44x44px
Hover states: Clear visual feedback
Active states: Immediate feedback
Loading states: Visible spinner
```

---

## Print Styles

### Hidden Elements
```
Financial Tracker:
  - PDF Export button
  - Add Transaction form
  - Filters section
  - Delete buttons

Farm Notepad:
  - Search bar
  - New Note button
  - Note editor
  - Category pills
  - Edit/Delete actions
```

### Print Optimizations
```
- Single column layout
- Remove shadows
- Add borders for definition
- Page break avoidance on cards
```

---

## Browser Compatibility

### Modern Browsers (Fully Supported)
```
✅ Chrome/Edge 90+
✅ Firefox 88+
✅ Safari 14+
✅ Mobile Safari (iOS 14+)
✅ Chrome Mobile
```

### CSS Features Used
```
✅ CSS Custom Properties (variables)
✅ CSS Grid
✅ Flexbox
✅ Gradients
✅ Transforms
✅ Transitions
✅ Animations
✅ backdrop-filter (progressive enhancement)
```

---

## Performance Notes

### Optimized Animations
```
✅ Hardware accelerated (transform, opacity)
✅ No layout thrashing
✅ Minimal reflows/repaints
✅ 60fps smooth animations
```

### CSS Loading
```
✅ No external dependencies
✅ Minimal file size
✅ Efficient selectors
✅ No unused styles
```

---

## Quick Reference

### Financial Tracker Key Classes
```
.financial-tracker-container
.tracker-header
.pdf-export-btn
.summary-cards
  .summary-card.income
  .summary-card.expense
  .summary-card.profit
.filters-section
.add-transaction-form
.transactions-list
  .transaction-item
  .transaction-icon
  .transaction-details
  .delete-btn
.category-breakdown
```

### Farm Notepad Key Classes
```
.notepad-container
.notepad-header
.search-filter-bar
  .search-input
  .category-filter
  .new-note-btn
.note-editor
.category-pills
  .category-pill.{category-name}
.notes-grid
  .note-card.{category-name}
  .note-header
  .note-content
  .note-footer
```

---

**Last Updated:** January 25, 2025
**Status:** Production Ready ✅
