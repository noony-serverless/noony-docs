---
sidebar_position: 1
---

# Welcome to Noony Serverless Framework

**Build type-safe, scalable serverless applications with powerful middleware architecture and enterprise-grade features.**

Noony is a next-generation TypeScript-first serverless framework designed for building robust, maintainable, and performant cloud functions. With its powerful middleware system, type safety, and flexible architecture, Noony enables developers to focus on business logic while handling the complexities of serverless development.

## 🚀 Why Choose Noony?

### Type-Safe by Design

- **Full TypeScript support** - End-to-end type safety with powerful generics
- **Compile-time validation** - Catch errors before deployment
- **IntelliSense everywhere** - Rich IDE support and autocompletion
- **Automatic type inference** - Minimal boilerplate, maximum safety

### Powerful Middleware Architecture

- **Composable middleware chain** - Build complex logic from simple components
- **Request/Response transformation** - Seamless data processing
- **Built-in error handling** - Robust error management and recovery
- **Dependency injection** - Clean, testable code architecture

### Security & Authentication

- **Route guards** - Flexible authentication and authorization
- **Token validation** - JWT and custom token support
- **Multi-auth strategies** - Support for multiple authentication methods
- **Security middleware** - Built-in protection against common vulnerabilities

### Developer Experience

- **Framework agnostic** - Works with AWS Lambda, Azure Functions, Google Cloud Functions
- **Hot reloading** - Fast development iteration
- **Comprehensive testing** - Built-in testing utilities and mocking
- **Rich documentation** - Complete guides and examples

## 🏃‍♂️ Quick Start

Get your first Noony function running in under 5 minutes:

### Installation

Install Noony via npm:

```bash
npm install @noony/core
# or
yarn add @noony/core
```

### Your First Handler

Create a simple HTTP handler:

```typescript title="src/handlers/hello.ts"
import { Handler } from '@noony/core';
import { httpAttributesMiddleware } from '@noony/http';

const handler = new Handler()
  .use(httpAttributesMiddleware())
  .handle(async (context) => {
    const { name = 'World' } = context.query;
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `Hello, ${name}!`,
        timestamp: new Date().toISOString()
      })
    };
  });

export default handler;
```

### Add Middleware

Enhance your handler with powerful middleware:

```typescript title="src/handlers/api.ts"
import { Handler } from '@noony/core';
import { 
  httpAttributesMiddleware,
  bodyParserMiddleware,
  bodyValidationMiddleware 
} from '@noony/http';
import { z } from 'zod';

// Define your request schema
const requestSchema = z.object({
  name: z.string().min(1),
  email: z.string().email()
});

const handler = new Handler()
  .use(httpAttributesMiddleware())
  .use(bodyParserMiddleware())
  .use(bodyValidationMiddleware(requestSchema))
  .handle(async (context) => {
    // TypeScript knows the exact shape of context.body
    const { name, email } = context.body;
    
    // Your business logic here
    const user = await createUser({ name, email });
    
    return {
      statusCode: 201,
      body: JSON.stringify(user)
    };
  });

export default handler;
```

## 🧭 Documentation Structure

Our documentation is organized to help you learn Noony progressively:

### [Getting Started](/docs/getting-started)

- Installation and setup
- Your first handler
- Basic middleware usage
- Development workflow

### [Core Concepts](/docs/core-concepts)

- Handler architecture
- Middleware system
- TypeScript generics
- Context and lifecycle

### [Middlewares](/docs/middlewares)

- HTTP processing
- Body parsing and validation
- Error handling
- Custom middleware development

### [Authentication & Security](/docs/authentication)

- Route guards
- Token validation
- Multi-auth patterns
- Security best practices

### [Advanced Topics](/docs/advanced)

- Performance optimization
- Framework integration
- Testing strategies
- Production deployment

### [Examples & Recipes](/docs/examples)

- Real-world use cases
- Integration patterns
- Code recipes
- Best practices

## 🛠️ Core Features

### Handler System

The `Handler` class is the heart of Noony, providing:

- **Type-safe middleware composition**
- **Request/response lifecycle management**
- **Error handling and recovery**
- **Framework-agnostic deployment**

### Middleware Ecosystem

Built-in middleware for common tasks:

- **HTTP processing** - Parse headers, query params, and bodies
- **Validation** - Schema-based request validation
- **Authentication** - JWT tokens, API keys, custom auth
- **Error handling** - Graceful error responses
- **Dependency injection** - Clean architecture patterns

### Type Safety

Leverage TypeScript's power:

- **End-to-end type safety** from request to response
- **Generic constraints** for middleware composition
- **Automatic type inference** reduces boilerplate
- **Compile-time validation** catches errors early

## 🚀 Ready to Get Started?

Choose your path based on your experience level:

- **New to Noony?** Start with our [Getting Started](/docs/getting-started) guide
- **Want to see code?** Jump to [Examples & Recipes](/docs/examples)
- **Coming from another framework?** Check out [Core Concepts](/docs/core-concepts)
- **Need specific middleware?** Browse our [Middleware documentation](/docs/middlewares)

## 💬 Community & Support

Join the Noony community:

- **[GitHub Repository](https://github.com/noony-org/noony)** - Source code and issues
- **[Discord Community](https://discord.gg/noony)** - Real-time chat and support
- **[Documentation](https://docs.noony.dev)** - Comprehensive guides
- **[Examples Repository](https://github.com/noony-org/examples)** - Real-world examples

---

**Ready to build type-safe serverless applications?** [Get started](/docs/getting-started) with Noony today!
