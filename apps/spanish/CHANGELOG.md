# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial release setup with semantic versioning
- Automated release workflow
- Conventional commit standards

## [1.0.0] - 2025-06-14

### Added
- TalkAI1 agent implementation with comprehensive agent management system
- Session resumption functionality for Hume EVI voice chat
- Premium subscription system with Stripe integration
- Comprehensive dashboard with session analytics and emotion tracking
- Multi-tier subscription plans (Free, Standard, Premium)
- Data saving preferences and GDPR compliance features
- Audio session reconstruction for Premium users
- Voice configuration system with multiple therapeutic voice options
- Session management with resume/continue functionality
- Admin panel for user and system management

### Fixed
- Session visibility issues in dashboard Recent Sessions
- Resume Session button tombstoning/disabled state
- Subscription upgrade errors when transitioning between plans
- WebSocket connection issues during session resumption
- Database query timeouts and error handling
- Authentication state management across components

### Security
- Enhanced RLS (Row Level Security) policies for data protection
- Secure API endpoints with proper authentication
- Environment variable protection and validation
- Session data encryption and privacy controls

[Unreleased]: https://github.com/J3rah/empathic-voice-1/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/J3rah/empathic-voice-1/releases/tag/v1.0.0
