# Fit2Hire Jobs Page - Design System Documentation

**Version:** 1.1
**Last Updated:** October 14, 2025
**Page Location:** `/app/jobs/page.tsx`

---

## Recent Updates (v1.1)

### Button Visibility Fix
Added custom gradient background utilities to `globals.css` to ensure button components render correctly:

```css
/* Added to @layer components in globals.css */
.bg-gradient-primary {
  background: linear-gradient(135deg, hsl(var(--primary-500)), hsl(var(--primary-600)));
}

.bg-gradient-surface {
  background: linear-gradient(135deg, hsl(var(--surface-50)), hsl(var(--surface-100)));
}

.bg-gradient-interactive {
  background: linear-gradient(135deg, hsl(var(--interactive-500)), hsl(var(--interactive-600)));
}
```

**Issue Resolved:** The Button component uses `bg-gradient-primary` class which was defined in `tailwind.config.ts` as a `backgroundImage` but needed to be explicitly added as a CSS utility class for proper rendering.

**Affected Components:**
- All Button variants (default, gradient, secondary)
- Search button in hero section
- View Details button in job cards
- Filter and Clear Filters buttons
- Login/Logout buttons

---

## Table of Contents
1. [Design Philosophy](#design-philosophy)
2. [Color Palette](#color-palette)
3. [Typography](#typography)
4. [Spacing System](#spacing-system)
5. [Component Styles](#component-styles)
6. [Animations & Transitions](#animations--transitions)
7. [Responsive Design](#responsive-design)
8. [Interactive States](#interactive-states)
9. [Layout Structure](#layout-structure)
10. [Accessibility](#accessibility)

---

## Design Philosophy

The Fit2Hire Jobs Page follows a **modern, gradient-heavy design system** with these core principles:

- **Visual Hierarchy:** Clear distinction between primary, secondary, and tertiary content
- **Premium Feel:** Glass-morphism, gradients, and depth create a luxury experience
- **User-Centric:** Intuitive navigation with minimal cognitive load
- **Responsive-First:** Mobile-optimized with graceful scaling to desktop
- **Performance:** Smooth animations without compromising load times

---

## Color Palette

### Primary Colors

#### Gradients
```css
/* Primary Gradient (Blue to Purple) */
bg-gradient-to-r from-blue-600 to-purple-600

/* Secondary Gradient (Blue to Purple to Pink) */
bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600

/* Background Gradient (Soft) */
bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50
```

#### Solid Colors
```css
/* Blues */
blue-50: #eff6ff (backgrounds)
blue-100: #dbeafe (hover states)
blue-400: #60a5fa (accents)
blue-500: #3b82f6 (primary actions)
blue-600: #2563eb (buttons, links)
blue-700: #1d4ed8 (active states)

/* Purples */
purple-50: #faf5ff (backgrounds)
purple-500: #a855f7 (accents)
purple-600: #9333ea (gradients)

/* Pinks */
pink-600: #db2777 (accents, gradients)

/* Slate/Gray */
slate-50: #f8fafc (light backgrounds)
slate-100: #f1f5f9 (borders, dividers)
slate-200: #e2e8f0 (borders)
slate-300: #cbd5e1 (disabled states)
slate-400: #94a3b8 (icons, secondary text)
slate-600: #475569 (body text)
slate-700: #334155 (labels)
slate-800: #1e293b (dark text)
slate-900: #0f172a (headings)
```

#### Semantic Colors
```css
/* Success */
green-600: #16a34a (checkmarks, success states)

/* Warning */
yellow-500: #eab308 (stars, highlights)

/* Error */
red-600: #dc2626 (errors, destructive actions)

/* Info */
blue-600: #2563eb (info badges, tooltips)
```

### Color Usage Guidelines

| Element | Color | Usage |
|---------|-------|-------|
| Page Background | `slate-50` to `purple-50` gradient | Main background |
| Card Background | `white` | Job cards, modals, panels |
| Primary CTA | `blue-600` to `purple-600` gradient | Apply, Search buttons |
| Text - Heading | `slate-900` | Main headings |
| Text - Body | `slate-700` | Descriptions, paragraphs |
| Text - Secondary | `slate-600` | Supporting text |
| Text - Muted | `slate-400` | Icons, timestamps |
| Borders | `slate-200` | Card borders, dividers |
| Hover Borders | `blue-300` | Interactive card borders |

---

## Typography

### Font Family
```css
/* Default System Font Stack (Tailwind) */
font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
             "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
```

### Font Sizes & Weights

#### Headings
```css
/* Page Title (Hero) */
text-4xl md:text-6xl font-bold
/* 36px mobile, 60px desktop, 700 weight */

/* Section Heading */
text-2xl font-bold
/* 24px, 700 weight */

/* Card Title */
text-lg font-semibold
/* 18px, 600 weight */

/* Subsection Heading */
text-lg font-semibold
/* 18px, 600 weight */
```

#### Body Text
```css
/* Primary Body */
text-base leading-relaxed
/* 16px, 1.625 line-height */

/* Secondary Body */
text-sm
/* 14px */

/* Small Text */
text-xs
/* 12px */
```

#### Font Weights
```css
font-normal: 400  /* Regular text */
font-medium: 500  /* Labels, emphasis */
font-semibold: 600 /* Card titles, buttons */
font-bold: 700     /* Headings, CTAs */
```

### Text Colors
```css
/* Primary Text */
text-slate-900: #0f172a

/* Secondary Text */
text-slate-700: #334155

/* Muted Text */
text-slate-600: #475569

/* Placeholder Text */
text-slate-400: #94a3b8

/* White Text (on dark backgrounds) */
text-white: #ffffff

/* Gradient Text */
bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent
```

---

## Spacing System

### Padding
```css
/* Container Padding */
px-4 sm:px-6 lg:px-8
/* 16px mobile, 24px tablet, 32px desktop (horizontal) */

py-8 md:py-12
/* 32px mobile, 48px desktop (vertical) */

/* Card Padding */
p-6
/* 24px all sides */

/* Section Padding */
py-12 md:py-20
/* 48px mobile, 80px desktop (vertical) */
```

### Margin
```css
/* Section Spacing */
mb-6 md:mb-12
/* 24px mobile, 48px desktop (bottom) */

/* Element Spacing */
mb-4: 16px
mb-3: 12px
mb-2: 8px
mb-1: 4px
```

### Gap
```css
/* Grid Gap */
gap-6: 24px (job cards grid)
gap-4: 16px (form inputs)
gap-2: 8px (badges, tags)

/* Flex Gap */
space-x-2: 8px (inline elements)
space-x-4: 16px (buttons)
space-y-2: 8px (stacked items)
```

---

## Component Styles

### Header
```css
/* Header Container */
.header {
  position: sticky;
  top: 0;
  z-index: 50;
  backdrop-filter: blur(24px);
  background-color: rgba(255, 255, 255, 0.8);
  border-bottom: 1px solid #e2e8f0;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
}

/* Logo */
.logo {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: linear-gradient(to bottom right, #2563eb, #9333ea);
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
}
```

### Job Cards
```css
/* Card Container */
.job-card {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  border: 1px solid #e2e8f0;
  transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

.job-card:hover {
  box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
  border-color: #93c5fd;
  transform: scale(1.02);
}

/* Featured Card */
.job-card.featured {
  box-shadow: 0 0 0 2px #60a5fa, 0 0 0 4px white;
}

/* Company Logo Circle */
.company-logo {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(to bottom right, #3b82f6, #a855f7);
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
}
```

### Buttons

The project uses a custom Button component (`@/components/ui/button`) with several variants:

```css
/* Base Button Styles */
.button-base {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  white-space: nowrap;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  transition: all 200ms;
  ring-offset-background;
}

.button-base:focus-visible {
  outline: 2px solid transparent;
  outline-offset: 2px;
  box-shadow: 0 0 0 2px var(--ring);
}

.button-base:disabled {
  pointer-events: none;
  opacity: 0.5;
}

/* Default Variant (Primary Gradient) */
.btn-default {
  background: linear-gradient(135deg, hsl(var(--primary-500)), hsl(var(--primary-600)));
  color: white;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.btn-default:hover {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  transform: scale(1.02);
}

.btn-default:active {
  transform: scale(0.98);
}

/* Gradient Variant (Blue to Purple) */
.btn-gradient {
  background: linear-gradient(to right, hsl(var(--primary-500)), hsl(var(--interactive-500)), hsl(var(--primary-600)));
  color: white;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  animation: fade-in 0.3s ease-out;
}

.btn-gradient:hover {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  transform: scale(1.02);
}

.btn-gradient:active {
  transform: scale(0.98);
}

/* Outline Button */
.btn-outline {
  background-color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(4px);
  border: 1px solid hsl(var(--border));
  color: hsl(var(--surface-900));
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.btn-outline:hover {
  background-color: hsl(var(--surface-100));
  color: hsl(var(--surface-900));
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

/* Ghost Button */
.btn-ghost {
  background-color: transparent;
  color: hsl(var(--surface-900));
  border-radius: 8px;
}

.btn-ghost:hover {
  background-color: hsl(var(--surface-100));
  color: hsl(var(--surface-900));
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

/* Secondary Button */
.btn-secondary {
  background: linear-gradient(to right, hsl(var(--surface-200)), hsl(var(--surface-300)));
  color: hsl(var(--surface-900));
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.btn-secondary:hover {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  transform: scale(1.02);
}

.btn-secondary:active {
  transform: scale(0.98);
}

/* Glass Button */
.btn-glass {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  color: hsl(var(--surface-900));
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
}

.btn-glass:hover {
  background: rgba(255, 255, 255, 0.2);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* Destructive Button */
.btn-destructive {
  background: linear-gradient(to right, hsl(var(--error-500)), hsl(var(--error-600)));
  color: white;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.btn-destructive:hover {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  transform: scale(1.02);
}

.btn-destructive:active {
  transform: scale(0.98);
}

/* Button Sizes */
.btn-size-sm {
  height: 32px;
  border-radius: 6px;
  padding: 0 12px;
  font-size: 12px;
}

.btn-size-default {
  height: 40px;
  padding: 8px 16px;
}

.btn-size-lg {
  height: 48px;
  border-radius: 8px;
  padding: 0 32px;
  font-size: 16px;
}

.btn-size-xl {
  height: 56px;
  border-radius: 12px;
  padding: 0 40px;
  font-size: 18px;
}

/* Icon Buttons */
.btn-icon {
  height: 40px;
  width: 40px;
  padding: 0;
}

.btn-icon-sm {
  height: 32px;
  width: 32px;
  padding: 0;
}

.btn-icon-lg {
  height: 48px;
  width: 48px;
  padding: 0;
}
```

#### Button Usage in Jobs Page
```jsx
/* Primary Search Button */
<Button variant="gradient" size="lg" leftIcon={<Search />}>
  Search Jobs
</Button>

/* View Details Button */
<Button variant="gradient" size="sm" rightIcon={<ChevronRight />}>
  View Details
</Button>

/* Filter Button */
<Button variant={showFilters ? "default" : "outline"} size="sm" leftIcon={<Filter />}>
  Filters
</Button>

/* Outline Button */
<Button variant="outline" size="sm" onClick={handleClearFilters}>
  Clear Filters
</Button>

/* Ghost Button */
<Button variant="ghost" size="sm" onClick={handleLogout}>
  Logout
</Button>
```

### Badges
```css
/* Default Badge */
.badge {
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
}

/* Badge Variants */
.badge-secondary {
  background-color: #f1f5f9;
  color: #475569;
}

.badge-info {
  background-color: #dbeafe;
  color: #1e40af;
}

.badge-outline {
  background-color: transparent;
  border: 1px solid #cbd5e1;
  color: #475569;
}

.badge-gradient {
  background: linear-gradient(to right, #2563eb, #9333ea);
  color: white;
}
```

### Input Fields
```css
/* Input Container */
.input {
  width: 100%;
  height: 48px;
  padding: 12px 16px 12px 40px; /* Left padding for icon */
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 16px;
  transition: all 200ms;
}

.input:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

/* Input Icon */
.input-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  width: 16px;
  height: 16px;
}
```

### Filters Panel
```css
/* Filter Container */
.filter-panel {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  border: 1px solid #e2e8f0;
  padding: 24px;
  position: sticky;
  top: 96px; /* Below header */
}

/* Checkbox */
.checkbox {
  width: 16px;
  height: 16px;
  border-radius: 4px;
  border: 1px solid #cbd5e1;
  color: #2563eb;
}

.checkbox:checked {
  background-color: #2563eb;
  border-color: #2563eb;
}

.checkbox:focus {
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}
```

### Modal
```css
/* Modal Overlay */
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}

/* Modal Container */
.modal {
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
  max-width: 896px; /* 4xl */
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
}

/* Modal Header (Gradient) */
.modal-header {
  background: linear-gradient(to right, #2563eb, #9333ea);
  color: white;
  padding: 24px;
}

/* Modal Content */
.modal-content {
  overflow-y: auto;
  max-height: calc(90vh - 180px);
  padding: 24px;
}

/* Modal Footer */
.modal-footer {
  background-color: #f8fafc;
  border-top: 1px solid #e2e8f0;
  padding: 16px 24px;
}
```

---

## Animations & Transitions

### Keyframe Animations
```css
/* Fade In */
@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.animate-fade-in {
  animation: fade-in 400ms ease-out;
}

/* Scale In */
@keyframes scale-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-scale-in {
  animation: scale-in 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

/* Slide Down */
@keyframes slide-down {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slide-down {
  animation: slide-down 200ms ease-out;
}

/* Slide Up */
@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slide-up {
  animation: slide-up 300ms ease-out;
}
```

### Transition Utilities
```css
/* Default Transition */
transition-all duration-300
/* All properties, 300ms, ease */

/* Specific Transitions */
transition-colors duration-200
/* Color properties only, 200ms */

transition-transform duration-300
/* Transform property, 300ms */

transition-shadow duration-300
/* Shadow property, 300ms */
```

### Hover Effects
```css
/* Card Hover */
.card:hover {
  transform: scale(1.02);
  box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
  border-color: #93c5fd;
}

/* Button Hover */
.button:hover {
  transform: translateY(-2px);
  box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1);
}

/* Icon Button Hover */
.icon-button:hover {
  background-color: #f1f5f9;
  transform: scale(1.1);
}
```

### Staggered Animations
```css
/* Job Cards Stagger */
.job-card:nth-child(1) { animation-delay: 0ms; }
.job-card:nth-child(2) { animation-delay: 50ms; }
.job-card:nth-child(3) { animation-delay: 100ms; }
.job-card:nth-child(4) { animation-delay: 150ms; }
/* Pattern continues... */
```

---

## Responsive Design

### Breakpoints
```css
/* Tailwind Default Breakpoints */
sm: 640px   /* Small devices (tablets) */
md: 768px   /* Medium devices (landscape tablets) */
lg: 1024px  /* Large devices (laptops) */
xl: 1280px  /* Extra large devices (desktops) */
2xl: 1536px /* 2X large devices (large desktops) */
```

### Responsive Patterns

#### Grid Layouts
```css
/* Job Cards Grid */
/* Mobile: 1 column */
grid-cols-1

/* Tablet: 2 columns */
md:grid-cols-2

/* Desktop: 3 columns */
xl:grid-cols-3

/* Implementation */
className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
```

#### Typography Scaling
```css
/* Page Title */
text-4xl md:text-6xl
/* 36px → 60px */

/* Body Text */
text-base md:text-lg
/* 16px → 18px */

/* Small Text */
text-sm md:text-base
/* 14px → 16px */
```

#### Spacing Scaling
```css
/* Vertical Padding */
py-8 md:py-12 lg:py-20
/* 32px → 48px → 80px */

/* Horizontal Padding */
px-4 sm:px-6 lg:px-8
/* 16px → 24px → 32px */
```

#### Component Visibility
```css
/* Hide on Mobile, Show on Desktop */
hidden md:flex

/* Show on Mobile, Hide on Desktop */
md:hidden

/* Example: View Toggle */
className="hidden md:flex"
```

### Mobile Menu
```css
/* Mobile Menu Button */
.mobile-menu-button {
  display: block;
}

@media (min-width: 768px) {
  .mobile-menu-button {
    display: none;
  }
}

/* Mobile Menu Panel */
.mobile-menu {
  display: block;
  padding: 16px 0;
  border-top: 1px solid #e2e8f0;
}

@media (min-width: 768px) {
  .mobile-menu {
    display: none;
  }
}
```

---

## Interactive States

### Button States
```css
/* Default */
.button {
  background-color: #2563eb;
  color: white;
}

/* Hover */
.button:hover {
  background-color: #1d4ed8;
  transform: translateY(-2px);
}

/* Active (Pressed) */
.button:active {
  transform: translateY(0);
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
}

/* Focus (Keyboard) */
.button:focus-visible {
  outline: 2px solid transparent;
  outline-offset: 2px;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.5);
}

/* Disabled */
.button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}
```

### Card States
```css
/* Default */
.card {
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
}

/* Hover */
.card:hover {
  border-color: #93c5fd;
  box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
  transform: scale(1.02);
}

/* Active/Selected */
.card.selected {
  border-color: #2563eb;
  box-shadow: 0 0 0 2px #2563eb;
}

/* Featured */
.card.featured {
  box-shadow: 0 0 0 2px #60a5fa, 0 0 0 4px white;
}
```

### Input States
```css
/* Default */
.input {
  border: 1px solid #cbd5e1;
}

/* Focus */
.input:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

/* Error */
.input.error {
  border-color: #dc2626;
}

.input.error:focus {
  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
}

/* Disabled */
.input:disabled {
  background-color: #f1f5f9;
  color: #94a3b8;
  cursor: not-allowed;
}
```

### Bookmark/Save States
```css
/* Unsaved */
.bookmark-icon {
  color: #94a3b8;
}

.bookmark-icon:hover {
  color: #2563eb;
}

/* Saved */
.bookmark-icon.saved {
  color: #2563eb;
  fill: currentColor;
}
```

### Checkbox States
```css
/* Unchecked */
.checkbox {
  border: 1px solid #cbd5e1;
  background-color: white;
}

/* Checked */
.checkbox:checked {
  background-color: #2563eb;
  border-color: #2563eb;
  background-image: url("data:image/svg+xml,..."); /* Checkmark */
}

/* Focus */
.checkbox:focus {
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

/* Disabled */
.checkbox:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

---

## Layout Structure

### Page Layout
```
┌─────────────────────────────────────┐
│           Header (Sticky)            │
│  Logo | Navigation | Auth Buttons    │
├─────────────────────────────────────┤
│           Hero Section               │
│       Title + Search Bar             │
│          Quick Stats                 │
├─────────────────────────────────────┤
│         Controls Bar                 │
│  Results | Filters | Sort | View    │
├─────────────────────────────────────┤
│  ┌──────────┬───────────────────┐   │
│  │ Filters  │   Job Cards Grid  │   │
│  │  Panel   │                   │   │
│  │ (Sticky) │   Card  Card Card │   │
│  │          │   Card  Card Card │   │
│  │          │   Card  Card Card │   │
│  └──────────┴───────────────────┘   │
└─────────────────────────────────────┘
```

### Grid System
```css
/* Main Container */
max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
/* Max width 1280px, centered, responsive padding */

/* Two Column Layout (Filters + Content) */
.layout {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

@media (min-width: 1024px) {
  .layout {
    flex-direction: row;
  }

  .sidebar {
    width: 256px;
    flex-shrink: 0;
  }

  .content {
    flex: 1;
    min-width: 0;
  }
}

/* Job Cards Grid */
.jobs-grid {
  display: grid;
  gap: 24px;
  grid-template-columns: repeat(1, minmax(0, 1fr));
}

@media (min-width: 768px) {
  .jobs-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 1280px) {
  .jobs-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
```

### Z-Index Layers
```css
/* Z-Index Scale */
z-0: 0      /* Base layer */
z-10: 10    /* Dropdowns, tooltips */
z-20: 20    /* Sticky elements */
z-30: 30    /* Modals, overlays */
z-40: 40    /* Sticky header */
z-50: 50    /* Modal content */

/* Usage */
.header { z-index: 50; }      /* Always on top */
.modal-overlay { z-index: 50; } /* Full screen overlay */
.modal { z-index: 50; }        /* Modal content */
.sidebar { z-index: 20; }      /* Sticky sidebar */
```

---

## Accessibility

### Focus Management
```css
/* Focus Visible (Keyboard Navigation) */
.interactive-element:focus-visible {
  outline: 2px solid transparent;
  outline-offset: 2px;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.5);
}

/* Remove default outline (use custom) */
.interactive-element:focus {
  outline: none;
}
```

### Color Contrast
All text meets WCAG AA standards for contrast:
- `slate-900` on `white`: 15.1:1 (AAA)
- `slate-700` on `white`: 9.3:1 (AAA)
- `slate-600` on `white`: 7.5:1 (AA)
- `white` on `blue-600`: 4.8:1 (AA)

### Screen Reader Support
```jsx
/* ARIA Labels */
<button aria-label="Save job">
  <BookmarkIcon />
</button>

/* ARIA Descriptions */
<input
  aria-describedby="search-help"
  placeholder="Job title or keyword"
/>
<span id="search-help" className="sr-only">
  Search for jobs by title, company, or skills
</span>

/* Screen Reader Only Text */
<span className="sr-only">Loading jobs</span>
```

### Keyboard Navigation
All interactive elements are keyboard accessible:
- Tab order follows visual order
- Enter/Space activates buttons
- Escape closes modals
- Arrow keys for dropdowns

---

## Implementation Examples

### Complete Card Style
```jsx
<div className="group bg-white rounded-xl shadow-md border border-slate-200 hover:shadow-2xl hover:border-blue-300 transition-all duration-300 overflow-hidden animate-scale-in cursor-pointer ring-2 ring-blue-400 ring-offset-2">
  {/* Featured badge */}
  <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-semibold px-4 py-2 flex items-center">
    <Star className="w-3 h-3 mr-1 fill-current" />
    Featured Job
  </div>

  <div className="p-6">
    {/* Company Logo */}
    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-lg mb-4">
      T
    </div>

    {/* Content */}
    <h3 className="text-lg font-semibold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
      Senior Full-Stack Engineer
    </h3>
    <p className="text-sm text-slate-600 mb-2">TechCorp Inc.</p>

    {/* Details */}
    <div className="space-y-2 mb-4">
      <div className="flex items-center text-sm text-slate-600">
        <MapPin className="w-4 h-4 mr-2 text-slate-400" />
        San Francisco, CA
      </div>
    </div>

    {/* Badges */}
    <div className="flex flex-wrap gap-2 mb-4">
      <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs rounded-md font-medium">
        Full-time
      </span>
    </div>
  </div>
</div>
```

### Complete Button
```jsx
<button className="relative inline-flex items-center justify-center px-6 py-3 text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200">
  <Search className="w-5 h-5 mr-2" />
  Search Jobs
</button>
```

---

## Notes for Developers

### Tailwind Configuration
Ensure your `tailwind.config.js` includes:
```js
module.exports = {
  theme: {
    extend: {
      animation: {
        'fade-in': 'fade-in 400ms ease-out',
        'scale-in': 'scale-in 300ms cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-down': 'slide-down 200ms ease-out',
        'slide-up': 'slide-up 300ms ease-out',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        'slide-down': {
          from: { opacity: '0', transform: 'translateY(-8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
}
```

### CSS Variables Alternative
For theme switching, consider using CSS variables:
```css
:root {
  --color-primary: #2563eb;
  --color-secondary: #9333ea;
  --color-accent: #db2777;
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
}
```

---

## Troubleshooting

### Common Issues

#### 1. Buttons Not Visible or Have No Background

**Symptom:** Buttons appear transparent or have no visible background color.

**Cause:** Custom gradient classes (`bg-gradient-primary`, `bg-gradient-surface`, `bg-gradient-interactive`) are not defined in the CSS.

**Solution:** Ensure the following classes are added to `globals.css` under `@layer components`:

```css
@layer components {
  .bg-gradient-primary {
    background: linear-gradient(135deg, hsl(var(--primary-500)), hsl(var(--primary-600)));
  }

  .bg-gradient-surface {
    background: linear-gradient(135deg, hsl(var(--surface-50)), hsl(var(--surface-100)));
  }

  .bg-gradient-interactive {
    background: linear-gradient(135deg, hsl(var(--interactive-500)), hsl(var(--interactive-600)));
  }
}
```

#### 2. CSS Variables Not Working

**Symptom:** Colors appear incorrect or default to black/white.

**Cause:** CSS custom properties may not be defined in `:root`.

**Solution:** Verify that all color variables are defined in `globals.css`:

```css
:root {
  --primary-500: 240 100% 60%;
  --primary-600: 240 84% 55%;
  --interactive-500: 142 71% 45%;
  --interactive-600: 142 76% 36%;
  /* ... etc */
}
```

#### 3. Animations Not Playing

**Symptom:** Elements appear without smooth transitions or animations.

**Cause:** Tailwind animation utilities may not be configured.

**Solution:** Check `tailwind.config.ts` includes animation keyframes and ensure `tailwindcss-animate` plugin is installed:

```bash
npm install tailwindcss-animate
```

#### 4. Hover Effects Not Working

**Symptom:** Cards or buttons don't respond to hover.

**Cause:** Missing `transition` classes or incorrect `group` usage.

**Solution:** Ensure parent elements have `group` class and children use `group-hover:` prefix:

```jsx
<div className="group transition-all duration-300">
  <h3 className="group-hover:text-blue-600">Title</h3>
</div>
```

#### 5. Responsive Design Breaking

**Symptom:** Layout looks wrong on mobile or desktop.

**Cause:** Missing responsive prefixes or incorrect breakpoint usage.

**Solution:** Use Tailwind responsive prefixes consistently:

```jsx
// Correct
<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3">

// Incorrect (missing mobile-first approach)
<div className="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1">
```

#### 6. Modal Not Scrolling

**Symptom:** Modal content is cut off and can't scroll.

**Cause:** Missing `overflow-y-auto` or incorrect height constraints.

**Solution:** Add proper overflow and max-height classes:

```jsx
<div className="overflow-y-auto max-h-[calc(90vh-180px)]">
  {/* Modal content */}
</div>
```

#### 7. Z-Index Conflicts

**Symptom:** Elements appear behind others when they should be in front.

**Cause:** Incorrect z-index values or competing stacking contexts.

**Solution:** Use the defined z-index scale:

```css
Header: z-50 (top layer)
Modal: z-50 (full-screen overlay)
Sticky Sidebar: z-20
Dropdowns: z-10
Base: z-0
```

### Performance Optimization Tips

1. **Use `useMemo` for expensive filtering:**
```jsx
const filteredJobs = useMemo(() => {
  // Filtering logic
}, [jobs, filters]);
```

2. **Limit animation delays for large lists:**
```jsx
// Only apply stagger to first 12 items
style={{ animationDelay: index < 12 ? `${index * 50}ms` : '0ms' }}
```

3. **Use `loading="lazy"` for images:**
```jsx
<img src={logo} alt={company} loading="lazy" />
```

4. **Debounce search inputs:**
```jsx
const debouncedSearch = useDebouncedValue(searchQuery, 300);
```

### Browser Compatibility

- **Chrome:** 90+ (Full support)
- **Firefox:** 88+ (Full support)
- **Safari:** 14+ (Full support, may need `-webkit-` prefixes)
- **Edge:** 90+ (Full support)

**Note:** Backdrop blur effects require modern browsers. Add fallback for older browsers:

```css
.backdrop-blur-support {
  @supports (backdrop-filter: blur(10px)) {
    backdrop-filter: blur(10px);
  }
  @supports not (backdrop-filter: blur(10px)) {
    background-color: rgba(255, 255, 255, 0.95);
  }
}
```

---

## Developer Checklist

When creating new pages using this design system:

- [ ] Import required UI components from `@/components/ui/*`
- [ ] Verify CSS variables are defined in `globals.css`
- [ ] Check gradient utilities are available (`.bg-gradient-*`)
- [ ] Add proper TypeScript types for data structures
- [ ] Implement responsive design with mobile-first approach
- [ ] Add animations with appropriate delays and durations
- [ ] Test keyboard navigation and focus states
- [ ] Verify color contrast meets WCAG AA standards
- [ ] Test on multiple browsers and devices
- [ ] Optimize images and assets
- [ ] Add proper ARIA labels for accessibility
- [ ] Implement error states and loading indicators

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.1 | Oct 14, 2025 | Fixed button visibility issue, added gradient utilities, updated button documentation |
| 1.0 | Oct 14, 2025 | Initial design system documentation |

---

**End of Design System Documentation**

For questions or contributions, please refer to the project repository or contact the development team.
