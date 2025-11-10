# Color Configuration Guide

This Docusaurus site uses a warm brown/orange/yellow color palette based on the scheme: `#7B542F`, `#B6771D`, `#FF9D00`, `#FFCF71`.

## Quick Start: Changing Colors

To customize the color scheme, edit the CSS variables at the top of [src/css/custom.css](src/css/custom.css:12-21):

```css
:root {
  /* Main palette colors - Change these to switch color schemes */
  --color-brown-dark: #7B542F;     /* Deep brown */
  --color-brown-medium: #B6771D;   /* Medium brown/bronze */
  --color-orange: #FF9D00;         /* Bright orange */
  --color-yellow-light: #FFCF71;   /* Light yellow/cream */
}
```

## Color Palette Overview

### Light Mode
- **Primary Color**: `#FF9D00` (Bright Orange) - Used for links, active states, and primary buttons
- **Dark Accent**: `#B6771D` (Medium Brown) - Used for hover states and secondary elements
- **Deep Brown**: `#7B542F` - Available for additional styling
- **Light Accent**: `#FFCF71` (Cream/Light Yellow) - Used for subtle highlights

### Dark Mode
The colors automatically adjust for dark mode in [src/css/custom.css](src/css/custom.css:122-187):
- **Primary Color**: `#FFB133` (Softer Orange) - Adjusted for better contrast
- **Accent Colors**: Brightened versions of the base palette
- **Background**: Dark gray tones that complement the warm palette

## How to Change the Color Scheme

### Option 1: Simple Color Swap
Replace the four main color values at the top of `custom.css`:

```css
:root {
  --color-brown-dark: #YOUR_COLOR_1;
  --color-brown-medium: #YOUR_COLOR_2;
  --color-orange: #YOUR_COLOR_3;
  --color-yellow-light: #YOUR_COLOR_4;
}
```

### Option 2: Use a Different Palette
You can create multiple color schemes by copying the variable definitions. For example:

```css
/* Cool Blue Theme */
:root {
  --color-brown-dark: #1e3a8a;      /* Deep blue */
  --color-brown-medium: #3b82f6;    /* Medium blue */
  --color-orange: #60a5fa;          /* Light blue */
  --color-yellow-light: #bfdbfe;    /* Very light blue */
}
```

## Where Colors Are Used

The color variables are used throughout the site:

- **Primary Actions**: `--color-orange` (buttons, links, active menu items)
- **Hover States**: `--color-brown-medium`
- **Highlights**: `--color-yellow-light` (code highlights, accents)
- **Deep Elements**: `--color-brown-dark` (footers, dark sections)

## Testing Your Changes

1. Edit the color variables in [src/css/custom.css](src/css/custom.css)
2. Save the file
3. Run `npm start` to see your changes live
4. Test both light and dark modes using the theme toggle

## Grayscale Palette

The site also uses a grayscale palette that you can customize:

```css
--theme-gray-0: #ffffff;  /* Pure white */
--theme-gray-1: #f8f9fa;  /* Very light gray */
--theme-gray-2: #f1f3f5;  /* Light gray */
--theme-gray-3: #e9ecef;  /* Border gray */
--theme-gray-4: #dee2e6;  /* Medium-light gray */
--theme-gray-5: #ced4da;  /* Medium gray */
--theme-gray-6: #adb5bd;  /* Medium-dark gray */
--theme-gray-7: #868e96;  /* Dark gray */
--theme-gray-8: #495057;  /* Very dark gray (text) */
--theme-gray-9: #212529;  /* Nearly black (headings) */
```

## Examples

### Warm Palette (Current)
- Deep Brown: `#7B542F`
- Medium Brown: `#B6771D`
- Orange: `#FF9D00`
- Light Yellow: `#FFCF71`

### Cool Palette (Alternative)
```css
--color-brown-dark: #1e3a8a;
--color-brown-medium: #3b82f6;
--color-orange: #60a5fa;
--color-yellow-light: #bfdbfe;
```

### Green Palette (Alternative)
```css
--color-brown-dark: #065f46;
--color-brown-medium: #059669;
--color-orange: #10b981;
--color-yellow-light: #6ee7b7;
```

### Purple Palette (Alternative)
```css
--color-brown-dark: #6b21a8;
--color-brown-medium: #9333ea;
--color-orange: #a855f7;
--color-yellow-light: #d8b4fe;
```

## Need Help?

- Check [Docusaurus Styling Documentation](https://docusaurus.io/docs/styling-layout)
- Use [ColorHunt](https://colorhunt.co/) to find color palettes
- Test accessibility with [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

## Color Contrast Guidelines

When changing colors, ensure proper contrast ratios:
- Normal text: 4.5:1 minimum
- Large text (18pt+): 3:1 minimum
- Interactive elements: 3:1 minimum

Always test your color choices with both light and dark themes.
