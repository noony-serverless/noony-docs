# Noony Framework Components Reference

**Complete detailed explanation of every Noony component, their types, and when to use them**

## Table of Contents

1. [Core Components](#core-components)
2. [Handler System](#handler-system)
3. [Context System](#context-system)
4. [Middleware System](#middleware-system)
5. [Built-in Middlewares](#built-in-middlewares)
6. [Authentication Components](#authentication-components)
7. [Error System](#error-system)
8. [When to Use Each Component](#when-to-use-each-component)

## Core Components

### Handler&lt;T, U&gt;

**The central orchestrator of the Noony framework**

```typescript
export class Handler<T = unknown, U = unknown> {
  private baseMiddlewares: BaseMiddleware<T, U>[] = [];
  private handler!: (context: Context<T, U>) => Promise<void>;

  // Methods
  use<NewT = T, NewU = U>(middleware: BaseMiddleware<NewT, NewU>): Handler<NewT, NewU>
  handle(handler: (context: Context<T, U>) => Promise<void>): Handler<T, U>
  execute(req: CustomRequest<T>, res: CustomResponse): Promise<void>
  executeGeneric(req: GenericRequest<T>, res: GenericResponse): Promise<void>
}
```

**Type Parameters:**
- **T**: The validated request body type
- **U**: The authenticated user type

**When to Use:**
- **Always** - This is the foundation of every Noony application
- Every endpoint needs a Handler instance
- Use generics to maintain type safety throughout the middleware chain

### Context&lt;T, U&gt;

**The execution context that carries data through the middleware chain**

```typescript
export interface Context<T = unknown, U = unknown> {
  readonly req: GenericRequest<T>;
  readonly res: GenericResponse;
  container?: Container;
  error?: Error | null;
  readonly businessData: Map<string, unknown>;
  user?: U;
  readonly startTime: number;
  readonly requestId: string;
  timeoutSignal?: AbortSignal;
  responseData?: unknown;
}
```

**Properties:**

| Property | Type | Purpose |
|----------|------|---------|
| `req` | `GenericRequest<T>` | Framework-agnostic request object |
| `res` | `GenericResponse` | Framework-agnostic response object |
| `user` | `U` | Authenticated user information |
| `businessData` | `Map<string, unknown>` | Shared data between middlewares |
| `requestId` | `string` | Unique request identifier |

### BaseMiddleware&lt;T, U&gt;

**The interface that all middleware must implement**

```typescript
export interface BaseMiddleware<T = unknown, U = unknown> {
  before?: (context: Context<T, U>) => Promise<void>;
  after?: (context: Context<T, U>) => Promise<void>;
  onError?: (error: Error, context: Context<T, U>) => Promise<void>;
}
```

**Lifecycle Methods:**

| Method | Execution Order | Purpose |
|--------|----------------|---------|
| `before` | Sequential (first to last) | Pre-processing, validation, authentication |
| `after` | Reverse order (last to first) | Post-processing, cleanup, logging |
| `onError` | Reverse order (last to first) | Error handling and recovery |

## Handler System

### GenericRequest&lt;T&gt;

**Framework-agnostic request interface**

```typescript
export interface GenericRequest<T = unknown> {
  method: HttpMethod | string;
  url: string;
  path?: string;
  headers: Record<string, string | string[] | undefined>;
  query: Record<string, string | string[] | undefined>;
  params: Record<string, string>;
  body?: unknown;
  rawBody?: Buffer | string;
  parsedBody?: T;
  validatedBody?: T;
  ip?: string;
  userAgent?: string;
}
```

**Body Progression:**
- `body` → Raw request body (unknown)
- `parsedBody` → Parsed JSON (T)
- `validatedBody` → Validated & typed data (T)

### GenericResponse

**Framework-agnostic response interface**

```typescript
export interface GenericResponse {
  status(code: number): GenericResponse;
  json(data: unknown): GenericResponse | void;
  send(data: unknown): GenericResponse | void;
  header(name: string, value: string): GenericResponse;
  headers(headers: Record<string, string>): GenericResponse;
  end(): void;
  statusCode?: number;
  headersSent?: boolean;
}
```

## Built-in Middlewares

### ErrorHandlerMiddleware&lt;T, U&gt;

**Centralized error handling - ALWAYS use first**

```typescript
class ErrorHandlerMiddleware<T, U> implements BaseMiddleware<T, U> {
  async onError(error: Error, context: Context<T, U>): Promise<void>
}
```

**When to Use:**
- **Always** - First middleware in every chain
- Provides consistent error response format
- Handles all error types properly

### AuthenticationMiddleware&lt;T, U&gt;

**JWT token verification and user context setup**

```typescript
interface TokenVerifier<U> {
  verifyToken(token: string): Promise<U>;
}

class AuthenticationMiddleware<T, U> implements BaseMiddleware<T, U> {
  constructor(private tokenVerifier: TokenVerifier<U>)
}
```

**When to Use:**
- When endpoint requires user authentication
- Sets `context.user` with authenticated user data
- Use early in middleware chain (after error handling)

### BodyValidationMiddleware&lt;T, U&gt;

**Zod schema validation with type inference**

```typescript
class BodyValidationMiddleware<T, U> implements BaseMiddleware<T, U> {
  constructor(private schema: z.ZodSchema<T>)
}
```

**When to Use:**
- When endpoint accepts request body
- Validates and types the request data
- Sets `context.req.validatedBody` with type `T`

### ResponseWrapperMiddleware&lt;T, U&gt;

**Standardizes response format - ALWAYS use last**

```typescript
class ResponseWrapperMiddleware<T, U> implements BaseMiddleware<T, U> {
  async after(context: Context<T, U>): Promise<void>
}
```

**When to Use:**
- **Always** - Last middleware in chain
- Wraps responses in consistent format
- Handles both success and error responses

### OpenTelemetryMiddleware&lt;T, U&gt;

**Distributed tracing and observability**

```typescript
interface OpenTelemetryOptions {
  provider?: TelemetryProvider;
  enabled?: boolean;
  extractAttributes?: (context: Context<unknown, unknown>) => Record<string, unknown>;
  shouldTrace?: (context: Context<unknown, unknown>) => boolean;
  propagatePubSubTraces?: boolean;
}

class OpenTelemetryMiddleware<T, U> implements BaseMiddleware<T, U>
```

**Key Features:**
- Auto-detects telemetry provider from environment
- Zero-configuration local development
- Pub/Sub trace propagation with W3C Trace Context
- Cloud Trace integration for GCP

**When to Use:**
- All production services for distributed tracing
- Debugging performance issues
- Multi-service architectures

### SecurityHeadersMiddleware&lt;T, U&gt;

**Adds security headers to responses**

```typescript
interface SecurityHeadersConfig {
  contentSecurityPolicy?: string;
  xFrameOptions?: string;
  xContentTypeOptions?: string;
  referrerPolicy?: string;
}

class SecurityHeadersMiddleware<T, U> implements BaseMiddleware<T, U>
```

**When to Use:**
- Web applications serving HTML
- APIs consumed by browsers
- Compliance requirements

### RateLimitingMiddleware&lt;T, U&gt;

**Request rate limiting protection**

```typescript
interface RateLimitConfig {
  windowMs: number;
  max: number;
  keyGenerator?: (context: Context<any, any>) => string;
}

class RateLimitingMiddleware<T, U> implements BaseMiddleware<T, U>
```

**When to Use:**
- Public APIs exposed to external clients
- Prevent abuse and DDoS attacks
- Different limits per user tier

## Authentication Components

### RouteGuards

**Main facade for the permission system**

```typescript
RouteGuards.configure()              // System configuration
RouteGuards.requirePermissions()     // Plain permission strategy
RouteGuards.requireWildcardPermissions() // Wildcard strategy
RouteGuards.requireComplexPermissions()  // Expression strategy
RouteGuards.requireAuth()            // Authentication only
```

**Permission Strategies:**

1. **Plain Permissions** (O(1) - Fastest)
   ```typescript
   RouteGuards.requirePermissions(['user:create', 'admin:users'])
   ```

2. **Wildcard Permissions** (Pattern Matching)
   ```typescript
   RouteGuards.requireWildcardPermissions(['admin.*', 'user.profile.*'])
   ```

3. **Expression Permissions** (Boolean Logic)
   ```typescript
   RouteGuards.requireComplexPermissions({
     or: [
       { and: [{ permission: 'admin.users' }, { permission: 'admin.read' }] },
       { permission: 'superadmin' }
     ]
   })
   ```

## Error System

### Built-in Error Classes

```typescript
export class HttpError extends Error {
  status: number;
  code?: string;
  details?: unknown;
}

export class ValidationError extends HttpError;      // 400
export class AuthenticationError extends HttpError;  // 401
export class SecurityError extends HttpError;        // 403
export class TimeoutError extends HttpError;         // 408
export class TooLargeError extends HttpError;        // 413
export class BusinessError extends HttpError;        // Custom status
```

## When to Use Each Component

### Decision Matrix

| Use Case | Components Needed | Example |
|----------|------------------|---------|
| **Simple CRUD API** | Handler, ErrorHandler, Auth, Validation, ResponseWrapper | User management |
| **Public API** | Handler, ErrorHandler, RateLimit, Validation, ResponseWrapper | Public data API |
| **Multi-tenant SaaS** | Handler, ErrorHandler, Auth, Guards, Validation | SaaS platform |
| **Payment Processing** | Handler, ErrorHandler, Auth, Security, Validation | E-commerce checkout |
| **Event Processing** | Handler, ErrorHandler, OpenTelemetry, BodyParser | Pub/Sub subscriber |

### Middleware Order Best Practices

```typescript
// Standard order for most APIs
const handler = new Handler<RequestType, UserType>()
  .use(new ErrorHandlerMiddleware<RequestType, UserType>())        // 1. Error handling
  .use(new SecurityHeadersMiddleware<RequestType, UserType>())     // 2. Security headers
  .use(new RateLimitingMiddleware<RequestType, UserType>())        // 3. Rate limiting
  .use(new AuthenticationMiddleware<RequestType, UserType>())      // 4. Authentication
  .use(new BodyParserMiddleware<RequestType, UserType>())          // 5. Body parsing
  .use(new BodyValidationMiddleware<RequestType, UserType>())      // 6. Body validation
  .use(new OpenTelemetryMiddleware<RequestType, UserType>())       // 7. Telemetry
  .use(new ResponseWrapperMiddleware<RequestType, UserType>())     // 8. Response wrapper
  .handle(async (context: Context<RequestType, UserType>) => {
    // Your business logic
  });
```

### Custom Middleware Template

```typescript
class CustomMiddleware<T, U> implements BaseMiddleware<T, U> {
  constructor(private config: CustomConfig) {}

  async before(context: Context<T, U>): Promise<void> {
    // Pre-processing logic
    // Store data in context.businessData
  }

  async after(context: Context<T, U>): Promise<void> {
    // Post-processing logic
    // Transform response
  }

  async onError(error: Error, context: Context<T, U>): Promise<void> {
    // Error handling logic
    // Clean up resources
  }
}
```

## Type Safety Flow

```
Raw JSON → Zod Validation → Typed Request <T>
JWT Token → Verification → Typed User <U>
Context<T, U> → Middleware Chain → Handler Function
```

**Complete Type Chain:**
1. Request body arrives as `unknown`
2. BodyParserMiddleware parses to `parsedBody`
3. BodyValidationMiddleware validates to `validatedBody: T`
4. AuthenticationMiddleware verifies to `user: U`
5. Handler receives fully typed `Context<T, U>`

## Performance Characteristics

| Component | Overhead | Memory | Notes |
|-----------|----------|--------|-------|
| Handler | ~0.1ms | Minimal | Container pooling |
| ErrorHandlerMiddleware | ~0.1ms | Minimal | Only on errors |
| AuthenticationMiddleware | ~0.1ms (cached) | Low | JWT verification |
| BodyValidationMiddleware | ~1-2ms | Low | Zod schema validation |
| OpenTelemetryMiddleware | ~2-5ms | ~5 MB | OTLP batching |
| RouteGuards | ~0.1ms (cached) | Low | Permission checks |

## Related Documentation

- **[Middleware Guide](../middlewares/index.md)** - Complete middleware documentation
- **[Handler Complete Guide](../core-concepts/Handler-Complete-Guide.md)** - Deep dive into handlers
- **[Authentication Guide](../authentication/index.md)** - Authentication patterns
- **[OpenTelemetry Integration](./opentelemetry-integration.md)** - Distributed tracing
- **[API Reference](./api-reference.md)** - Complete API documentation
