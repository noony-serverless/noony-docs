---
title: API Reference
description: A complete reference for all Noony framework components and middlewares.
sidebar_position: 4
---

# Noony Framework API Reference

This document provides a comprehensive reference for all core components and built-in middlewares of the Noony framework.

## Core Components

### 1. `Handler<T>`

The `Handler` class is the central orchestrator for creating serverless functions. It manages the middleware pipeline, context, and overall execution flow.

**Signature:**
```typescript
export class Handler<T = unknown> {
  private baseMiddlewares: BaseMiddleware<T>[] = [];
  private handler!: (context: Context<T>) => Promise<void>;

  constructor();

  use(middleware: BaseMiddleware<T>): Handler<T>;
  handle(handler: (context: Context<T>) => Promise<void>): Handler<T>;
  execute(req: any, res: any): Promise<void>;
  executeGeneric(req: NoonyRequest<T>, res: NoonyResponse): Promise<void>;
}
```

**Generic Parameters:**
- `T`: The type of the request body after validation. Defaults to `unknown`.

**Methods:**
- `use(middleware)`: Adds a middleware to the execution pipeline.
- `handle(handler)`: Sets the main business logic handler.
- `execute(req, res)`: Executes the handler with a platform-specific request/response (e.g., Google Cloud Functions).
- `executeGeneric(req, res)`: Executes the handler with a framework-agnostic request/response.

### 2. `Context<T>`

The `Context` object is a container for request-specific data that flows through the middleware chain. It provides a consistent, type-safe way to access request, response, user, and other data.

**Signature:**
```typescript
export interface Context<T = unknown> {
  readonly req: NoonyRequest<T>;
  readonly res: NoonyResponse;
  container?: Container;
  error?: Error | null;
  readonly businessData: Map<string, unknown>;
  user?: any; // This will be typed by the authentication middleware
  readonly startTime: number;
  readonly requestId: string;
  timeoutSignal?: AbortSignal;
  responseData?: unknown;
}
```

### 3. `BaseMiddleware<T>`

The `BaseMiddleware` interface defines the structure for all middleware components.

**Signature:**
```typescript
export interface BaseMiddleware<T = unknown> {
  before?: (context: Context<T>) => Promise<void>;
  after?: (context: Context<T>) => Promise<void>;
  onError?: (error: Error, context: Context<T>) => Promise<void>;
}
```

## Built-in Middlewares

This section provides a summary of the most important built-in middlewares.

### `ErrorHandlerMiddleware`
A robust middleware for catching and handling errors.

### `AuthenticationMiddleware`
Handles token-based authentication and populates `context.user`.

### `BodyValidationMiddleware`
Validates the request body using a Zod schema.

### `ResponseWrapperMiddleware`
Wraps the handler's return value in a consistent JSON structure.

### `HeaderVariablesMiddleware`
Extracts and validates required header variables.

### `QueryParametersMiddleware`
Validates and sanitizes query parameters.

### `DependencyInjectionMiddleware`
Manages the TypeDI container for the request.

### `RateLimitingMiddleware`
Provides rate limiting based on IP address or other identifiers.

### `SecurityHeadersMiddleware`
Adds common security headers to the response.

### `SecurityAuditMiddleware`
Logs security-related events for auditing purposes.