---
title: Route Guards Complete Guide
description: Comprehensive guide to implementing authentication and authorization with RouteGuards
sidebar_position: 2
---

# RouteGuards Complete Guide

The **Noony Guard System** is a high-performance authentication and authorization middleware designed for serverless environments. It provides sub-millisecond cached permission checks with three distinct resolution strategies, conservative cache invalidation, and comprehensive monitoring capabilities.

## 🚀 Key Features

- **Sub-millisecond Performance**: Cached permission checks in &lt;1ms
- **Three Resolution Strategies**: Plain (O(1)), Wildcard, and Expression-based permissions
- **Multi-layer Caching**: L1 memory + configurable L2 with intelligent invalidation
- **Conservative Security**: Security-first cache invalidation strategies
- **Framework Agnostic**: Works with Express, Fastify, Google Cloud Functions, and more
- **Production Ready**: Comprehensive monitoring, audit trails, and error handling
- **TypeScript Native**: Full type safety and IntelliSense support

## Quick Start

### Basic Setup with CustomTokenVerificationPort

The fastest way to get started with RouteGuards using the new integrated authentication system:

```typescript
import { RouteGuards, GuardSetup } from '@/middlewares/guards';
import { CustomTokenVerificationPort } from '@/middlewares/authenticationMiddleware';

// 1. Define your user type
interface User {
  id: string;
  email: string;
  roles: string[];
  permissions: string[];
  sub: string;  // JWT subject
  exp: number;  // JWT expiration
}

// 2. Create token verifier (works with both systems!)
const tokenVerifier: CustomTokenVerificationPort<User> = {
  async verifyToken(token: string): Promise<User> {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as any;
    return {
      id: payload.sub,
      email: payload.email,
      roles: payload.roles || [],
      permissions: payload.permissions || [],
      sub: payload.sub,
      exp: payload.exp
    };
  }
};

// 3. Define permission source
const userPermissionSource = {
  async getUserPermissions(userId: string) {
    const user = await userService.getUser(userId);
    return {
      userId,
      permissions: user.permissions,
      roles: user.roles,
      metadata: { email: user.email, status: user.status }
    };
  }
};

// 4. One-line configuration (NEW!)
await RouteGuards.configureWithJWT(
  GuardSetup.production(),
  userPermissionSource,
  tokenVerifier,
  {
    tokenHeader: 'authorization',
    tokenPrefix: 'Bearer ',
    requireEmailVerification: true
  }
);

// 5. Use in handlers
const handler = new Handler()
  .use(RouteGuards.requirePermissions(['user:read']))
  .handle(async (context) => {
    const user = context.user!; // Fully typed!
    return { profile: user };
  });
```

## Architecture Overview

The Noony Guard System follows a modular architecture designed for high performance and security:

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   RouteGuards   │────│  FastAuthGuard   │────│ TokenValidator  │
│    (Facade)     │    │ (Authentication) │    │  (JWT Verify)   │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                        │
         ▼                        ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│PermissionGuard  │────│FastUserContext   │────│UserPermission   │
│    Factory      │    │     Service      │    │     Source      │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                        │
         ▼                        ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Resolvers:    │    │   CacheAdapter   │    │PermissionRegistry│
│ Plain/Wildcard/ │    │ (Memory/Redis)   │    │  (Optional)     │
│   Expression    │    │                  │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### Design Principles

- **Single Responsibility**: Each component has a focused purpose
- **Strategy Pattern**: Pluggable permission resolution strategies
- **Facade Pattern**: Simple API hiding complex orchestration
- **Cache-First**: Aggressive caching with security-conscious invalidation
- **Performance Oriented**: Sub-millisecond response times for cached operations

## Core Components

### 1. RouteGuards (Facade)

The main entry point providing a clean, NestJS-inspired API for protecting routes.

**Key Responsibilities:**
- Orchestrates all guard components
- Provides fluent API for middleware creation
- Manages system-wide configuration and statistics
- Handles service dependency injection

### 2. FastAuthGuard

High-performance authentication with multi-layer caching.

**Key Features:**
- JWT token validation with caching
- User context loading and caching
- Multi-layer cache strategy (L1 memory + L2 distributed)
- Token blocking and security events
- Performance tracking and audit logging

### 3. PermissionGuardFactory

Factory for creating optimized permission guards tailored to specific requirements.

### 4. FastUserContextService

User context management with configurable permission resolution.

### 5. GuardConfiguration

Environment-specific configuration management.

## Permission Resolution Strategies

The Noony Guard System provides three distinct strategies, each optimized for different use cases:

### 1. Plain Permissions (Fastest - O(1))

**Use Cases:**
- High-traffic API endpoints
- Simple permission models
- Sub-millisecond requirements

**Performance:** ~0.1ms cached, ~1-2ms uncached

**Example:**
`RouteGuards.requirePermissions(['user:create', 'admin:users'])`

### 2. Wildcard Permissions (Pattern Matching)

**Use Cases:**
- Role-based hierarchical permissions
- Administrative operations

**Performance:** ~0.2ms cached (pre-expansion), ~2-5ms cached (on-demand)

**Example:**
`RouteGuards.requireWildcardPermissions(['admin.*', 'user.profile.*'])`

### 3. Expression Permissions (Boolean Logic)

**Use Cases:**
- Complex business rules
- Fine-grained access control

**Performance:** ~0.5ms cached, ~5-15ms uncached

**Example:**
`RouteGuards.requireComplexPermissions({ or: [ ... ] })`

## Authentication System

The authentication system provides high-performance JWT validation with comprehensive caching and security features.

### Authentication Methods Comparison

| Authentication Method | Security Level | Implementation Complexity | Performance | Use Cases | Header Format |
|---|---|---|---|---|---|
| **JWT** | High | Medium | High (cached) | Web apps, SPAs, mobile apps | `Authorization: Bearer <jwt>` |
| **Basic Auth** | Low-Medium | Low | Medium | Internal APIs, dev environments | `Authorization: Basic <base64>` |
| **API Keys** | Medium-High | Low | High (cached) | Service-to-service, third-party | `x-api-key: <key>` |
| **OAuth** | High | High | Medium | Third-party integrations | `Authorization: Bearer <token>` |
| **Custom** | Variable | High | Variable | Special requirements | `<custom-header>: <token>` |

## Configuration & Setup

### Environment Profiles

The guard system supports different configuration profiles optimized for specific environments:

- **`GuardConfiguration.development()`**: For local development, with detailed logging and less caching.
- **`GuardConfiguration.production()`**: For production, with maximum performance and security.
- **`GuardConfiguration.serverless()`**: Optimized for serverless environments with cold starts.

### Complete Setup Example

```typescript
import { RouteGuards, GuardConfiguration } from '@noony-serverless/core';

// 1. Define your token validator
class MyTokenValidator implements TokenValidator { ... }

// 2. Define your permission source
class DatabasePermissionSource implements UserPermissionSource { ... }

// 3. Configure the guard system
await RouteGuards.configure(
  GuardConfiguration.production(),
  new DatabasePermissionSource(),
  new MyTokenValidator(),
  { /* AuthGuardConfig */ }
);
```

## API Reference

### `RouteGuards.configure()`
Configure the guard system with environment-specific settings.

### `RouteGuards.requirePermissions()`
Create middleware for simple permission list checks (fastest).

### `RouteGuards.requireWildcardPermissions()`
Create middleware for wildcard permission pattern checks.

### `RouteGuards.requireComplexPermissions()`
Create middleware for complex boolean expression checks.

### `RouteGuards.requireAuth()`
Get authentication-only middleware without permission checking.

### `RouteGuards.invalidateUserPermissions()`
Invalidate user permissions cache when permissions change.

### `RouteGuards.getSystemStats()`
Get comprehensive system statistics and performance metrics.

## Security Considerations

### Conservative Cache Invalidation
The system uses a "security-first" approach to caching that prioritizes security over performance.

### Authentication Security
- Multi-layer token validation
- Token signature, expiration, and status checks
- Token blocking for compromised tokens

### Permission Model Security
- Enforces Principle of Least Privilege
- Validates role hierarchies to prevent escalation

### Audit Logging and Compliance
- Comprehensive audit trail for all security events
- Privacy-aware logging for GDPR and other compliance needs