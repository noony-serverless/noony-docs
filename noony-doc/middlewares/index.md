---
title: Middlewares
description: Built-in middleware for request processing, validation, authentication, and more
sidebar_position: 1
---

# Middlewares

Explore Noony's powerful middleware system with full TypeScript generic support for type-safe request processing, validation, authentication, and more.

## Type-Safe Middleware with Generics

All Noony middlewares support TypeScript generics for complete type safety:

```typescript
import { Handler, Context, BaseMiddleware } from '@noony-serverless/core';

// Define your types
interface CreateUserRequest {
  name: string;
  email: string;
  age: number;
}

interface AuthenticatedUser {
  id: string;
  email: string;
  role: 'user' | 'admin';
}

// Use generics throughout the middleware chain
const handler = new Handler<CreateUserRequest, AuthenticatedUser>()
  .use(new ErrorHandlerMiddleware<CreateUserRequest, AuthenticatedUser>())
  .use(new AuthenticationMiddleware<CreateUserRequest, AuthenticatedUser>(verifier))
  .use(new BodyValidationMiddleware<CreateUserRequest, AuthenticatedUser>(schema))
  .handle(async (context: Context<CreateUserRequest, AuthenticatedUser>) => {
    const data = context.req.validatedBody!; // Type: CreateUserRequest
    const user = context.user!; // Type: AuthenticatedUser
    // Fully typed business logic
  });
```

## Request Processing

Essential middleware for handling HTTP requests:

- **[Body Parser](./BodyParserMiddleware-Guide)** - Parse request bodies (JSON, form data, Pub/Sub messages)
- **[Body Validation](./BodyValidationMiddleware-Guide)** - Schema validation with Zod and full type inference
- **[HTTP Attributes](./httpAttributesMiddleware)** - Extract headers, query params, and paths

## Authentication & Authorization

Secure your endpoints with authentication and permission checks:

- **[Authentication Middleware](../authentication/TokenValidatorFactory-AuthenticationMiddleware-Integration)** - JWT token verification with generic user types
- **[Route Guards](../authentication/RouteGuards-Getting-Started)** - Permission-based access control
- **[Route Guards Complete Guide](../authentication/RouteGuards-Complete-Guide)** - Advanced guard patterns
- **[Multi-Auth Examples](../authentication/RouteGuards-Multi-Auth-Examples)** - Multiple authentication strategies

## Data Handling

Middleware for processing and validating request data:

- **[Header Variables](./headerVariablesMiddleware)** - Validate and extract HTTP headers
- **[Query Parameters](./queryParametersMiddleware)** - Handle URL query parameters with validation
- **[Dependency Injection](./DependencyInjectionMiddleware-Guide)** - Inject services and dependencies

## Error Management

Robust error handling middleware:

- **[Error Handler](./errorHandlerMiddleware)** - Graceful error processing with typed error responses
- **Global error catching** - Automatic error boundary
- **Custom error responses** - Formatted error messages

## Response Handling

Standardize and transform responses:

- **ResponseWrapperMiddleware** - Wrap responses in consistent format
- **Response transformation** - Modify response data
- **Status code management** - Set appropriate HTTP status codes

## Observability & Monitoring

Track and monitor your application:

- **[OpenTelemetry Integration](../advanced/opentelemetry-integration)** - Distributed tracing with W3C Trace Context
- **Performance monitoring** - Track request durations
- **Audit logging** - Security event tracking

## Security Middlewares

Protect your application:

- **SecurityHeadersMiddleware** - Add security headers (CSP, CORS, etc.)
- **RateLimitingMiddleware** - Rate limiting with sliding window
- **SecurityAuditMiddleware** - Security event logging

## Integration & Advanced

Advanced middleware patterns:

- **[Integration Guide](./middleware-integration-guide)** - Combine multiple middleware
- **Custom middleware** - Build your own type-safe middleware
- **Performance optimization** - Optimize middleware chains

## Complete Middleware List

### Core Middlewares

| Middleware | Purpose | Generic Support |
|------------|---------|-----------------|
| `ErrorHandlerMiddleware<T, U>` | Global error handling | ✅ Full |
| `BodyParserMiddleware<T, U>` | Parse request bodies | ✅ Full |
| `BodyValidationMiddleware<T, U>` | Zod schema validation | ✅ Full |
| `ResponseWrapperMiddleware<T, U>` | Standardize responses | ✅ Full |

### Authentication & Authorization

| Middleware | Purpose | Generic Support |
|------------|---------|-----------------|
| `AuthenticationMiddleware<T, U>` | JWT token verification | ✅ Full |
| `RouteGuards.requirePermissions()` | Permission checks | ✅ Full |
| `RouteGuards.requireWildcardPermissions()` | Wildcard permissions | ✅ Full |
| `RouteGuards.requireComplexPermissions()` | Expression-based permissions | ✅ Full |

### Data Processing

| Middleware | Purpose | Generic Support |
|------------|---------|-----------------|
| `HeaderVariablesMiddleware<T, U>` | Validate headers | ✅ Full |
| `QueryParametersMiddleware<T, U>` | Process query params | ✅ Full |
| `PathParametersMiddleware<T, U>` | Extract path params | ✅ Full |
| `DependencyInjectionMiddleware<T, U>` | Service injection | ✅ Full |

### Security

| Middleware | Purpose | Generic Support |
|------------|---------|-----------------|
| `SecurityHeadersMiddleware<T, U>` | Security headers | ✅ Full |
| `RateLimitingMiddleware<T, U>` | Rate limiting | ✅ Full |
| `SecurityAuditMiddleware<T, U>` | Audit logging | ✅ Full |

### Observability

| Middleware | Purpose | Generic Support |
|------------|---------|-----------------|
| `OpenTelemetryMiddleware<T, U>` | Distributed tracing | ✅ Full |

## Quick Start with Generics

Here's how to use type-safe middleware in your handlers:

```typescript
import { Handler, Context } from '@noony-serverless/core';
import {
  ErrorHandlerMiddleware,
  BodyParserMiddleware,
  BodyValidationMiddleware,
  AuthenticationMiddleware,
  ResponseWrapperMiddleware
} from '@noony-serverless/core';
import { z } from 'zod';

// 1. Define your request schema
const createUserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  age: z.number().min(18)
});

// 2. Infer TypeScript types
type CreateUserRequest = z.infer<typeof createUserSchema>;

// 3. Define your user type
interface AuthUser {
  id: string;
  email: string;
  role: 'user' | 'admin';
}

// 4. Create handler with full generics
const handler = new Handler<CreateUserRequest, AuthUser>()
  .use(new ErrorHandlerMiddleware<CreateUserRequest, AuthUser>())
  .use(new AuthenticationMiddleware<CreateUserRequest, AuthUser>(tokenVerifier))
  .use(new BodyValidationMiddleware<CreateUserRequest, AuthUser>(createUserSchema))
  .use(new ResponseWrapperMiddleware<CreateUserRequest, AuthUser>())
  .handle(async (context: Context<CreateUserRequest, AuthUser>) => {
    // TypeScript knows exact types!
    const { name, email, age } = context.req.validatedBody!; // Type: CreateUserRequest
    const user = context.user!; // Type: AuthUser

    // Fully typed business logic
    const newUser = await userService.create({ name, email, age });
    context.res.json({ user: newUser });
  });
```

## Middleware Order Best Practices

The order of middleware matters! Follow this pattern for optimal results:

1. **ErrorHandlerMiddleware** - Always first to catch all errors
2. **SecurityHeadersMiddleware** - Add security headers early
3. **RateLimitingMiddleware** - Protect against abuse
4. **AuthenticationMiddleware** - Verify user identity
5. **BodyParserMiddleware** - Parse request body
6. **BodyValidationMiddleware** - Validate parsed data
7. **Custom business middleware** - Your domain logic
8. **ResponseWrapperMiddleware** - Always last to wrap responses

```typescript
// ✅ Correct order
const handler = new Handler<RequestType, UserType>()
  .use(new ErrorHandlerMiddleware<RequestType, UserType>())        // 1. First
  .use(new SecurityHeadersMiddleware<RequestType, UserType>())     // 2. Security
  .use(new RateLimitingMiddleware<RequestType, UserType>())        // 3. Rate limit
  .use(new AuthenticationMiddleware<RequestType, UserType>())      // 4. Auth
  .use(new BodyParserMiddleware<RequestType, UserType>())          // 5. Parse
  .use(new BodyValidationMiddleware<RequestType, UserType>())      // 6. Validate
  .use(new CustomBusinessMiddleware<RequestType, UserType>())      // 7. Business logic
  .use(new ResponseWrapperMiddleware<RequestType, UserType>())     // 8. Last
  .handle(async (context: Context<RequestType, UserType>) => {
    // Your handler logic
  });
```

## Creating Custom Type-Safe Middleware

Build your own middleware with full generic support:

```typescript
import { BaseMiddleware, Context } from '@noony-serverless/core';

// Custom middleware with generics
class LoggingMiddleware<T, U> implements BaseMiddleware<T, U> {
  async before(context: Context<T, U>): Promise<void> {
    console.log(`Request ${context.requestId} started`);
    console.log('User:', context.user); // Type: U | undefined
  }

  async after(context: Context<T, U>): Promise<void> {
    const duration = Date.now() - context.startTime;
    console.log(`Request ${context.requestId} completed in ${duration}ms`);
  }

  async onError(error: Error, context: Context<T, U>): Promise<void> {
    console.error(`Request ${context.requestId} failed:`, error.message);
  }
}

// Use with full type safety
const handler = new Handler<CreateUserRequest, AuthUser>()
  .use(new LoggingMiddleware<CreateUserRequest, AuthUser>())
  .handle(async (context: Context<CreateUserRequest, AuthUser>) => {
    // Fully typed context
  });
```

## Advanced Patterns

### Multi-Step Validation Pipeline

```typescript
// Complex validation with multiple middleware
const handler = new Handler<OrderRequest, BusinessUser>()
  .use(new ErrorHandlerMiddleware<OrderRequest, BusinessUser>())
  .use(new AuthenticationMiddleware<OrderRequest, BusinessUser>(verifier))
  .use(new BodyValidationMiddleware<OrderRequest, BusinessUser>(orderSchema))
  .use(new OrderValidationMiddleware<OrderRequest, BusinessUser>())
  .use(new InventoryCheckMiddleware<OrderRequest, BusinessUser>())
  .use(new PricingMiddleware<OrderRequest, BusinessUser>())
  .use(new ResponseWrapperMiddleware<OrderRequest, BusinessUser>())
  .handle(async (context: Context<OrderRequest, BusinessUser>) => {
    // All validations passed, create order
    const order = await orderService.create(context.req.validatedBody!);
    context.res.status(201).json({ order });
  });
```

### Conditional Middleware

```typescript
// Apply middleware conditionally
class ConditionalMiddleware<T, U> implements BaseMiddleware<T, U> {
  constructor(
    private condition: (context: Context<T, U>) => boolean,
    private middleware: BaseMiddleware<T, U>
  ) {}

  async before(context: Context<T, U>): Promise<void> {
    if (this.condition(context) && this.middleware.before) {
      await this.middleware.before(context);
    }
  }
}
```

## Performance Considerations

- **Middleware overhead**: Each middleware adds ~0.1-2ms
- **Caching**: Use guards with caching for repeated auth checks
- **Async operations**: Minimize in middleware before() hooks
- **Order optimization**: Place fastest middleware first

## Related Documentation

- **[Handler Complete Guide](../core-concepts/Handler-Complete-Guide)** - Deep dive into handlers
- **[Authentication Guide](../authentication/index.md)** - Authentication patterns
- **[OpenTelemetry Integration](../advanced/opentelemetry-integration)** - Distributed tracing
- **[API Reference](../advanced/api-reference)** - Complete API documentation

Ready to start using middleware? Check out our detailed guides for each middleware type!
