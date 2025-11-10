---
sidebar_position: 1
---

# Noony Framework Complete Guide

**The definitive guide to the Noony serverless middleware framework with TypeScript generics**

> This is your single source of truth for everything Noony. Every example includes full type safety with generics.

## Table of Contents

1. [Quick Start](#quick-start)
2. [Core Concepts with Generics](#core-concepts-with-generics)
3. [Basic Patterns](#basic-patterns)
4. [Intermediate Patterns](#intermediate-patterns)
5. [Advanced Patterns](#advanced-patterns)
6. [Functional Programming](#functional-programming)
7. [Production Examples](#production-examples)
8. [Best Practices](#best-practices)
9. [When to Use What](#when-to-use-what)

---

## Quick Start

### Installation and Basic Setup

```typescript
import { 
  Handler, 
  Context, 
  BaseMiddleware,
  ErrorHandlerMiddleware,
  BodyValidationMiddleware,
  ResponseWrapperMiddleware 
} from '@noony/core';
import { z } from 'zod';

// 1. Define your request type with Zod
const createUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Must be a valid email'),
  age: z.number().min(18, 'Must be 18 or older')
});

// 2. Infer TypeScript types from schema
type CreateUserRequest = z.infer<typeof createUserSchema>;

// 3. Define your user type (what goes in context.user)
interface User {
  id: string;
  role: 'user' | 'admin';
  tenantId: string;
}

// 4. Create handler with full generics
const createUserHandler = new Handler<CreateUserRequest, User>()
  .use(new ErrorHandlerMiddleware<CreateUserRequest, User>())
  .use(new BodyValidationMiddleware<CreateUserRequest, User>(createUserSchema))
  .use(new ResponseWrapperMiddleware<CreateUserRequest, User>())
  .handle(async (context: Context<CreateUserRequest, User>) => {
    // TypeScript knows exactly what types these are!
    const { name, email, age } = context.req.validatedBody!; // Type: CreateUserRequest
    const user = context.user!; // Type: User

    // Business logic with full type safety
    const newUser = await userService.create({ name, email, age, createdBy: user.id });

    context.res.json({ user: newUser });
  });

// 5. Export for Google Cloud Functions
export const createUser = http('createUser', (req, res) =>
  createUserHandler.execute(req, res)
);
```

**Key Takeaway**: Always use `Handler<RequestType, UserType>` and `Context<RequestType, UserType>` for complete type safety.

---

## Core Concepts with Generics

### Framework Architecture Overview

```mermaid
graph TB
    subgraph "Noony Framework Architecture"
        A[HTTP Request] --> B[Framework Adapter]
        B --> C["Handler<T,U>"]
        
        subgraph "Middleware Pipeline"
            C --> D["ErrorHandlerMiddleware<T,U>"]
            D --> E["AuthenticationMiddleware<T,U>"]
            E --> F["BodyValidationMiddleware<T,U>"]
            F --> G["Custom Business Middleware<T,U>"]
            G --> H["ResponseWrapperMiddleware<T,U>"]
        end
        
        H --> I[Business Logic Handler]
        I --> J[HTTP Response]
        
        subgraph "Context Flow"
            K["Context<T,U>"]
            L["req: NoonyRequest<T>"]
            M[res: NoonyResponse]
            N["user?: U"]
            O[businessData: Map]
            
            K --> L
            K --> M  
            K --> N
            K --> O
        end
        
        C --> K
        I --> K
    end
    
    subgraph "Type Safety"
        P[Raw JSON] --> Q[Zod Schema]
        Q --> R["Typed Request <T>"]
        S[JWT Token] --> T[Token Verification]
        T --> U["Typed User <U>"]
    end
    
    R --> L
    U --> N
    
    style C fill:#e3f2fd
    style K fill:#fff3e0
    style I fill:#e8f5e8
    style R fill:#c8e6c9
    style U fill:#f8bbd9
```

### Generic Type Flow

```mermaid
graph LR
    subgraph "Request Processing"
        A[Raw Body: unknown] --> B[JSON Parse] 
        B --> C[Zod Validation]
        C --> D["Typed Data: T"]
    end
    
    subgraph "Authentication"
        E[JWT Token] --> F[Token Decode]
        F --> G["User Data: U"]
    end
    
    subgraph "Context Creation"
        H["Context<T, U>"]
        D --> H
        G --> H
    end
    
    subgraph "Middleware Chain"
        I["BaseMiddleware<T, U>"]
        J["before(context: Context<T, U>)"]
        K["after(context: Context<T, U>)"]
        L["onError(error, context: Context<T, U>)"]
        
        H --> I
        I --> J
        I --> K
        I --> L
    end
    
    subgraph "Business Logic"
        M[Handler Function]
        N["context.req.validatedBody: T"]
        O["context.user: U"]
        
        H --> M
        M --> N
        M --> O
    end
    
    style D fill:#c8e6c9
    style G fill:#bbdefb
    style H fill:#fff3e0
    style N fill:#f3e5f5
    style O fill:#fce4ec
```

### `Handler<T, U>`

The Handler is the core orchestrator with two generic types:
- **T**: The validated request body type
- **U**: The authenticated user type

```typescript
// Generic Handler signature
class Handler<T = unknown, U = unknown> {
  use<NewT = T, NewU = U>(middleware: BaseMiddleware<NewT, NewU>): Handler<NewT, NewU>
  handle(businessLogic: (context: Context<T, U>) => Promise<void>): void
  execute(req: any, res: any): Promise<void>
}
```

### `Context<T, U>`

The Context carries type-safe data through the middleware chain:

```typescript
interface Context<T = unknown, U = unknown> {
  req: {
    body?: any;
    parsedBody?: any;
    validatedBody?: T;  // Always type T after validation
    headers: Record<string, string | string[]>;
    query?: Record<string, any>;
    params?: Record<string, any>;
  };
  res: {
    status(code: number): this;
    json(data: any): void;
    send(data: any): void;
  };
  user?: U;  // Always type U after authentication
  requestId: string;
  startTime: number;
  businessData?: Map<string, any>;
}
```

### `BaseMiddleware<T, U>`

All middleware implements this generic interface:

```typescript
interface BaseMiddleware<T = unknown, U = unknown> {
  before?(context: Context<T, U>): Promise<void>;
  after?(context: Context<T, U>): Promise<void>;
  onError?(error: Error, context: Context<T, U>): Promise<void>;
}
```

**Custom Middleware Example**:

```typescript
class LoggingMiddleware<T, U> implements BaseMiddleware<T, U> {
  async before(context: Context<T, U>): Promise<void> {
    console.log(`Request ${context.requestId} started`);
    console.log('User:', context.user); // Type: U | undefined
  }

  async after(context: Context<T, U>): Promise<void> {
    const duration = Date.now() - context.startTime;
    console.log(`Request ${context.requestId} completed in ${duration}ms`);
  }
}
```

---

## Basic Patterns

### Simple CRUD Operations

```typescript
// User Management Types
interface CreateUserRequest {
  name: string;
  email: string;
  role: 'user' | 'admin';
}

interface UpdateUserRequest {
  id: string;
  name?: string;
  email?: string;
  role?: 'user' | 'admin';
}

interface AuthenticatedUser {
  id: string;
  email: string;
  role: 'user' | 'admin';
  permissions: string[];
}

// Create User Handler
const createUserHandler = new Handler<CreateUserRequest, AuthenticatedUser>()
  .use(new ErrorHandlerMiddleware<CreateUserRequest, AuthenticatedUser>())
  .use(new AuthenticationMiddleware<CreateUserRequest, AuthenticatedUser>(tokenVerifier))
  .use(new BodyValidationMiddleware<CreateUserRequest, AuthenticatedUser>(createUserSchema))
  .use(new ResponseWrapperMiddleware<CreateUserRequest, AuthenticatedUser>())
  .handle(async (context: Context<CreateUserRequest, AuthenticatedUser>) => {
    const userData = context.req.validatedBody!; // Type: CreateUserRequest
    const currentUser = context.user!; // Type: AuthenticatedUser

    // Permission check with full typing
    if (!currentUser.permissions.includes('user:create')) {
      throw new AuthenticationError('Insufficient permissions');
    }

    const newUser = await userRepository.create(userData);
    context.res.status(201).json({ user: newUser });
  });

// Update User Handler
const updateUserHandler = new Handler<UpdateUserRequest, AuthenticatedUser>()
  .use(new ErrorHandlerMiddleware<UpdateUserRequest, AuthenticatedUser>())
  .use(new AuthenticationMiddleware<UpdateUserRequest, AuthenticatedUser>(tokenVerifier))
  .use(new BodyValidationMiddleware<UpdateUserRequest, AuthenticatedUser>(updateUserSchema))
  .use(new ResponseWrapperMiddleware<UpdateUserRequest, AuthenticatedUser>())
  .handle(async (context: Context<UpdateUserRequest, AuthenticatedUser>) => {
    const { id, ...updates } = context.req.validatedBody!; // Type: UpdateUserRequest
    const currentUser = context.user!; // Type: AuthenticatedUser

    // Business logic with type safety
    const updatedUser = await userRepository.update(id, updates);
    context.res.json({ user: updatedUser });
  });
```

---

## Intermediate Patterns

### Complex Validation with Cross-Field Dependencies

```typescript
// ... content from NOONY_COMPLETE_GUIDE.md
```

## Advanced Patterns

### Multi-Tenant Architecture with Type Safety

```typescript
// ... content from NOONY_COMPLETE_GUIDE.md
```

## Functional Programming

### Higher-Order Functions with Generics

```typescript
// ... content from NOONY_COMPLETE_GUIDE.md
```

## Production Examples

### E-commerce System Architecture

```typescript
// ... content from NOONY_COMPLETE_GUIDE.md
```

## Best Practices

### Always Use Generics

```typescript
// ... content from NOONY_COMPLETE_GUIDE.md
```

## When to Use What

### Decision Tree

```typescript
// ... content from NOONY_COMPLETE_GUIDE.md
```