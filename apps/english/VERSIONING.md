# Versioning Guide

This project follows [Semantic Versioning](https://semver.org/) and uses [Conventional Commits](https://www.conventionalcommits.org/) for automated releases.

## Semantic Versioning

We use semantic versioning with the format `MAJOR.MINOR.PATCH`:

- **MAJOR**: Incompatible API changes
- **MINOR**: New functionality in a backwards compatible manner
- **PATCH**: Backwards compatible bug fixes

## Conventional Commits

All commits must follow the Conventional Commits specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Commit Types

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **perf**: A code change that improves performance
- **test**: Adding missing tests or correcting existing tests
- **build**: Changes that affect the build system or external dependencies
- **ci**: Changes to our CI configuration files and scripts
- **chore**: Other changes that don't modify src or test files
- **revert**: Reverts a previous commit

### Examples

```bash
feat: add session resumption functionality
fix: resolve dashboard session visibility issue
docs: update API documentation for voice endpoints
style: format code according to prettier rules
refactor: extract session management logic into separate service
perf: optimize database queries for dashboard analytics
test: add unit tests for voice configuration
build: update dependencies to latest versions
ci: add automated release workflow
chore: update package.json metadata
```

### Scopes

Use scopes to specify the area of the codebase:

- **auth**: Authentication and authorization
- **dashboard**: Dashboard functionality
- **voice**: Voice/audio features
- **api**: API endpoints
- **db**: Database changes
- **ui**: User interface components
- **admin**: Admin panel features

### Breaking Changes

For breaking changes, add `BREAKING CHANGE:` in the footer or use `!` after the type:

```bash
feat!: redesign voice configuration API
feat(api)!: change user authentication flow

BREAKING CHANGE: The voice configuration API now requires authentication
```

## Automated Releases

Releases are automatically created when code is merged to the `main` branch:

1. **Commits are analyzed** using conventional commit format
2. **Version is determined** based on commit types:
   - `fix:` → PATCH release
   - `feat:` → MINOR release
   - `BREAKING CHANGE:` → MAJOR release
3. **Changelog is generated** automatically
4. **Git tag is created** with the new version
5. **GitHub release is published** with release notes

## Development Workflow

### 1. Making Commits

Use the interactive commit tool:

```bash
npm run commit
```

Or commit manually following the convention:

```bash
git commit -m "feat(voice): add new therapeutic voice options"
```

### 2. Creating Pull Requests

- Create feature branches from `main`
- Use conventional commit messages
- PR titles should also follow conventional format
- All commits will be squashed on merge

### 3. Generating Changelog

Update the changelog manually if needed:

```bash
npm run changelog
```

## Branch Strategy

- **main**: Production-ready code, triggers releases
- **develop**: Pre-release branch (optional)
- **feature/\***: Feature development branches
- **fix/\***: Bug fix branches
- **hotfix/\***: Critical production fixes

## Release Process

1. **Develop features** in feature branches
2. **Create pull requests** to main
3. **Review and merge** PRs
4. **Automatic release** triggered on main branch
5. **Deploy to production** (manual or automated)

## Version History

- **1.0.0**: Initial release with core functionality
- **Future versions**: Will be automatically generated

For detailed changes, see [CHANGELOG.md](./CHANGELOG.md).
