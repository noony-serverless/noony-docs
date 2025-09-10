---
title: Core Concepts
description: Fundamental concepts of the Noony Framework - handlers, middleware, and type safety
sidebar_position: 1
---

# Core Concepts

Understanding the core concepts of the Noony Framework will help you build better, more maintainable serverless applications.

## Handler System

The `Handler` class is the heart of Noony:

- **[Handler Architecture](/docs/core-concepts/Handler-Complete-Guide)** - Complete guide to the Handler class
- **[Architecture Overview](/docs/core-concepts/architecture-overview)** - Visual system architecture

```typescript
import { Handler } from '@noony/core';

const handler = new Handler()
  .use(middleware1)
  .use(middleware2)
  .handle(async (context) => {
    // Your business logic here
    return response;
  });
```

## Middleware System

Composable middleware for request processing:

- **Type-safe composition** - Middleware with TypeScript generics
- **Request lifecycle** - Before, during, and after processing
- **Error handling** - Automatic error catching and processing
- **Context sharing** - Pass data between middleware layers

## Type Safety

End-to-end type safety throughout your application:

- **Generic constraints** - Type-safe middleware composition
- **Automatic inference** - TypeScript understands your data flow
- **Compile-time validation** - Catch errors before runtime
- **IDE support** - Full IntelliSense and code completion

## Context Object

The context object carries request data through the middleware chain:

```typescript
interface Context<T = any, U = any> {
  req: Request;           // Original request
  res?: Response;         // Response object
  body?: T;              // Parsed request body
  user?: U;              // Authenticated user
  query?: any;           // Query parameters
  headers?: any;         // Request headers
  // ... more properties
}
```

## Framework Agnostic

Noony works with multiple serverless platforms:

- **AWS Lambda** - Native AWS integration
- **Azure Functions** - Microsoft Azure support
- **Google Cloud Functions** - Google Cloud Platform
- **Local development** - Run anywhere Node.js runs

## Request Lifecycle

Understanding how requests flow through Noony:

1. **Request received** - Handler accepts the request
2. **Middleware chain** - Middleware processes the request
3. **Business logic** - Your handler function executes
4. **Response generation** - Response is formatted and returned
5. **Error handling** - Errors are caught and handled gracefully

Ready to dive deeper? Explore our detailed guides on each component!
