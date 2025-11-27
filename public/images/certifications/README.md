# Certification Logos

This directory is for your official certification logos (ISO 22000, GMP, ISO 9001, HACCP).

## How to Add Your Certification Logos

### 1. Obtain Official Logos
Contact your certification bodies to get the official logo files:
- **ISO certifications**: Contact your ISO certification body (e.g., BSI, NQA, SGS)
- **GMP**: Contact your GMP certification provider
- **HACCP**: Contact your HACCP certification authority

### 2. Logo File Guidelines
- **Format**: PNG or SVG (PNG with transparent background preferred)
- **Size**: 200x200px to 400x400px recommended
- **Quality**: High resolution for web display
- **File names**: Use clear names like:
  - `iso-22000.png`
  - `gmp-cert.png`
  - `iso-9001.png`
  - `haccp-cert.png`

### 3. Place Logos Here
Save your certification logo files in this directory:
```
public/images/certifications/
├── iso-22000.png
├── gmp-cert.png
├── iso-9001.png
└── haccp-cert.png
```

### 4. Update the Safety Component
Edit `app/components/Safety.tsx` and replace the placeholder URLs:

```typescript
const certifications = [
  {
    logo: '/images/certifications/iso-22000.png',  // <-- Update this path
    code: 'ISO 22000',
    ...
  },
  {
    logo: '/images/certifications/gmp-cert.png',  // <-- Update this path
    code: 'GMP',
    ...
  },
  {
    logo: '/images/certifications/iso-9001.png',  // <-- Update this path
    code: 'ISO 9001',
    ...
  },
  {
    logo: '/images/certifications/haccp-cert.png',  // <-- Update this path
    code: 'HACCP',
    ...
  },
]
```

## Important Usage Guidelines

### Legal Requirements
- **Only use logos if you have valid certifications**
- **Follow your certification body's usage guidelines**
- **Include proper disclaimers if required**
- **Keep certifications up to date**

### Common Usage Rules
Most certification bodies require:
1. Logos should only be used by certified organizations
2. Logos must be accompanied by certification details (certificate number, scope)
3. Logos should not be used on products unless explicitly permitted
4. Logos can typically be used on marketing materials and websites
5. Some bodies require statements like: "Manufactured under [Body] certified [Standard] management system"

### Resources
- **NQA Logos**: https://www.nqa.com/en-us/clients/logos
- **BSI Guidelines**: https://www.bsigroup.com/ (check client portal)
- **HACCP International**: https://haccp-international.com/haccp-international-artwork/

### Contact Your Certification Body
For specific guidance on logo usage and to obtain official files, contact:
- Your certification body's client services
- Your account manager or auditor
- The certification body's marketing/branding department

## Current Status
- ⚠️ Currently using placeholder images
- 🎯 Replace with your actual certification logos
- ✅ Structure is ready for easy logo replacement

