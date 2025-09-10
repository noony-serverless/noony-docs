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

## Quick Start

Here's a simple JWT authentication example:

```typescript
import { Handler } from '@noony/core';
import { jwtMiddleware } from '@noony/auth';

const handler = new Handler()
  .use(jwtMiddleware({
    secret: process.env.JWT_SECRET,
    algorithms: ['HS256']
  }))
  .handle(async (context) => {
    // context.user is now available with decoded JWT data
    const { userId, email } = context.user;
    
    return {
      statusCode: 200,
      body: JSON.stringify({ 
        message: `Welcome, ${email}!`,
        userId 
      })
    };
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
