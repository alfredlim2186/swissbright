# Hero Background Video

## Current Setup

The hero section uses a background video from Mixkit (free stock videos).

If the video isn't loading, you can:

## Option 1: Use Your Own Video

1. Place your video file here: `public/videos/hero-background.mp4`
2. Update `app/components/Hero.tsx`:

```tsx
<source src="/videos/hero-background.mp4" type="video/mp4" />
```

### Recommended Video Specs:
- **Format**: MP4 (H.264 codec)
- **Resolution**: 1920x1080 (Full HD) or 1280x720 (HD)
- **Duration**: 10-30 seconds (loops seamlessly)
- **File Size**: Under 5MB for web performance
- **Frame Rate**: 24-30 fps
- **Content**: Person running, fitness, movement, freedom themes

### Free Video Sources:
- **Pexels**: https://www.pexels.com/search/videos/running/
- **Mixkit**: https://mixkit.co/free-stock-video/running/
- **Coverr**: https://coverr.co/
- **Pixabay**: https://pixabay.com/videos/search/running/

## Option 2: Use Static Image (Fallback)

If you prefer no video, edit `app/components/Hero.tsx` and remove the `<video>` element, keep only the image.

## Current Video URL

The hero currently tries to load from:
- Mixkit: Man running on track

Check your browser console for video loading errors.

## Troubleshooting

**Video not playing?**
- Check browser console for errors
- Try a different video URL
- Ensure file size isn't too large
- Check network tab to see if video is downloading
- Some corporate networks block video streaming

**Video too slow to load?**
- Reduce video file size
- Use a CDN
- Add `poster` attribute (shows image while loading)
- Consider using a GIF instead for smaller size

