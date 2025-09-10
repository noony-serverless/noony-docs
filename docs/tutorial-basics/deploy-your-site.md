---
sidebar_position: 5
---

# Deploy Your Functions

CloudFlow Functions provides **lightning-fast deployments** to a global edge network. Deploy your serverless applications in seconds, not minutes.

## Build and Deploy

Deploy your functions to production with a single command:

```bash
cloudflow deploy
```

This command will:

1. **Bundle your functions** with optimal packaging
2. **Deploy to edge locations** worldwide
3. **Configure auto-scaling** based on your settings
4. **Set up monitoring** and logging automatically

## Deployment Environments

CloudFlow supports multiple deployment environments:

### Development Environment
```bash
# Deploy to development environment
cloudflow deploy --env dev

# Or use the shorthand
cloudflow deploy -e dev
```

### Staging Environment
```bash
# Deploy to staging for testing
cloudflow deploy --env staging
```

### Production Environment
```bash
# Deploy to production
cloudflow deploy --env production

# Production deployments include additional safety checks
cloudflow deploy --env production --confirm
```

## Environment Configuration

Configure environment-specific settings in `cloudflow.config.js`:

```javascript title="cloudflow.config.js"
export default {
  environments: {
    dev: {
      region: 'us-east-1',
      memory: 256,
      timeout: 30,
      env: {
        DEBUG: 'true',
        LOG_LEVEL: 'debug'
      }
    },
    staging: {
      region: 'us-east-1',
      memory: 512,
      timeout: 60,
      env: {
        DEBUG: 'false',
        LOG_LEVEL: 'info'
      }
    },
    production: {
      region: ['us-east-1', 'eu-west-1', 'ap-southeast-1'],
      memory: 1024,
      timeout: 300,
      env: {
        DEBUG: 'false',
        LOG_LEVEL: 'warn'
      }
    }
  }
};
```

## Preview Deployments

Test your changes before going live:

```bash
# Create a preview deployment
cloudflow deploy --preview

# Deploy with a custom preview name
cloudflow deploy --preview feature-auth
```

Preview deployments:
- Get a **unique URL** for testing
- Include **all your changes** 
- **Auto-expire** after 7 days
- Don't affect production traffic

## Deployment Status

Monitor your deployment progress:

```bash
# Check deployment status
cloudflow status

# Get detailed deployment information
cloudflow status --verbose

# Watch deployment logs in real-time
cloudflow logs --follow
```

## Advanced Deployment Options

### Blue-Green Deployments
```bash
# Deploy with blue-green strategy
cloudflow deploy --strategy blue-green

# Gradually shift traffic to new version
cloudflow traffic --shift 10  # 10% to new version
cloudflow traffic --shift 50  # 50% to new version
cloudflow traffic --shift 100 # 100% to new version
```

### Canary Deployments
```bash
# Deploy to a subset of regions first
cloudflow deploy --canary --regions us-east-1

# If successful, deploy to all regions
cloudflow deploy --promote
```

### Rollback Deployments
```bash
# List recent deployments
cloudflow deployments list

# Rollback to previous version
cloudflow rollback

# Rollback to specific version
cloudflow rollback --version v1.2.3
```

## CI/CD Integration

Integrate CloudFlow deployments with your CI/CD pipeline:

### GitHub Actions
```yaml title=".github/workflows/deploy.yml"
name: Deploy to CloudFlow
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install CloudFlow CLI
        run: npm install -g @cloudflow/cli
        
      - name: Deploy to CloudFlow
        run: cloudflow deploy --env production
        env:
          CLOUDFLOW_TOKEN: ${{ secrets.CLOUDFLOW_TOKEN }}
```

### GitLab CI
```yaml title=".gitlab-ci.yml"
deploy:
  stage: deploy
  image: node:18
  script:
    - npm install -g @cloudflow/cli
    - cloudflow deploy --env production
  environment:
    name: production
    url: https://your-app.cloudflow.dev
  only:
    - main
```

## Performance Optimization

CloudFlow automatically optimizes your deployments:

- **Intelligent bundling** reduces function size
- **Edge caching** for faster cold starts  
- **Regional deployment** for low latency
- **Auto-scaling** based on traffic patterns

## Monitoring Deployments

CloudFlow provides built-in monitoring:

```bash
# View function metrics
cloudflow metrics

# Check error rates
cloudflow metrics --errors

# Monitor specific function
cloudflow metrics --function hello-world
```

Visit the [CloudFlow Dashboard](https://dashboard.cloudflow.dev) for:
- Real-time performance metrics
- Error tracking and alerting
- Cost analysis and optimization
- Deployment history and rollbacks

## What's Next?

- Learn about [environment variables and secrets](/docs/tutorial-basics/create-a-page)
- Set up [custom domains](/docs/tutorial-extras/manage-docs-versions)
- Configure [monitoring and alerts](/docs/tutorial-extras/translate-your-site)
- Explore [advanced patterns](/docs/tutorial-basics/markdown-features)
