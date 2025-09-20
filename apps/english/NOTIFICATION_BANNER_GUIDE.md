# Notification Banner System

A flexible notification banner system similar to the Modash.io banner that appears at the top of your site after a configurable delay.

## Features

- ✅ **Delayed appearance** - Banners appear after 3-5 seconds (configurable)
- ✅ **Multiple banner types** - Info, Warning, Success, and Announcement styles
- ✅ **Persistent dismissal** - Users won't see the same banner again after dismissing
- ✅ **Auto-hide option** - Banners can automatically disappear after a set time
- ✅ **Smooth animations** - Slide down/up animations with backdrop blur
- ✅ **Responsive design** - Works on mobile and desktop
- ✅ **Easy configuration** - Manage all banners from a single config file
- ✅ **Optional links** - Add call-to-action links to banners

## Quick Setup

The banner system is already integrated into your layout! Just configure your banners in `lib/bannerConfig.ts`.

## Managing Banners

### 1. Enable/Disable Banners

Edit `lib/bannerConfig.ts` and set `enabled: true/false` for any banner:

```typescript
{
  id: 'beta-launch-2024',
  enabled: true, // ← Change this to show/hide the banner
  message: '🎉 We\'re launching our AI Talk Therapy Web App beta!',
  // ... other config
}
```

### 2. Banner Types

Choose from 4 banner styles:

- `'info'` - Blue banner with info icon
- `'warning'` - Yellow banner with warning icon  
- `'success'` - Green banner with checkmark icon
- `'announcement'` - Purple banner with megaphone icon

### 3. Configuration Options

```typescript
interface BannerConfig {
  id: string;                    // Unique identifier
  enabled: boolean;              // Show/hide banner
  message: string;               // Banner text
  type: 'info' | 'warning' | 'success' | 'announcement';
  delay?: number;                // Delay before showing (ms, default: 3000)
  autoHide?: boolean;            // Auto-hide after delay (default: false)
  autoHideDelay?: number;        // Auto-hide delay (ms, default: 10000)
  persistDismissal?: boolean;    // Remember if user dismissed (default: true)
  showLink?: boolean;            // Show/hide link (default: false)
  href?: string;                 // Optional link URL
  linkText?: string;             // Link text (default: 'Learn more')
}
```

## Common Use Cases

### Beta Launch Announcement
```typescript
{
  id: 'beta-launch-2024',
  enabled: true,
  message: '🎉 We\'re launching our beta! Be among the first to experience new features.',
  type: 'announcement',
  delay: 4000,
  showLink: true,
  href: '/dashboard',
  linkText: 'Try Beta Now'
}
```

### Maintenance Notice (No Link)
```typescript
{
  id: 'maintenance-jan-2024',
  enabled: true,
  message: '⚠️ Scheduled maintenance Sunday 2-4 AM EST. Some features may be unavailable.',
  type: 'warning',
  delay: 3000,
  showLink: false,
}
```

### New Feature Release
```typescript
{
  id: 'voice-settings-release',
  enabled: true,
  message: '✨ New voice settings available! Customize your AI companion\'s voice.',
  type: 'success',
  delay: 3500,
  showLink: true,
  href: '/dashboard',
  linkText: 'Explore Now'
}
```

### Welcome Message
```typescript
{
  id: 'welcome-new-users',
  enabled: true,
  message: 'Welcome to TalkAI! Need help getting started?',
  type: 'info',
  delay: 5000,
  autoHide: true,
  autoHideDelay: 8000,
  showLink: true,
  href: '/faq',
  linkText: 'View FAQ'
}
```

## Best Practices

### 1. Banner Priority
Only the **first enabled banner** in the array will be shown. Order them by priority.

### 2. Unique IDs
Always use unique, descriptive IDs like `'beta-launch-2024'` or `'maintenance-jan-15'`.

### 3. Clear Messages
Keep messages concise and action-oriented. Use emojis to grab attention.

### 4. Timing
- Use 3-5 second delays for important announcements
- Use longer delays (5-7 seconds) for less critical info
- Consider auto-hide for welcome messages or tips

### 5. Dismissal Persistence
- Keep `persistDismissal: true` for announcements (user won't see again)
- Set to `false` for time-sensitive messages that should reappear

## Resetting Dismissed Banners

If you need users to see a dismissed banner again, change the banner's `id` in the config.

## Development

To test banners during development:
1. Set `enabled: true` in config
2. Set a short `delay` (e.g., 1000ms)
3. Clear localStorage to reset dismissals:
   ```javascript
   localStorage.removeItem('banner-dismissed-your-banner-id')
   ```

## File Structure

```
lib/
  └── bannerConfig.ts         # Banner configuration
components/
  ├── NotificationBanner.tsx  # Main banner component
  └── BannerSpacer.tsx       # Spacing component
app/
  └── layout.tsx             # Integration point
```

## Customization

### Styling
Edit the `getStyles()` function in `NotificationBanner.tsx` to customize colors.

### Animation
Modify the CSS classes in the component for different animations.

### Position
The banner is fixed at `top-0` - adjust if needed for your layout.

## Managing Links

### Enable/Disable Links
Simply toggle the `showLink` property:

```typescript
// Link visible
{
  showLink: true,
  href: '/dashboard',
  linkText: 'Try Now'
}

// Link hidden (but href can stay)
{
  showLink: false,
  href: '/dashboard',
  linkText: 'Try Now'
}
```

This makes it easy to toggle links on/off without removing the URL!

---

That's it! Your notification banner system is ready to use. Just edit the config file to manage your banners. 🎉 