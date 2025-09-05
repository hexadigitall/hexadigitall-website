# Adding Your Hexadigitall Logo

## Steps to Add Your Logo:

### 1. Save Your Logo Image
Save your logo image as `hexadigitall-logo.png` in the `public` folder of your project.

**Recommended specifications:**
- **Format**: PNG (with transparent background) or SVG
- **Size**: 400x133 pixels (3:1 aspect ratio works well)
- **File name**: `hexadigitall-logo.png`

### 2. File Location
Place the logo file here:
```
public/
  └── hexadigitall-logo.png
```

### 3. Alternative Formats
If you want to use a different format, update the file path in:
- `src/components/layout/Header.tsx` (line 25)
- `src/components/layout/Footer.tsx` (line 15)

Change from:
```typescript
src="/hexadigitall-logo.png"
```

To your preferred format:
```typescript
src="/hexadigitall-logo.svg"    // for SVG
src="/hexadigitall-logo.jpg"    // for JPG
src="/hexadigitall-logo.webp"   // for WebP
```

### 4. Customizing the Logo Size
To adjust the logo size, modify the `className` property:

**Header logo (currently `h-12`):**
```typescript
className="h-8 w-auto"   // Smaller
className="h-12 w-auto"  // Current size
className="h-16 w-auto"  // Larger
```

**Footer logo (currently `h-10`):**
```typescript
className="h-8 w-auto brightness-0 invert"   // Smaller
className="h-12 w-auto brightness-0 invert"  // Larger
```

### 5. Logo Styling
- **Header**: Logo displays in full color
- **Footer**: Logo displays in white (`brightness-0 invert` classes)

### 6. Testing
After adding your logo:
1. Save the image file in the `public` folder
2. Restart your development server: `npm run dev`
3. Check both the header and footer to ensure the logo displays correctly

## Troubleshooting

**Logo not showing?**
- Check the file path and name match exactly
- Ensure the image is in the `public` folder (not `src` or elsewhere)
- Restart your development server
- Check browser console for any image loading errors

**Logo too big/small?**
- Adjust the `height` values in the `className` properties
- Use `h-8`, `h-10`, `h-12`, `h-16`, etc. for different sizes

**Want different logos for header and footer?**
- Save two versions: `hexadigitall-logo.png` and `hexadigitall-logo-white.png`
- Update the footer to use the white version and remove the `brightness-0 invert` classes
