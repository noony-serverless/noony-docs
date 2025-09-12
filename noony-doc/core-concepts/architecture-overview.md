---
title: Architecture Overview
description: Visual overview of Noony Framework architecture and component relationships
sidebar_position: 2
---

# Architecture Overview

Understanding the Noony Framework architecture helps you build better serverless applications. This overview shows how different components work together.

## Framework Architecture

```mermaid
graph TD
    A[Client Request] --> B[Handler]
    B --> C{Middleware Chain}
    C --> D[Body Parser]
    C --> E[Validation]
    C --> F[Authentication]
    C --> G[Custom Logic]
    D --> H[Business Logic]
    E --> H
    F --> H
    G --> H
    H --> I[Response]
    I --> J[Client Response]
    
    style A fill:#e1f5fe
    style B fill:#f3e5f5
    style H fill:#e8f5e8
    style I fill:#fff3e0
    style J fill:#e1f5fe
```

## Middleware Flow

The middleware system processes requests in a specific order:

```mermaid
sequenceDiagram
    participant C as Client
    participant H as Handler
    participant BP as Body Parser
    participant V as Validator
    participant A as Auth
    participant BL as Business Logic
    
    C->>H: HTTP Request
    H->>BP: Parse request body
    BP->>V: Validate data
    V->>A: Check authentication
    A->>BL: Execute handler logic
    BL->>A: Return result
    A->>V: Pass response
    V->>BP: Format response
    BP->>H: Final response
    H->>C: HTTP Response
```

## Component Dependencies

```mermaid
graph LR
    subgraph "Core"
        Handler[Handler Class]
        Context[Context Object]
    end
    
    subgraph "Middlewares"
        BP[Body Parser]
        Val[Validation]
        Auth[Authentication]
        DI[Dependency Injection]
    end
    
    subgraph "Framework Support"
        AWS[AWS Lambda]
        Azure[Azure Functions]
        GCP[Google Cloud Functions]
    end
    
    Handler --> Context
    Handler --> BP
    Handler --> Val
    Handler --> Auth
    Handler --> DI
    
    Handler --> AWS
    Handler --> Azure
    Handler --> GCP
    
    style Handler fill:#f9f,stroke:#333,stroke-width:4px
    style Context fill:#bbf,stroke:#333,stroke-width:2px
```

## Type Safety Flow

One of Noony's key strengths is end-to-end type safety:

```mermaid
flowchart TB
    subgraph "Request Processing"
        A[Raw Request] --> B[Body Parser<T>]
        B --> C[Validator<T>]
        C --> D[Auth Middleware]
        D --> E[Handler<T>]
    end
    
    subgraph "Type Information"
        F[T: Request Body Type]
    end
    
    B -.-> F
    C -.-> F
    E -.-> F
    
    E --> I[Type-Safe Response]
    
    style A fill:#ffebee
    style I fill:#e8f5e8
    style F fill:#e3f2fd
```

## Deployment Targets

Noony is framework-agnostic and supports multiple deployment targets:

```mermaid
mindmap
  root((Noony App))
    AWS
      Lambda
      API Gateway
      CloudWatch
    Azure
      Functions
      API Management
      Application Insights
    Google Cloud
      Cloud Functions
      Cloud Run
      Cloud Monitoring
    Local Development
      Hot Reload
      Testing
      Debugging
```

This architecture ensures that your application code remains the same regardless of where you deploy it, while still taking advantage of platform-specific optimizations.
