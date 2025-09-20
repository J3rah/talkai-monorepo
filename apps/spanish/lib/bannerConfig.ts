// Banner configuration
// You can easily enable/disable banners and customize their content here

export interface BannerConfig {
  id: string;
  enabled: boolean;
  message: string;
  type: 'info' | 'warning' | 'success' | 'announcement';
  delay?: number;
  autoHide?: boolean;
  autoHideDelay?: number;
  persistDismissal?: boolean;
  showLink?: boolean;
  href?: string;
  linkText?: string;
}

export const bannerConfigs: BannerConfig[] = [
  // Beta Launch Banner
  {
    id: 'beta-launch-2024',
    enabled: false, // Set to false to disable this banner
    message: '🚀 We\'ve launched! 🐻 with us as we work out the kinks. Confetti and good vibes ahead! 🎉 ✨',
    type: 'announcement',
    delay: 5000, // Show after 4 seconds
    autoHide: true,
    autoHideDelay: 20000  ,
    persistDismissal: false,
    showLink: false, // Set to true to show the link
    href: '/',
    linkText: 'Try Beta Now'
  },
  
  // Maintenance Notice (example - disabled by default)
  {
    id: 'maintenance-notice',
    enabled: false,
    message: '⚠️ Scheduled maintenance on Sunday 2 AM - 4 AM EST. Some features may be temporarily unavailable.',
    type: 'warning',
    delay: 3000,
    autoHide: false,
    persistDismissal: true,
    showLink: false,
  },
  
  // Success Message (example - disabled by default)
  {
    id: 'new-feature-release',
    enabled: false,
    message: '✨ New voice settings are now available! Customize your AI companion\'s voice.',
    type: 'success',
    delay: 3500,
    autoHide: false,
    persistDismissal: true,
    showLink: true,
    href: '/dashboard',
    linkText: 'Explore Now'
  },
  
  // General Info Banner (example - disabled by default)
  {
    id: 'welcome-info',
    enabled: false,
    message: 'Welcome to TalkAI! Need help getting started? Check out our FAQ section.',
    type: 'info',
    delay: 5000,
    autoHide: true,
    autoHideDelay: 8000,
    persistDismissal: true,
    showLink: true,
    href: '/faq',
    linkText: 'View FAQ'
  }
];

// Get the first enabled banner
export const getActiveBanner = (): BannerConfig | null => {
  return bannerConfigs.find(banner => banner.enabled) || null;
}; 