# Design Brief

## Direction

HoReCarLux — Warm, professional hotel booking interface that builds trust through calm, inviting design paired with clear transactional clarity.

## Tone

Warm hospitality without corporate cliché — terracotta warmth signals human touch; cool undertones maintain professionalism and clarity.

## Differentiation

Terracotta + sage green palette repositions hospitality away from safe blues; warm cream backgrounds with soft shadows create premium, approachable feel.

## Color Palette

| Token      | OKLCH         | Role                                    |
| ---------- | ------------- | --------------------------------------- |
| background | 0.98 0.008 230 | Light cream, cool undertone              |
| foreground | 0.16 0.015 230 | Dark slate for readability               |
| card       | 1.0 0.004 230  | Pure white with cool undertone          |
| primary    | 0.52 0.16 40   | Warm terracotta (book/confirm actions) |
| accent     | 0.62 0.12 160  | Sage green (secondary, calm actions)   |
| muted      | 0.95 0.01 230  | Light grey for disabled/secondary state |

## Typography

- Display: Space Grotesk — Modern, geometric headings (room names, hero titles)
- Body: General Sans — Clean, minimal paragraphs and UI labels (forms, descriptions)
- Mono: JetBrains Mono — Staff dashboard tables and payment info
- Scale: Hero `text-4xl md:text-5xl font-bold`, h2 `text-2xl font-bold`, body `text-base`, labels `text-sm font-medium`

## Elevation & Depth

Cards use subtle warm-tinted shadows (shadow-subtle on hover, shadow-elevated on interaction) to create visual hierarchy without excessive depth; border-bottom on header for zone separation.

## Structural Zones

| Zone     | Background    | Border                | Notes                                       |
| -------- | ------------- | --------------------- | ------------------------------------------- |
| Header   | bg-card       | border-b border-border | Logo, nav, guest/staff toggle              |
| Hero     | bg-background | —                     | Featured room grid with images             |
| Filters  | bg-card       | —                     | Date/guest count selectors, sticky on scroll |
| Content  | bg-background | —                     | Room cards alternate with muted sections   |
| Footer   | bg-muted/20   | border-t border-border | Links, support, copyright                  |
| Staff DB | bg-card       | —                     | Reservation queue with status badges       |

## Spacing & Rhythm

Spacious padding (24px sections, 16px card gutters) signals trust and clarity; micro-spacing (8px) for form inputs and badge components maintains visual rhythm.

## Component Patterns

- Buttons: Terracotta primary (book/confirm, 8px radius), sage green secondary (cancel/decline), ghost outline for tertiary
- Cards: 8px border-radius, 1px border-border, shadow-subtle, hover:shadow-elevated
- Badges: Inline pill-style (16px padding, full border-radius) for payment status (pending=amber, confirmed=green, declined=red)
- Forms: Input fields with 8px radius, focus:ring-2 ring-primary/50

## Motion

- Entrance: Cards fade-in on page load (opacity 0→1, 0.3s smooth)
- Hover: Buttons shift to shadow-elevated, slight scale-up (1.02x), 0.2s smooth
- Decorative: None — maintain clarity for transactional UI

## Constraints

- Maximum 3 colors per interaction (primary, secondary, muted)
- No gradients except subtle vignettes on hero images
- All interactive elements keyboard-accessible (focus-visible ring)
- Dark mode available for staff dashboard (inverted lightness, maintain saturation)

## Signature Detail

Warm terracotta accent on hover states + sage green micro-interactions signal approachability while maintaining transactional clarity and professionalism.
