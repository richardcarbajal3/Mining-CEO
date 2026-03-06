# Design Guidelines: Roadmap de Gestión Integral Minera

## Design Approach: Enterprise Design System

**Selected System**: Material Design with Carbon Design influences for data-heavy enterprise context

**Justification**: This mining management platform requires robust data visualization, clear hierarchies, and enterprise-grade reliability. Material Design provides comprehensive component patterns while Carbon Design principles ensure optimal handling of complex dashboards and KPIs.

**Key Principles**:
- Clarity over decoration: Information must be instantly parsable
- Progressive disclosure: Complex data revealed contextually
- Consistent interactions: Predictable patterns across all modules
- Professional credibility: Mining industry-appropriate visual language

## Core Design Elements

### A. Color Palette

**Dark Mode Primary** (default):
- Background Base: 220 15% 12% (deep slate)
- Surface Elevated: 220 12% 18% (elevated panels)
- Primary Brand: 200 85% 45% (professional mining blue)
- Success/Complete: 142 76% 45% (confirmation green)
- Warning/Progress: 38 92% 50% (amber for in-progress)
- Error/Pending: 0 84% 60% (critical alerts)
- Text Primary: 220 15% 95%
- Text Secondary: 220 10% 70%

**Light Mode**:
- Background: 0 0% 98%
- Surface: 0 0% 100%
- Primary: 200 95% 35%
- Success: 142 71% 35%
- Warning: 38 92% 45%
- Error: 0 84% 55%

**Block Status Colors**:
- Pending: 220 15% 25% (muted gray)
- In Progress: 38 92% 50% (amber)
- Completed: 142 76% 45% (success green)

### B. Typography

**Font Families**:
- Primary: 'Inter' (headings, UI elements, data)
- Secondary: 'Roboto Mono' (numeric data, KPIs, code-like content)

**Scale**:
- Hero/Dashboard Title: text-4xl font-bold (36px)
- Block Headers: text-2xl font-semibold (24px)
- Section Titles: text-xl font-semibold (20px)
- Body/Lists: text-base font-normal (16px)
- Labels/Captions: text-sm font-medium (14px)
- Data/Metrics: text-sm font-mono (14px monospace)

**Philosophy Banner**: text-lg font-bold tracking-wide uppercase (persistent visibility)

### C. Layout System

**Spacing Primitives**: Tailwind units of 2, 4, 6, 8, 12, 16
- Micro spacing (2-4): Component internal padding, icon margins
- Standard spacing (6-8): Card padding, list item gaps
- Section spacing (12-16): Major component separation

**Container Strategy**:
- Dashboard: max-w-[1400px] (full width roadmap visibility)
- Detail panels: max-w-5xl
- Forms/checklists: max-w-3xl

**Grid Patterns**:
- Roadmap blocks: grid-cols-1 md:grid-cols-2 lg:grid-cols-4 (responsive 8-block layout)
- KPI cards: grid-cols-2 lg:grid-cols-4 gap-4
- Stakeholder list: grid-cols-1 lg:grid-cols-2 gap-6

### D. Component Library

**Roadmap Blocks** (primary navigation):
- Large cards with status indicator (left border: 4px colored stripe)
- Block number badge (top-right, circular)
- Progress ring visualization (0-100%)
- Hover: subtle elevation + glow effect
- Dimensions: min-h-[200px] with flex layout

**Progress Indicators**:
- Global bar: Full-width gradient fill with percentage overlay
- Block rings: Circular progress with percentage center
- Checklist counters: "X/Y completed" badges
- Status pills: Rounded full with icon + text

**Interactive Checklists**:
- Custom checkboxes with smooth check animation
- Expandable accordion groups for nested items
- Completion timestamps (subtle, right-aligned)
- Evidence attachment indicators (paperclip icons)

**Dashboards & KPIs**:
- Metric cards: Large number + trend indicator + sparkline
- Chart containers: Minimal borders, ample padding (p-6)
- Data tables: Striped rows, sortable headers, sticky header on scroll
- Filter panels: Collapsible sidebar with clear/apply actions

**Navigation**:
- Persistent top bar with breadcrumb trail
- Philosophy banner: Sticky bottom banner (dismissible but returns on page load)
- Block quick-nav: Vertical sidebar showing all 8 blocks with status dots

**Forms & Evidence**:
- Clean input fields with floating labels
- File upload zones: Dashed border dropzone
- Validation: Inline feedback with icons
- Submit actions: Primary button (lg size) + secondary cancel

**Stakeholder Components**:
- Avatar + name + role cards
- Participation timeline (horizontal bar chart by block)
- Commitment status badges
- Contact quick-actions (subtle icon buttons)

### E. Filosofía "Tolerar, Acompañar y Persistir" Integration

**Visual Treatment**:
- Persistent banner: Fixed bottom, full-width, semi-transparent backdrop
- Styling: bg-primary/10 border-t-2 border-primary py-3 px-6
- Typography: text-center font-bold text-primary uppercase tracking-widest
- Icon: Left-aligned icon (mountain/handshake motif)
- Dismissible but auto-restores on navigation

### F. Animations

**Minimal, purposeful motion**:
- Block card hover: transform scale-[1.02] duration-200
- Checkbox check: smooth checkmark draw animation
- Progress bars: Gentle fill animation on mount (duration-500)
- Page transitions: Simple fade (opacity) duration-150
- NO: Parallax, complex scroll animations, decorative motion

### Images

**Hero Section**: No traditional hero image required

**Strategic Image Use**:
- Mining context imagery: Small accent images in empty state screens (e.g., "No evidence uploaded yet" with pickaxe illustration)
- Stakeholder avatars: Circular profile images (w-12 h-12)
- Documentation thumbnails: PDF/document preview icons
- Dashboard illustrations: Small decorative chart/graph illustrations for empty KPI states
- NO: Large decorative backgrounds, stock photos, hero banners

**Placement**: Images used functionally to clarify context, not for decoration. All images small to medium scale, integrated within components.