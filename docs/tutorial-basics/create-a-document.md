---
sidebar_position: 2
---

# Create Your First Function

Functions are the **core building blocks** of CloudFlow applications. They're event-driven, auto-scaling pieces of code that respond to HTTP requests, database changes, file uploads, and more.

## Write Your First Function

Create a new function file at `functions/hello.js`:

```javascript title="functions/hello.js"
// A simple HTTP function that returns a greeting
export async function handler(event, context) {
  const { name = 'World' } = event.queryStringParameters || {};
  
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: `Hello, ${name}!`,
      timestamp: new Date().toISOString(),
      requestId: context.requestId
    })
  };
}
```

Your function is now available at the CloudFlow development endpoint.

## Configure Function Settings

Add metadata to customize your function's behavior:

```javascript title="functions/hello.js" {1-8}
// Function configuration
export const config = {
  name: 'hello-world',
  description: 'A simple greeting function',
  timeout: 30,
  memory: 256,
  runtime: 'nodejs18'
};

export async function handler(event, context) {
  // Your function code here
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Hello from CloudFlow!' })
  };
}
```

## Function Types

CloudFlow supports multiple function types to fit different use cases:

### HTTP Functions

Handle web requests and API endpoints:

```javascript title="functions/api.js"
export async function handler(event, context) {
  const method = event.httpMethod;
  const path = event.path;
  
  switch (method) {
    case 'GET':
      return { statusCode: 200, body: 'GET request' };
    case 'POST':
      return { statusCode: 201, body: 'Created' };
    default:
      return { statusCode: 405, body: 'Method not allowed' };
  }
}
```

### Event Functions

Process events from databases, queues, and other services:

```javascript title="functions/process-upload.js"
export async function handler(event, context) {
  const { bucket, key } = event.Records[0].s3;
  
  console.log(`Processing file: ${bucket}/${key}`);
  
  // Process the uploaded file
  await processFile(bucket, key);
  
  return { success: true };
}
```

### Scheduled Functions

Run functions on a schedule using cron expressions:

```javascript title="functions/daily-report.js"
export const config = {
  schedule: '0 9 * * *', // Every day at 9 AM
  timezone: 'UTC'
};

export async function handler(event, context) {
  // Generate and send daily report
  const report = await generateDailyReport();
  await sendReport(report);
  
  return { reportGenerated: true };
}
```

## Testing Functions Locally

Use the CloudFlow CLI to test your functions locally:

```bash
# Start local development server
cloudflow dev

# Test a specific function
cloudflow invoke hello --data '{"name": "CloudFlow"}'

# Watch for changes and auto-reload
cloudflow dev --watch
```

## Next Steps

- Learn about [function deployment](/docs/tutorial-basics/deploy-your-site)
- Explore [environment variables](/docs/tutorial-basics/create-a-page)
- Understand [error handling](/docs/tutorial-basics/markdown-features)
- Set up [monitoring and logging](/docs/tutorial-extras/manage-docs-versions)
