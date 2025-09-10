---
title: Middlewares
description: Built-in middleware for request processing, validation, authentication, and more
sidebar_position: 1
---

# Middlewares

Explore Noony's powerful middleware system for processing HTTP requests, validating data, handling authentication, and more.

## Request Processing

Essential middleware for handling HTTP requests:

- **[Body Parser](/docs/middlewares/BodyParserMiddleware-Guide)** - Parse request bodies (JSON, form data)
- **[Body Validation](/docs/middlewares/BodyValidationMiddleware-Guide)** - Schema validation with Zod
- **[HTTP Attributes](/docs/middlewares/httpAttributesMiddleware)** - Extract headers, query params, and paths

## Data Handling

Middleware for processing and validating request data:

- **[Header Variables](/docs/middlewares/headerVariablesMiddleware)** - Validate and extract HTTP headers
- **[Query Parameters](/docs/middlewares/queryParametersMiddleware)** - Handle URL query parameters
- **[Dependency Injection](/docs/middlewares/DependencyInjectionMiddleware-Guide)** - Inject services and dependencies

## Error Management

Robust error handling middleware:

- **[Error Handler](/docs/middlewares/errorHandlerMiddleware)** - Graceful error processing
- **Global error catching** - Automatic error boundary
- **Custom error responses** - Formatted error messages

## Integration & Advanced

Advanced middleware patterns:

- **[Integration Guide](/docs/middlewares/middleware-integration-guide)** - Combine multiple middleware
- **Custom middleware** - Build your own middleware
- **Performance optimization** - Optimize middleware chains

## Quick Start

Here's how to use middleware in your handlers:

```typescript
import { Handler } from '@noony/core';
import { 
  httpAttributesMiddleware,
  bodyParserMiddleware,
  bodyValidationMiddleware 
} from '@noony/http';
import { z } from 'zod';

const schema = z.object({
  name: z.string(),
  email: z.string().email()
});

const handler = new Handler()
  .use(httpAttributesMiddleware())
  .use(bodyParserMiddleware())
  .use(bodyValidationMiddleware(schema))
  .handle(async (context) => {
    // context.body is now type-safe and validated
    const { name, email } = context.body;
    
    return {
      statusCode: 200,
      body: JSON.stringify({ message: `Hello, ${name}!` })
    };
  });
```

## Middleware Order

The order of middleware matters! Generally follow this pattern:

1. **Error handling** - Catch all errors
2. **HTTP attributes** - Parse basic request data
3. **Body parsing** - Parse request body
4. **Validation** - Validate parsed data
5. **Authentication** - Verify user identity
6. **Business logic** - Your custom middleware
7. **Response formatting** - Format the response

## Custom Middleware

Create your own middleware for specific use cases:

```typescript
const customMiddleware = () => ({
  before: async (context) => {
    // Pre-processing logic
    context.startTime = Date.now();
  },
  after: async (context) => {
    // Post-processing logic
    const duration = Date.now() - context.startTime;
    console.log(`Request took ${duration}ms`);
  }
});
```

Ready to start using middleware? Check out our detailed guides for each middleware type!
