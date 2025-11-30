# Design Guidelines: Changelog Page

## Design Approach
**Reference-Based with Custom Aesthetic**: Drawing inspiration from modern changelog designs (Linear, GitHub, Stripe) combined with a distinctive turquoise-pink gradient aesthetic. The design balances information clarity with visual appeal through strategic use of gradients and spacing.

## Core Design Principles
1. **Vibrant but Readable**: Turquoise-pink gradients as accents, not overwhelming backgrounds
2. **Clear Timeline Hierarchy**: Easy scanning of versions and dates
3. **Content-Focused**: Changelog entries are the star, supported by elegant typography
4. **Cohesive Integration**: Discord widget feels native, not bolted-on

## Layout System

**Container Structure**:
- Main content area: max-w-4xl for changelog
- Discord widget: fixed width sidebar (w-80) on desktop
- Responsive: Discord widget moves to bottom on mobile

**Spacing Scale**: Use Tailwind units of 3, 4, 6, 8, 12, 16
- Section padding: py-12 or py-16
- Card spacing: p-6 or p-8
- Element gaps: gap-4, gap-6, gap-8

## Typography

**Font Families**:
- Primary: 'Inter' (via Google Fonts) - clean, modern readability
- Monospace: 'JetBrains Mono' - for version numbers and code snippets

**Hierarchy**:
- Page Title: text-4xl, font-bold
- Version Headers: text-2xl, font-semibold
- Update Categories: text-sm, font-medium, uppercase tracking-wide
- Body Text: text-base, leading-relaxed
- Dates: text-sm, opacity-70

## Component Structure

**Header**:
- Logo (attached image) on left, height h-12
- Title "Changelog" or project name
- Subtle turquoise-pink gradient background
- Sticky positioning (sticky top-0) for scroll context

**Changelog Timeline**:
- Vertical timeline line connecting entries
- Each version in a card with rounded corners (rounded-xl)
- Version badge with gradient background (turquoise-to-pink)
- Date prominently displayed
- Categories grouped: "New Features", "Improvements", "Bug Fixes"
- Category icons using Heroicons (SparklesIcon, ArrowUpIcon, WrenchIcon)
- List items with checkmarks or dots

**Discord Widget Container**:
- Fixed position on desktop (lg:fixed lg:right-8 lg:top-24)
- Card styling with rounded-xl border
- Embedded iframe for Discord widget
- Heading "Join Our Community"
- Fallback link if widget doesn't load

**Category Tags**:
- Small pills with gradient backgrounds
- "New" - turquoise gradient
- "Improved" - pink gradient  
- "Fixed" - neutral with border

## Visual Treatments

**Gradients** (Turquoise-Pink Theme):
- Primary gradient: from-cyan-400 via-teal-400 to-pink-400
- Accent gradient: from-pink-500 to-purple-500
- Subtle backgrounds: from-cyan-50 to-pink-50 (very light)

**Cards**:
- White background with subtle shadow
- Border with gradient on hover (border-transparent hover:border-gradient)
- Smooth transitions (transition-all duration-300)

**Timeline Line**:
- Vertical line with gradient (turquoise to pink top-to-bottom)
- Connection dots at each version point

## Icons
Use Heroicons via CDN:
- SparklesIcon for new features
- BoltIcon for improvements
- WrenchIcon for bug fixes
- UserGroupIcon for Discord widget header

## Images
**Logo Placement**: Header, centered or left-aligned, maintain aspect ratio at h-12
**No Hero Image**: This is a utility page focused on content readability

## Animations
Minimal and purposeful:
- Subtle fade-in for changelog entries on scroll (stagger effect)
- Smooth hover states on cards (slight scale and shadow increase)
- No distracting animations that impede reading

## Accessibility
- Semantic HTML5 (article, time, section elements)
- ARIA labels for timeline navigation
- Keyboard navigation support for Discord widget
- Sufficient color contrast on all text despite colorful theme
- Focus indicators with turquoise-pink gradient ring

## Mobile Responsiveness
- Single column layout on mobile
- Discord widget moves below changelog (not fixed)
- Reduced padding (py-8 instead of py-16)
- Timeline line hidden or simplified on mobile
- Touch-friendly interactive elements (min h-12)

This design creates a visually striking changelog page that honors the turquoise-pink aesthetic while maintaining excellent readability and user experience.