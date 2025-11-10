# Noony Guard System - Complete Guide

**High-performance authentication and authorization with sub-millisecond cached permission checks**

## Overview

The Noony Guard System provides enterprise-grade authentication and authorization with three distinct permission resolution strategies, multi-layer caching, and comprehensive monitoring.

### Key Features

- **⚡ Sub-millisecond Performance**: Cached permission checks in &lt;1ms
- **🎯 Three Resolution Strategies**: Plain (O(1)), Wildcard, and Expression-based permissions
- **💾 Multi-layer Caching**: L1 memory + configurable L2 with intelligent invalidation
- **🔒 Security-First**: Conservative cache invalidation strategies
- **🌐 Framework Agnostic**: Works with Express, Fastify, Google Cloud Functions
- **📊 Production Ready**: Comprehensive monitoring, audit trails, error handling
- **🔥 TypeScript Native**: Full type safety with generics

## Quick Start

### Basic Authentication Only

```typescript
import { Handler, Context, RouteGuards } from '@noony-serverless/core';

interface CreateOrderRequest {
  productId: string;
  quantity: number;
}

interface AuthUser {
  id: string;
  email: string;
  role: 'user' | 'admin';
}

// Require authentication only (no permission checks)
const handler = new Handler<CreateOrderRequest, AuthUser>()
  .use(RouteGuards.requireAuth<CreateOrderRequest, AuthUser>())
  .handle(async (context: Context<CreateOrderRequest, AuthUser>) => {
    const user = context.user!; // Type: AuthUser
    // User is authenticated!
  });
```

### Plain Permissions (Fastest - O(1))

```typescript
// Require specific permissions
const handler = new Handler<CreateUserRequest, AuthUser>()
  .use(RouteGuards.requirePermissions<CreateUserRequest, AuthUser>([
    'user:create',
    'admin:users'
  ]))
  .handle(async (context: Context<CreateUserRequest, AuthUser>) => {
    // User has at least ONE of the required permissions
    const user = context.user!;
  });
```

### Wildcard Permissions (Pattern Matching)

```typescript
// Match hierarchical permission patterns
const handler = new Handler<GetUserRequest, AuthUser>()
  .use(RouteGuards.requireWildcardPermissions<GetUserRequest, AuthUser>([
    'admin.*',           // Matches: admin.users, admin.reports, etc.
    'user.profile.*'     // Matches: user.profile.read, user.profile.update
  ]))
  .handle(async (context: Context<GetUserRequest, AuthUser>) => {
    // User has permissions matching at least ONE wildcard pattern
  });
```

### Complex Expression Permissions

```typescript
// Boolean logic with AND, OR, NOT
const handler = new Handler<ListUsersRequest, AuthUser>()
  .use(RouteGuards.requireComplexPermissions<ListUsersRequest, AuthUser>({
    or: [
      { and: [
        { permission: 'admin.users' },
        { permission: 'admin.read' }
      ]},
      { and: [
        { permission: 'user.list' },
        { permission: 'user.department' }
      ]}
    ]
  }))
  .handle(async (context: Context<ListUsersRequest, AuthUser>) => {
    // User satisfies the complex permission expression
  });
```

## Architecture

### System Components

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
┌─────────────────┐    ┌──────────────────┐
│   Resolvers:    │    │   CacheAdapter   │
│ Plain/Wildcard/ │    │ (Memory/Redis)   │
│   Expression    │    │                  │
└─────────────────┘    └──────────────────┘
```

## Configuration & Setup

### Complete System Setup

```typescript
import {
  RouteGuards,
  GuardConfiguration,
  TokenValidator,
  UserPermissionSource
} from '@noony-serverless/core';

// 1. Define your token validator
class MyTokenValidator implements TokenValidator {
  async validateToken(token: string) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!);
      return {
        valid: true,
        decoded
      };
    } catch (error) {
      return {
        valid: false,
        error: error.message
      };
    }
  }

  extractUserId(decoded: any): string {
    return decoded.sub || decoded.userId;
  }

  isTokenExpired(decoded: any): boolean {
    return decoded.exp && decoded.exp < Date.now() / 1000;
  }
}

// 2. Define your permission source
class MyPermissionSource implements UserPermissionSource {
  async getUserPermissions(userId: string) {
    const user = await userRepository.findById(userId);
    if (!user) return null;

    return {
      permissions: user.permissions,
      roles: user.roles,
      metadata: {
        tenantId: user.tenantId,
        department: user.department
      }
    };
  }

  async getRolePermissions(roles: string[]) {
    const rolePerms = await roleRepository.getPermissions(roles);
    return rolePerms.flat();
  }

  async isUserContextStale(userId: string, lastUpdated: string): Promise<boolean> {
    const user = await userRepository.findById(userId);
    return user.updatedAt > new Date(lastUpdated);
  }
}

// 3. Configure the guard system
RouteGuards.configure({
  tokenValidator: new MyTokenValidator(),
  permissionSource: new MyPermissionSource(),
  config: GuardConfiguration.production(), // or .development()
});
```

### Environment Profiles

#### Production Configuration

```typescript
const prodConfig = GuardConfiguration.production();
// - Strategy: Pre-expansion (maximum runtime performance)
// - Cache TTL: 15 minutes
// - Cache Size: 2000 entries
// - Invalidation: Conservative (security-first)
// - Monitoring: Essential metrics only
```

#### Development Configuration

```typescript
const devConfig = GuardConfiguration.development();
// - Strategy: On-demand matching (memory efficient)
// - Cache TTL: 5 minutes
// - Cache Size: 500 entries
// - Invalidation: Less conservative
// - Monitoring: Detailed logging
```

## Permission Resolution Strategies

### 1. Plain Permissions (O(1) - Fastest)

**Best For:**
- High-traffic API endpoints
- Simple permission models
- Sub-millisecond requirements
- Performance-critical paths

**Performance:** ~0.1ms cached, ~1-2ms uncached

**Example:**

```typescript
const handler = new Handler<CreateUserRequest, AuthUser>()
  .use(new ErrorHandlerMiddleware<CreateUserRequest, AuthUser>())
  .use(RouteGuards.requirePermissions<CreateUserRequest, AuthUser>([
    'user:create',
    'admin:users'
  ]))
  .use(new BodyValidationMiddleware<CreateUserRequest, AuthUser>(schema))
  .use(new ResponseWrapperMiddleware<CreateUserRequest, AuthUser>())
  .handle(async (context: Context<CreateUserRequest, AuthUser>) => {
    // User has at least ONE of: user:create OR admin:users
    const user = context.user!;
    const newUser = await userService.create(context.req.validatedBody!);
    context.res.status(201).json({ user: newUser });
  });
```

**How it Works:**
- Uses JavaScript Set for O(1) membership testing
- Checks if user has ANY of the required permissions (OR logic)
- Direct set membership: `userPermissions.has(requiredPermission)`

### 2. Wildcard Permissions (Pattern Matching)

**Best For:**
- Role-based hierarchical permissions
- Administrative operations
- Department-based access control
- Organizational hierarchies

**Performance:** ~0.2ms cached (pre-expansion), ~2-5ms cached (on-demand)

**Example:**

```typescript
const handler = new Handler<GetUserRequest, AuthUser>()
  .use(new ErrorHandlerMiddleware<GetUserRequest, AuthUser>())
  .use(RouteGuards.requireWildcardPermissions<GetUserRequest, AuthUser>([
    'admin.*',         // Matches: admin.users, admin.reports, admin.settings
    'user.profile.*'   // Matches: user.profile.read, user.profile.update
  ]))
  .use(new ResponseWrapperMiddleware<GetUserRequest, AuthUser>())
  .handle(async (context: Context<GetUserRequest, AuthUser>) => {
    const { userId } = context.req.params;
    const user = await userService.findById(userId);
    context.res.json({ user });
  });
```

**Pattern Examples:**

```typescript
'admin.*'           // Matches: admin.users, admin.reports, admin.settings
'user.profile.*'    // Matches: user.profile.read, user.profile.update
'org.department.*'  // Matches: org.department.view, org.department.manage
'system.users.*'    // Matches: system.users.create, system.users.delete
```

### 3. Expression Permissions (Boolean Logic)

**Best For:**
- Complex business rules
- Fine-grained access control
- Conditional permissions
- Advanced authorization scenarios

**Performance:** ~0.5ms cached, ~5-15ms uncached (depends on complexity)

**Example:**

```typescript
const handler = new Handler<ListUsersRequest, AuthUser>()
  .use(new ErrorHandlerMiddleware<ListUsersRequest, AuthUser>())
  .use(RouteGuards.requireComplexPermissions<ListUsersRequest, AuthUser>({
    or: [
      { and: [
        { permission: 'admin.users' },
        { permission: 'admin.read' }
      ]},
      { and: [
        { permission: 'user.list' },
        { permission: 'user.department' }
      ]}
    ]
  }))
  .use(new QueryParametersMiddleware<ListUsersRequest, AuthUser>(schema))
  .use(new ResponseWrapperMiddleware<ListUsersRequest, AuthUser>())
  .handle(async (context: Context<ListUsersRequest, AuthUser>) => {
    const { page, limit, department } = context.req.query;
    const users = await userService.list({ page, limit, department });
    context.res.json({ users });
  });
```

**Expression Structure:**

```typescript
interface PermissionExpression {
  and?: PermissionExpression[];  // All must be true
  or?: PermissionExpression[];   // At least one must be true
  not?: PermissionExpression;    // Must be false
  permission?: string;           // Leaf permission to check
}
```

**Complex Examples:**

```typescript
// Admin OR (Moderator AND Department Access)
{
  or: [
    { permission: 'admin.full' },
    { and: [
      { permission: 'moderator.content' },
      { permission: 'department.reports' }
    ]}
  ]
}

// NOT expression example
{
  and: [
    { permission: 'user.read' },
    { not: { permission: 'user.restricted' } }
  ]
}
```

## Multi-layer Caching

### Cache Architecture

**Layer 1 - Memory Cache:**
- LRU-based caching
- Configurable TTL
- Per-process isolated

**Layer 2 - Distributed Cache (Optional):**
- Redis or custom adapter
- Shared across instances
- Cluster-wide invalidation

### Cache Keys

```typescript
// Authentication results
'auth:token:{tokenHash}' // TTL: 5 minutes

// User context
'user:context:{userId}' // TTL: 10 minutes

// Permission checks
'perm:{resolverType}:{userId}:{permHash}' // TTL: 15 minutes
```

### Conservative Invalidation

**Security-First Approach:**
- Permission changes flush ALL related caches
- Immediate revocation capabilities
- Audit trail for all invalidations

```typescript
// Invalidate user permissions
await RouteGuards.invalidateUserPermissions(userId, 'Role change');

// Emergency system-wide invalidation
await RouteGuards.emergencyInvalidation('Security breach detected');

// Block compromised token
await authGuard.blockToken(token, 'Security incident #1234');
```

## Performance Characteristics

| Strategy | Cached | Uncached | Memory | Use Case |
|----------|--------|----------|--------|----------|
| Plain | ~0.1ms | ~1-2ms | Low | High-traffic APIs |
| Wildcard | ~0.2ms | ~2-5ms | Medium | Hierarchical perms |
| Expression | ~0.5ms | ~5-15ms | Medium | Complex rules |

## Best Practices

### 1. Choose the Right Strategy

```typescript
// ✅ Use Plain for simple, high-traffic endpoints
RouteGuards.requirePermissions(['user:create'])

// ✅ Use Wildcard for hierarchical permissions
RouteGuards.requireWildcardPermissions(['admin.*'])

// ✅ Use Expression for complex business rules
RouteGuards.requireComplexPermissions({ or: [...] })
```

### 2. Middleware Order

```typescript
// ✅ Correct order
const handler = new Handler<RequestType, UserType>()
  .use(new ErrorHandlerMiddleware<RequestType, UserType>())    // 1. Error handling
  .use(RouteGuards.requirePermissions<RequestType, UserType>())// 2. Auth & permissions
  .use(new BodyValidationMiddleware<RequestType, UserType>())  // 3. Validation
  .use(new ResponseWrapperMiddleware<RequestType, UserType>()) // 4. Response
  .handle(async (context: Context<RequestType, UserType>) => {
    // Business logic
  });
```

### 3. Type Safety

```typescript
// ✅ Always use full generics
const handler = new Handler<CreateUserRequest, AuthUser>()
  .use(RouteGuards.requirePermissions<CreateUserRequest, AuthUser>([
    'user:create'
  ]))
  .handle(async (context: Context<CreateUserRequest, AuthUser>) => {
    const user = context.user!; // Type: AuthUser
  });
```

## Related Documentation

- **[Authentication Guide](../authentication/index.md)** - Authentication patterns
- **[Middleware Guide](../middlewares/index.md)** - Middleware documentation
- **[Components Reference](./components-reference.md)** - Complete API reference
- **[OpenTelemetry Integration](./opentelemetry-integration.md)** - Distributed tracing
