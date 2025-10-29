# 🎨 Visual Design Reference - Quick Guide

## Color Palette

```
PRIMARY COLORS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
███ #2F5D3A  Deep Forest Green    (Primary)
███ #A7D129  Fresh Lime Green     (Accent)
███ #F9FAF9  Soft Off-White       (Background)
███ #1B4332  Dark Forest Green    (Text)

SUPPORTING COLORS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
███ #10b981  Success Green
███ #f59e0b  Warning Amber
███ #ef4444  Danger Red
███ #3b82f6  Info Blue
```

---

## Typography

```
FONT FAMILY:
'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif

WEIGHTS:
300 - Light
400 - Regular
500 - Medium
600 - Semi-Bold
700 - Bold
800 - Extra Bold

SIZES:
Titles:     2.75rem (44px)
Subtitles:  1.25rem (20px)
Body:       1rem (16px)
Small:      0.875rem (14px)
```

---

## Spacing Scale

```
--space-2:  0.5rem   (8px)   ▂
--space-3:  0.75rem  (12px)  ▃
--space-4:  1rem     (16px)  ▄
--space-6:  1.5rem   (24px)  ▅
--space-8:  2rem     (32px)  ▆
--space-10: 2.5rem   (40px)  ▇
--space-12: 3rem     (48px)  █
--space-16: 4rem     (64px)  █▁
--space-20: 5rem     (80px)  █▃
--space-24: 6rem     (96px)  █▅
```

---

## Border Radius

```
--radius-sm:   8px   ╭─╮   Small corners
--radius-md:   12px  ╭──╮  Medium corners
--radius-lg:   20px  ╭───╮ Large corners
--radius-xl:   24px  ╭────╮ Extra large
--radius-full: 9999px (●) Fully rounded
```

---

## Shadow System

```css
/* Soft elevation */
--shadow-sm: 0 2px 8px rgba(47, 93, 58, 0.08)
             ▁▁▁▁▁ (Subtle)

/* Card elevation */
--shadow-md: 0 8px 24px rgba(47, 93, 58, 0.1)
             ▃▃▃▃▃ (Standard)

/* Prominent elevation */
--shadow-lg: 0 20px 48px rgba(47, 93, 58, 0.15)
             ▅▅▅▅▅ (Lifted)

/* Maximum elevation */
--shadow-xl: 0 30px 60px rgba(47, 93, 58, 0.2)
             ███▅▅ (Floating)
```

---

## Component Patterns

### Button - Primary
```
╭──────────────────────╮
│   ● Get Started      │  Gradient: #2F5D3A → #A7D129
╰──────────────────────╯  Padding: 14px 28px
                          Radius: 9999px (fully rounded)
Hover: ↑ Lift + Glow      Shadow: 0 6px 20px rgba(47,93,58,0.25)
```

### Button - Secondary
```
╭──────────────────────╮
│   ○ Learn More       │  Background: white
╰──────────────────────╯  Border: 2px solid #2F5D3A
                          Color: #2F5D3A
Hover: Fill green         Radius: 9999px
```

### Card - Job Listing
```
╔═══════════════════════════════════╗
║ ▆▆▆▆ (4px green gradient top)    ║
║                                   ║
║  Job Title                  🗺️ 5km ║
║  [Type Badge]                     ║
║  ─────────────────────────────    ║
║  📍 Location                      ║
║  🕒 Date & Time                   ║
║  💰 Payment                       ║
║  👤 Owner                         ║
║  ─────────────────────────────    ║
║  [Apply Now] →                    ║
╚═══════════════════════════════════╝

Background: rgba(255,255,255,0.98) + blur
Border: 2px solid rgba(47,93,58,0.12)
Radius: 24px
Hover: ↑ Lift 8px + Glow
```

### Card - Stats
```
╭───────────────────╮
│ ACTIVE JOBS      │  ▂▂▂▂ (4px gradient on hover)
│                   │
│       156         │  Gradient text
│                   │  Animated count-up
╰───────────────────╯
Hover: ↑ Lift + Scale
```

### Search Bar
```
╭──────────────────────────────────────╮
│ 🔍  Search for jobs...               │
╰──────────────────────────────────────╯
                ↓ Focus
╭══════════════════════════════════════╮
│ 🔍  Search for jobs...               │  Green glow
╰══════════════════════════════════════╯  Scale 1.01
```

---

## Animation Timing

```
TRANSITIONS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Fast:   0.2s  ▸        Micro-interactions
Base:   0.3s  ▸▸       Standard transitions
Slow:   0.5s  ▸▸▸      Dramatic effects

EASING:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ease              Linear → Slow → Fast → Slow
cubic-bezier()    Custom bounce/spring effect
```

---

## Hover Effects

### Card Lift
```
Default:  ▄▄▄▄▄▄▄▄▄▄
          
Hover:    ╔═════════╗  ↑ translateY(-8px)
          ▃▃▃▃▃▃▃▃▃  ↑ scale(1.01)
          ▁▁▁▁▁▁▁▁▁    + shadow increase
```

### Button Press
```
Default:  [Button]    scale(1)
Hover:    [Button]↑   scale(1.05) + glow
Active:   [Button]↓   scale(1) + darker
```

### Icon Rotation
```
Default:  ⚙     rotate(0deg)
Hover:    ⚙↻    rotate(-5deg) + scale(1.1)
```

---

## Glassmorphism Formula

```css
background: rgba(255, 255, 255, 0.98);  /* Semi-transparent */
backdrop-filter: blur(20px);            /* Blur background */
border: 2px solid rgba(47,93,58,0.12);  /* Subtle border */
box-shadow: 0 8px 24px rgba(47,93,58,0.1); /* Depth */
```

---

## Gradient Recipes

### Primary Button
```css
background: linear-gradient(135deg, #2F5D3A, #A7D129);
```

### Text Gradient
```css
background: linear-gradient(135deg, #2F5D3A, #A7D129);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
```

### Top Border
```css
background: linear-gradient(90deg, #2F5D3A, #A7D129);
height: 4px;
```

### Glow Effect
```css
box-shadow: 
  0 12px 35px rgba(47, 93, 58, 0.35),  /* Main shadow */
  0 0 30px rgba(167, 209, 41, 0.3);    /* Glow */
```

---

## Responsive Breakpoints

```
Mobile First Approach:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📱 Base (< 480px)    Single column, stacked elements
─────────────────────────────────────────────────────
│  [Card]  │
│  [Card]  │
│  [Card]  │
─────────────────────────────────────────────────────

📱 Mobile (480px+)   Slightly wider cards
─────────────────────────────────────────────────────
│    [Card]    │
│    [Card]    │
─────────────────────────────────────────────────────

📱 Tablet (768px+)   2-column grid
─────────────────────────────────────────────────────
│  [Card]  │  [Card]  │
│  [Card]  │  [Card]  │
─────────────────────────────────────────────────────

💻 Desktop (1024px+) 3-column grid
─────────────────────────────────────────────────────
│ [Card] │ [Card] │ [Card] │
│ [Card] │ [Card] │ [Card] │
─────────────────────────────────────────────────────

🖥️ Large (1280px+)  Max-width container
─────────────────────────────────────────────────────
    │ [Card] │ [Card] │ [Card] │
    │ [Card] │ [Card] │ [Card] │
─────────────────────────────────────────────────────
```

---

## Interactive Elements

### Scroll-to-Top Button
```
                ┌─────┐
Hidden:         │  ↑  │  opacity: 0
                └─────┘  transform: translateY(20px)
                    
                ┌─────┐
Visible:        │  ↑  │↑ opacity: 1
                └─────┘  transform: translateY(0)
                ▃▃▃▃▃    + shadow

Position: Fixed bottom-right (32px, 32px)
Appears: After scrolling > 400px
```

### Toast Notification
```
╭──────────────────────────────────╮
│ ✓  Application submitted!        │  Success (Green gradient)
╰──────────────────────────────────╯
╭──────────────────────────────────╮
│ ✗  Failed to submit              │  Error (Red gradient)
╰──────────────────────────────────╯
╭──────────────────────────────────╮
│ ⚠  Warning message               │  Warning (Amber gradient)
╰──────────────────────────────────╯
╭──────────────────────────────────╮
│ ℹ  Information                   │  Info (Blue gradient)
╰──────────────────────────────────╯

Animation: Slide up from bottom
Duration: 3 seconds auto-dismiss
Position: Fixed bottom-center
```

### Ripple Effect
```
Button Click Sequence:

1. Initial:    [Button]
2. Click:      [Button]⦿     Ripple starts
3. Expand:     [Button]◯     Ripple grows
4. Fade:       [Button]○     Ripple fades
5. Complete:   [Button]      Clean state

Duration: 0.6s
Effect: Scale(0) → Scale(2) + Opacity(1 → 0)
```

---

## Layout Grid

### Jobs Grid
```
Grid Template: repeat(auto-fill, minmax(350px, 1fr))
Gap: 24px
Padding: 0 4px

Result:
┌─────────┬─────────┬─────────┐
│ Job 1   │ Job 2   │ Job 3   │
├─────────┼─────────┼─────────┤
│ Job 4   │ Job 5   │ Job 6   │
└─────────┴─────────┴─────────┘
```

### Stats Grid
```
Grid Template: repeat(auto-fit, minmax(220px, 1fr))
Gap: 24px

Result:
┌────────┬────────┬────────┐
│ Stat 1 │ Stat 2 │ Stat 3 │
└────────┴────────┴────────┘
```

---

## Accessibility Patterns

### Focus State
```
Default:  [Button]
         
Focus:    ╔═══════════╗  3px green outline
          ║ [Button]  ║  3px offset
          ╚═══════════╝  
```

### Color Contrast
```
✓ Pass:   #1B4332 on #F9FAF9  (WCAG AA)
✓ Pass:   #2F5D3A on white    (WCAG AA)
✓ Pass:   white on #2F5D3A    (WCAG AAA)
```

---

## Quick Implementation Checklist

```
CSS:
☐ Import Poppins font
☐ Add CSS variables to :root
☐ Update component classes
☐ Add animation keyframes
☐ Include responsive breakpoints

JavaScript:
☐ Import LabourHubEnhancements.js
☐ Call initAllEnhancements() in useEffect
☐ Add showToast() for user feedback
☐ Ensure proper cleanup on unmount

Testing:
☐ Test all hover states
☐ Verify scroll-to-top appears
☐ Check stat counter animations
☐ Test toast notifications
☐ Validate responsive layouts
☐ Check keyboard navigation
```

---

**This visual guide provides all the design tokens and patterns used in the modernization!** 🎨✨
