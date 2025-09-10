---
title: Diagrams & Visualizations
description: How to create beautiful diagrams in your documentation using Mermaid
sidebar_position: 1
---

# Diagrams & Visualizations

Noony documentation now supports Mermaid diagrams! Here are some examples of what you can create:

## Basic Flowchart

```mermaid
flowchart TD
    A[Start] --> B{Is it working?}
    B -->|Yes| C[Great!]
    B -->|No| D[Debug]
    D --> B
    C --> E[End]
```

## Sequence Diagram

```mermaid
sequenceDiagram
    participant User
    participant Handler
    participant Middleware
    participant Database
    
    User->>Handler: HTTP Request
    Handler->>Middleware: Process request
    Middleware->>Database: Query data
    Database-->>Middleware: Return data
    Middleware-->>Handler: Processed data
    Handler-->>User: HTTP Response
```

## Class Diagram

```mermaid
classDiagram
    class Handler {
        +use(middleware)
        +handle(function)
        +execute(context)
    }
    
    class Middleware {
        +before(context)
        +after(context)
        +onError(error)
    }
    
    class Context {
        +req: Request
        +res: Response
        +user?: User
        +body?: any
    }
    
    Handler --> Middleware
    Handler --> Context
    Middleware --> Context
```

## State Diagram

```mermaid
stateDiagram-v2
    [*] --> Idle
    Idle --> Processing: Request received
    Processing --> Parsing: Body parser
    Parsing --> Validating: Validation middleware
    Validating --> Authenticating: Auth middleware
    Authenticating --> Executing: Business logic
    Executing --> Responding: Generate response
    Responding --> [*]: Response sent
    
    Processing --> Error: Parse error
    Validating --> Error: Validation error
    Authenticating --> Error: Auth error
    Executing --> Error: Handler error
    Error --> [*]: Error response
```

## Git Graph

```mermaid
gitgraph
    commit id: "Initial"
    branch feature
    checkout feature
    commit id: "Add middleware"
    commit id: "Add tests"
    checkout main
    commit id: "Bug fix"
    merge feature
    commit id: "Release v1.0"
```

## Entity Relationship

```mermaid
erDiagram
    USER ||--o{ HANDLER : creates
    HANDLER ||--o{ MIDDLEWARE : uses
    MIDDLEWARE }|--|| CONTEXT : modifies
    HANDLER ||--o{ REQUEST : processes
    REQUEST ||--|| RESPONSE : generates
    
    USER {
        string id
        string name
        string email
    }
    
    HANDLER {
        string id
        string name
        array middlewares
    }
    
    MIDDLEWARE {
        string type
        object config
        function execute
    }
```

## Pie Chart

```mermaid
pie title Middleware Usage
    "Body Parser" : 25
    "Validation" : 20
    "Authentication" : 30
    "Custom Logic" : 15
    "Error Handling" : 10
```

## Timeline

```mermaid
timeline
    title Noony Framework Development
    2023 : Initial concept
         : Core handler design
    2024 : Middleware system
         : TypeScript generics
         : Framework integrations
    2025 : Production ready
         : Community adoption
         : Enterprise features
```

These diagrams make your documentation much more visual and easier to understand!
