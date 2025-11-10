---
title: Authentication & Security
description: Secure your applications with JWT, OAuth, API keys, and route guards
sidebar_position: 1
---

# Authentication & Security

Secure your Noony applications with robust authentication and authorization systems.

## Route Guards

Flexible authentication and authorization middleware:

- **[Getting Started](/docs/authentication/RouteGuards-Getting-Started)** - Quick authentication setup
- **[Route Guards Setup](/docs/authentication/RouteGuards-Complete-Guide)** - Complete configuration guide
- **[Multi-Auth Examples](/docs/authentication/RouteGuards-Multi-Auth-Examples)** - Support multiple auth methods

## Authentication Methods

Support for various authentication strategies:

- **JWT Tokens** - Stateless token-based authentication
- **API Keys** - Simple API key validation
- **OAuth** - Social login and OAuth flows
- **Basic Auth** - Username/password authentication
- **Custom Auth** - Build your own authentication logic

## Token Validation

Advanced token processing:

- **[Token Validation](/docs/authentication/TokenValidatorFactory-AuthenticationMiddleware-Integration)** - TokenValidatorFactory integration
- **JWT verification** - Validate and decode JWT tokens
- **Token refresh** - Handle token renewal
- **Blacklisting** - Revoke compromised tokens

## Type-Safe Authentication with Generics

All authentication components support TypeScript generics for complete type safety:

```typescript
import { Handler, Context } from '@noony-serverless/core';
import { AuthenticationMiddleware, TokenVerifier } from '@noony-serverless/core';

// Define your user type
interface AuthenticatedUser {
  id: string;
  email: string;
  role: 'user' | 'admin';
  permissions: string[];
}

// Define your request type
interface CreateResourceRequest {
  name: string;
  description: string;
}

// Create token verifier
const tokenVerifier: TokenVerifier<AuthenticatedUser> = {
  async verifyToken(token: string): Promise<AuthenticatedUser> {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    return {
      id: decoded.sub,
      email: decoded.email,
      role: decoded.role,
      permissions: decoded.permissions || []
    };
  }
};

// Use with full generics
const handler = new Handler<CreateResourceRequest, AuthenticatedUser>()
  .use(new AuthenticationMiddleware<CreateResourceRequest, AuthenticatedUser>(tokenVerifier))
  .handle(async (context: Context<CreateResourceRequest, AuthenticatedUser>) => {
    // context.user is fully typed!
    const user = context.user!; // Type: AuthenticatedUser
    const { email, role, permissions } = user;

    // Fully typed business logic
    if (!permissions.includes('resource:create')) {
      throw new SecurityError('Insufficient permissions');
    }

    context.res.json({
      message: `Welcome, ${email}!`,
      role
    });
  });
```

## Security Best Practices

Essential security practices for production applications:

- **HTTPS enforcement** - Always use secure connections
- **Token expiration** - Set appropriate token lifetimes
- **Rate limiting** - Prevent abuse and attacks
- **Input validation** - Validate all incoming data
- **Error handling** - Don't leak sensitive information

## Authorization Patterns

Beyond authentication - controlling access:

- **Role-based access** - Different permissions for different users
- **Resource-based access** - Permissions on specific resources
- **Hierarchical permissions** - Nested permission structures
- **Dynamic permissions** - Runtime permission evaluation

## Multi-Authentication

Support multiple authentication methods in a single application:

```typescript
const handler = new Handler()
  .use(multiAuthMiddleware([
    jwtAuth({ secret: JWT_SECRET }),
    apiKeyAuth({ keys: API_KEYS }),
    basicAuth({ users: USER_DB })
  ]))
  .handle(async (context) => {
    // context.user contains the authenticated user
    // regardless of which auth method was used
  });
```

## Production Considerations

Important considerations for production deployments:

- **Secret management** - Secure storage of keys and secrets
- **Token rotation** - Regular key rotation strategies
- **Monitoring** - Track authentication failures and anomalies
- **Compliance** - Meet regulatory requirements (GDPR, SOC2, etc.)

Ready to secure your application? Start with our getting started guide!
