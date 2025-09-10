---
title: Getting Started
description: Start building with Noony Framework - the type-safe serverless framework
sidebar_position: 1
---

# Getting Started with Noony

Welcome to Noony, the type-safe serverless framework that makes building cloud applications simple and reliable.

## Quick Installation

```bash
npm install @noony/core
# or
yarn add @noony/core
```

## Your First Handler

Create a simple HTTP handler in minutes:

```typescript
import { Handler } from '@noony/core';
import { httpAttributesMiddleware } from '@noony/http';

const handler = new Handler()
  .use(httpAttributesMiddleware())
  .handle(async (context) => {
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Hello, Noony!' })
    };
  });

export default handler;
```

## What's Next?

- **[Core Concepts](/docs/core-concepts)** - Understand handlers and middleware
- **[Middlewares](/docs/middlewares)** - Explore built-in middleware options
- **[Authentication](/docs/authentication)** - Secure your applications
- **[Examples](/docs/examples)** - See real-world implementations

Ready to dive deeper? Check out our comprehensive documentation!
