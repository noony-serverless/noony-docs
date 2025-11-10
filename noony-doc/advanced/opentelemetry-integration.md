# OpenTelemetry Integration

**Complete guide to distributed tracing and observability in Noony Framework**

## Overview

The Noony OpenTelemetry integration provides comprehensive distributed tracing and metrics collection with:

- **🔌 Extensible Provider System**: Built-in support for OTEL, New Relic, Datadog, or custom providers
- **🤖 Auto-Detection**: Automatically detects and configures providers from environment variables
- **🛡️ Graceful Degradation**: Falls back to no-op provider when configuration is missing
- **🔒 Fail-Safe**: Telemetry errors never break your application
- **💻 Local Development**: Console provider for zero-infrastructure local testing
- **📊 Type-Safe**: Full TypeScript support with generic type chains
- **🚀 Zero Configuration**: Works out-of-the-box with sensible defaults
- **☁️ Cloud Trace Integration**: Automatic GCP Cloud Trace synchronization
- **📨 Pub/Sub Trace Propagation**: W3C Trace Context for distributed tracing across Pub/Sub

## Quick Start

### Zero Configuration (Auto-Detect)

```typescript
import { Handler, OpenTelemetryMiddleware } from '@noony-serverless/core';

// Auto-detects provider based on environment
const handler = new Handler<CreateOrderRequest, AuthUser>()
  .use(new OpenTelemetryMiddleware())
  .handle(async (context) => {
    // Your business logic - automatically traced!
    const order = await orderService.create(context.req.validatedBody!);
    return { orderId: order.id };
  });

export const createOrder = http('createOrder', (req, res) => {
  return handler.execute(req, res);
});
```

**What happens:**
- `NODE_ENV=development` → Uses `ConsoleProvider` (logs to console)
- `NODE_ENV=test` → Uses `NoopProvider` (disabled)
- `OTEL_EXPORTER_OTLP_ENDPOINT` set → Uses `OpenTelemetryProvider`
- `NEW_RELIC_LICENSE_KEY` set → Uses `NewRelicProvider` (if package installed)
- No config → Uses `NoopProvider` (graceful fallback)

### Local Development

```bash
# .env.development
NODE_ENV=development
```

```typescript
const handler = new Handler()
  .use(new OpenTelemetryMiddleware()) // Logs spans to console
  .handle(async (context) => {
    // See spans in console:
    // [Telemetry] 🟢 Span started: { method: 'POST', path: '/orders', ... }
    // [Telemetry] 📊 Attributes: { user.id: '123', ... }
    // [Telemetry] 🔴 Span ended: { duration: '45ms' }
  });
```

### Production with Standard OTEL

```bash
# .env.production
OTEL_EXPORTER_OTLP_ENDPOINT=https://your-otel-collector:4318/v1/traces
OTEL_SERVICE_NAME=order-service
OTEL_SERVICE_VERSION=2.1.0
```

## Custom Filtering

```typescript
const handler = new Handler()
  .use(new OpenTelemetryMiddleware({
    // Skip tracing for health checks
    shouldTrace: (context) => {
      return !['/health', '/metrics', '/ready'].includes(
        context.req.path || ''
      );
    }
  }))
  .handle(async (context) => {
    // Only non-health-check requests are traced
  });
```

## Custom Attributes

```typescript
const handler = new Handler<CreateOrderRequest, AuthUser>()
  .use(new OpenTelemetryMiddleware({
    extractAttributes: (context) => ({
      // HTTP attributes
      'http.method': context.req.method,
      'http.url': context.req.url || context.req.path,
      'request.id': context.requestId,

      // User attributes
      'user.id': context.user?.id,
      'user.email': context.user?.email,
      'user.role': context.user?.role,

      // Business attributes
      'tenant.id': process.env.TENANT_ID,
      'service.instance': process.env.INSTANCE_ID,
      'deployment.environment': process.env.NODE_ENV
    })
  }))
  .handle(async (context) => {
    // All attributes attached to span
  });
```

## Google Cloud Pub/Sub Trace Propagation

Noony automatically propagates trace context through Google Cloud Pub/Sub messages using W3C Trace Context standard.

### Publisher Example

```typescript
import { PubSub } from '@google-cloud/pubsub';
import {
  Handler,
  OpenTelemetryMiddleware,
  injectTraceContext
} from '@noony-serverless/core';

const pubsub = new PubSub();

const handler = new Handler<CreateOrderRequest, AuthUser>()
  .use(new OpenTelemetryMiddleware())
  .handle(async (context) => {
    const order = await orderService.create(context.req.validatedBody!);

    // Inject trace context into Pub/Sub message
    const message = injectTraceContext({
      data: Buffer.from(JSON.stringify({ orderId: order.id })).toString('base64'),
      attributes: { eventType: 'order.created' }
    }, context);

    await pubsub.topic('orders').publish(message);
    // Trace context propagated via message attributes!

    return { orderId: order.id };
  });
```

### Subscriber Example

```typescript
import {
  Handler,
  OpenTelemetryMiddleware,
  BodyParserMiddleware
} from '@noony-serverless/core';

const handler = new Handler()
  .use(new BodyParserMiddleware())
  .use(new OpenTelemetryMiddleware({
    propagatePubSubTraces: true  // default: true
  }))
  .handle(async (context) => {
    // Automatically linked to publisher's trace!
    const message = context.req.parsedBody;
    await inventoryService.reserveStock(message.orderId);
    return { success: true };
  });
```

**Result:** Single distributed trace across HTTP → Pub/Sub → Subscriber! 🎯

## Cloud Trace Integration (Google Cloud Platform)

When running on GCP, Noony automatically integrates with Cloud Trace using **CloudPropagator**.

### Automatic Detection

CloudPropagator is automatically enabled when:
- Running on Cloud Run (`K_SERVICE` env var)
- Running on Cloud Functions (`FUNCTION_NAME` env var)
- Running on App Engine (`GAE_APPLICATION` env var)

```bash
# Install CloudPropagator (optional)
npm install @google-cloud/opentelemetry-cloud-trace-propagator --save-optional
```

### Response Headers

With CloudPropagator enabled, responses include multiple trace headers:

```http
HTTP/1.1 200 OK
X-Cloud-Trace-Context: 13ea7e3c2d3b4547baaa399062df1f2d/1234567890123456;o=1
X-Trace-Id: 13ea7e3c2d3b4547baaa399062df1f2d
traceparent: 00-13ea7e3c2d3b4547baaa399062df1f2d-1234567890123456-01
```

**All three headers contain the SAME trace ID** for complete observability!

### Debugging with Trace IDs

```bash
# Extract trace ID from response
TRACE_ID=$(curl -s -D - https://your-api.run.app/endpoint | grep -i 'x-trace-id' | cut -d' ' -f2 | tr -d '\r')

# View in Cloud Trace UI
echo "https://console.cloud.google.com/traces/trace/${TRACE_ID}?project=PROJECT_ID"
```

## Environment Variables

### Standard OpenTelemetry

| Variable | Description | Example |
|----------|-------------|---------|
| `OTEL_EXPORTER_OTLP_ENDPOINT` | OTLP exporter endpoint | `http://localhost:4318/v1/traces` |
| `OTEL_SERVICE_NAME` | Service name | `order-service` |
| `OTEL_SERVICE_VERSION` | Service version | `1.0.0` |

### New Relic

| Variable | Description | Example |
|----------|-------------|---------|
| `NEW_RELIC_LICENSE_KEY` | New Relic license key | `your-license-key` |
| `NEW_RELIC_APP_NAME` | Application name | `order-service` |

### Datadog

| Variable | Description | Example |
|----------|-------------|---------|
| `DD_API_KEY` | Datadog API key | `your-api-key` |
| `DD_SERVICE` | Service name | `order-service` |
| `DD_ENV` | Environment | `production` |

## Best Practices

### 1. Use Environment-Based Configuration

```typescript
// ✅ Good - Configuration from environment
const handler = new Handler()
  .use(new OpenTelemetryMiddleware())
  .handle(async (context) => { /* ... */ });
```

### 2. Filter Health Checks

```typescript
const handler = new Handler()
  .use(new OpenTelemetryMiddleware({
    shouldTrace: (context) => {
      const path = context.req.path || '';
      return !['/health', '/metrics', '/ready'].includes(path);
    }
  }))
  .handle(async (context) => { /* ... */ });
```

### 3. Add Business Context

```typescript
const handler = new Handler<CreateOrderRequest, AuthUser>()
  .use(new OpenTelemetryMiddleware({
    extractAttributes: (context) => ({
      'user.id': context.user?.id,
      'user.role': context.user?.role,
      'tenant.id': process.env.TENANT_ID,
      'order.type': context.req.parsedBody?.type
    })
  }))
  .handle(async (context) => { /* ... */ });
```

### 4. Handle Shutdown Gracefully

```typescript
const telemetryMiddleware = new OpenTelemetryMiddleware();

process.on('SIGTERM', async () => {
  await telemetryMiddleware.shutdown();
  process.exit(0);
});
```

## Performance Impact

Based on testing with 1000 req/s:

| Provider | Overhead | Memory | Notes |
|----------|----------|--------|-------|
| NoopProvider | ~0ms | 0 KB | No overhead (no-op) |
| ConsoleProvider | ~1-2ms | ~50 KB | Console I/O overhead |
| OpenTelemetryProvider | ~2-5ms | ~5 MB | OTLP export batching |

**Sampling reduces overhead:**
- 100% sampling: ~5ms overhead
- 10% sampling: ~0.5ms overhead
- 1% sampling: ~0.05ms overhead

## Related Documentation

- [Middleware Guide](../middlewares/index.md) - Complete middleware documentation
- [Handler Complete Guide](../core-concepts/Handler-Complete-Guide.md) - Deep dive into handlers
- [Authentication Guide](../authentication/index.md) - Authentication patterns
