---
name: Telemetry Queue System
colors:
  surface: '#f9f9ff'
  surface-dim: '#d3daea'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f0f3ff'
  surface-container: '#e7eefe'
  surface-container-high: '#e2e8f8'
  surface-container-highest: '#dce2f3'
  on-surface: '#151c27'
  on-surface-variant: '#4c4354'
  inverse-surface: '#2a313d'
  inverse-on-surface: '#ebf1ff'
  outline: '#7d7385'
  outline-variant: '#cec2d6'
  surface-tint: '#7f30d0'
  primary: '#5e00aa'
  on-primary: '#ffffff'
  primary-container: '#7928ca'
  on-primary-container: '#e1c4ff'
  inverse-primary: '#dbb8ff'
  secondary: '#575e70'
  on-secondary: '#ffffff'
  secondary-container: '#d9dff5'
  on-secondary-container: '#5c6274'
  tertiary: '#003e8c'
  on-tertiary: '#ffffff'
  tertiary-container: '#0054b9'
  on-tertiary-container: '#bccfff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#efdbff'
  primary-fixed-dim: '#dbb8ff'
  on-primary-fixed: '#2b0052'
  on-primary-fixed-variant: '#6600b7'
  secondary-fixed: '#dce2f7'
  secondary-fixed-dim: '#c0c6db'
  on-secondary-fixed: '#141b2b'
  on-secondary-fixed-variant: '#404758'
  tertiary-fixed: '#d8e2ff'
  tertiary-fixed-dim: '#aec6ff'
  on-tertiary-fixed: '#001a43'
  on-tertiary-fixed-variant: '#004397'
  background: '#f9f9ff'
  on-background: '#151c27'
  surface-variant: '#dce2f3'
typography:
  display-ticket:
    fontFamily: Space Grotesk
    fontSize: 4.5rem
    fontWeight: '700'
    lineHeight: '1'
    letterSpacing: -0.05em
  display-ticket-mobile:
    fontFamily: Space Grotesk
    fontSize: 3rem
    fontWeight: '700'
    lineHeight: '1'
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Space Grotesk
    fontSize: 2rem
    fontWeight: '600'
    lineHeight: 2.5rem
    letterSpacing: -0.03em
  headline-lg-mobile:
    fontFamily: Space Grotesk
    fontSize: 1.5rem
    fontWeight: '600'
    lineHeight: 2rem
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 1.25rem
    fontWeight: '600'
    lineHeight: 1.75rem
    letterSpacing: -0.02em
  body-lg:
    fontFamily: Geist
    fontSize: 1.125rem
    fontWeight: '400'
    lineHeight: 1.75rem
    letterSpacing: -0.01em
  body-md:
    fontFamily: Geist
    fontSize: 1rem
    fontWeight: '400'
    lineHeight: 1.5rem
  body-sm:
    fontFamily: Geist
    fontSize: 0.875rem
    fontWeight: '400'
    lineHeight: 1.25rem
  label-telemetry:
    fontFamily: Geist
    fontSize: 0.75rem
    fontWeight: '500'
    lineHeight: 1rem
    letterSpacing: 0.06em
  data-mono:
    fontFamily: Geist
    fontSize: 0.875rem
    fontWeight: '500'
    lineHeight: 1.25rem
    letterSpacing: 0.02em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1.25rem
  gutter-mobile: 0.75rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system establishes a high-precision, technical aesthetic tailored for real-time virtual queue management and customer routing. Blending minimalist restraint with telemetry dashboard mechanics, it prioritizes immediate visual orientation, absolute clarity, and functional confidence. 

The emotional tone balances calm reassurance for waiting customers with crisp operational speed for service operators. High-contrast geometric cues, monospaced tabular data, and purposeful purple illumination signal responsive, real-time computing without decorative noise. The interface avoids branding flourishes in favor of structural density, distinct operational statuses, and unambiguous numerical hierarchy.

## Colors

The palette is engineered around high-contrast legibility and sharp telemetry states on bright neutral planes:

- **Primary (`#7928CA`)**: Electric Violet serves as the focal beacon. It marks active ticket callouts, primary triggers, focused interactions, and real-time state alerts.
- **Secondary (`#111827`)**: Deep Carbon anchors essential structural surfaces, ticket code readouts, and primary headlines, guaranteeing maximum contrast against light backdrops.
- **Tertiary (`#0070F3`)**: Signal Blue represents live telemetry updates, secondary progression indicators, and synchronization timestamps.
- **Neutrals**: Built on a calibrated spectrum of stark whites (`#FFFFFF`), ambient tinted grays (`#F8F9FA`, `#F1F3F5`), boundary strokes (`#E5E7EB`), and data typography neutrals (`#6B7280`, `#374151`).
- **Semantic Accents**: Strict operational cues utilize pure Green (`#10B981`) for "Now Serving / Called", Amber (`#F59E0B`) for "Delayed / Standby", and Crimson (`#EF4444`) for "Cancelled / Expired".

## Typography

Typography governs system hierarchy through clear structural separation:

- **Headlines & Metric Identifiers (`Space Grotesk`)**: Provides an angular, technological cadence. Used strictly for section anchors, window titles, and high-impact token numbers (`display-ticket`). Its structural geometry ensures ticket characters (e.g., `A-104`, `B-42`) stand out instantly from distances or glanceable mobile views.
- **Operational Data & Body (`Geist`)**: Delivers neutral clarity for body instructions, estimated wait metrics, and user information.
- **Tabular Figures & Telemetry**: Dynamic durations, position shifts, and desk numbers enforce `font-feature-settings: "tnum" 1` to prevent layout reflow during live counter updates. Telemetry sub-labels are rendered in uppercase with wide tracking for immediate recognition.

## Layout & Spacing

The system deploys an 8pt spatial grid scaled strictly across mathematical intervals. 

- **Layout Grid**: A desktop 12-column layout centers content within a bounded telemetry dashboard container (max-width `1280px`). Tablet scales to an 8-column layout, and mobile operates on a compact 4-column flow.
- **Spatial Rhythm**: Padding and gaps follow strict step tokens. `space-xs` (4px) isolates fine telemetry labels from numerical data; `space-sm` (8px) separates status pills and secondary meta; `space-md` (16px) establishes internal card rhythm; `space-lg` (24px) segments module sections; `space-xl` (40px) demarcates primary operational panes.
- **Reflow Architecture**: Mobile environments collapse multi-desk monitors into a sticky priority stack: the user's primary active status remains pinned at top or bottom, with subsequent queue timelines scrolling below.

## Elevation & Depth

Visual hierarchy uses a refined technical layer strategy: calibrated surface luminance combined with micro-borders, avoiding deep diffuse shadows in favor of precise edges.

- **Level 0 (Canvas Base)**: `#FFFFFF` or flat structural `#F8F9FA` for overall view canvas.
- **Level 1 (Telemetry Panels & Default Cards)**: Solid `#FFFFFF` defined by a crisp `1px solid #E5E7EB` stroke and an ambient, low-spread drop shadow (`box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.04)`).
- **Level 2 (Active Ticket Focus & Modals)**: Elevated status modules feature an illuminated border tint (`1px solid rgba(121, 40, 202, 0.35)`) and an ultra-fine ambient purple-cast shadow (`box-shadow: 0 4px 20px -2px rgba(121, 40, 202, 0.08), 0 2px 6px -1px rgba(0, 0, 0, 0.04)`).
- **Surface Transitions**: Elevation state changes avoid bounce physics, adopting strict, linear transitions (`150ms ease-out`) characteristic of live technical monitors.

## Shapes

In alignment with the selected technical visual identity and `roundedness: 1`:

- **Primary Geometry**: Standard controls, inputs, data modules, and list rows adopt a precise, soft corner radius (`0.25rem` / `4px`).
- **Surface Cards & Modals**: Larger surfaces utilize `rounded-lg` (`0.5rem` / `8px`) or `rounded-xl` (`0.75rem` / `12px`) to preserve a clean, controlled silhouette without soft organic contours.
- **Telemetry Chips & Status Pills**: Retain strict compact rounding (`0.25rem` / `4px`) rather than full stadium pill shapes, accentuating the instrumentation and dashboard aesthetic.

## Components

### 1. High-Impact Ticket Display
- **Visual Spec**: Centered metric container with `border: 1px solid #E5E7EB`, background `#FFFFFF`. Features an optional top accent line (`3px solid #7928CA`).
- **Content Hierarchy**: Upper tracking label (`label-telemetry`, uppercase, `#6B7280`), centered colossal ticket code (`Space Grotesk`, `700`, `#111827`), followed by real-time queue position indicators (`font-variant-numeric: tabular-nums`).

### 2. Buttons & Triggers
- **Primary Action**: Solid `#7928CA` fill, white text, height `48px`, font weight `500`. Hover state triggers `#661FA8`. Active press transitions to scale `0.98`. Focus ring: `2px solid #7928CA` with `2px` offset.
- **Secondary Action**: Border `1px solid #E5E7EB`, surface `#FFFFFF`, text `#111827`. Hover applies `#F9FAFB` and `#111827` border reinforcement.
- **Tonal Destructive / Abandon**: Surface `#FEE2E2`, text `#991B1B`, border `1px solid #FCA5A5`.

### 3. Status Chips & Telemetry Tags
- **Structure**: Inline-flex, height `24px`, padding `0 8px`, `border-radius: 4px`, uppercase tracking.
- **Now Serving**: Surface `#ECFDF5`, text `#065F46`, micro-dot indicator pulse `#10B981`.
- **In Queue**: Surface `#F3E8FF`, text `#581C87`, border `1px solid rgba(121, 40, 202, 0.2)`.
- **Standby / Estimated**: Surface `#FEF3C7`, text `#92400E`.

### 4. Queue List Rows & Desk Cards
- **Structure**: Grid-aligned records with top-bottom borders (`#F3F4F6`), subtle horizontal hover tint (`#F9FAFB`).
- **Attributes**: Left column hosts ticket identifier; middle column displays service window / desk number; right column renders real-time elapsed or estimated clock counters.

### 5. Input Fields
- **Metrics**: Height `44px`, horizontal padding `12px`, border `1px solid #D1D5DB`, background `#FFFFFF`, text `#111827`.
- **States**: Focused inputs show a sharp border shift to `#7928CA` paired with an inner box-shadow ring (`0 0 0 1px #7928CA`). Monospaced telephone and identification inputs utilize tabular glyph widths.