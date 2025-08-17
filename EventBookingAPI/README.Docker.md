# Docker Setup for Event Booking API

This document provides comprehensive instructions for running the Event Booking API using Docker.

## Prerequisites

- Docker Desktop or Docker Engine
- Docker Compose
- Git

## Quick Start

### 1. Clone and Setup

```bash
git clone <your-repo-url>
cd EventBookingAPI
cp .env.example .env
```

### 2. Configure Environment Variables

Edit the `.env` file with your actual values:

```bash
# Update these with your actual credentials
STRIPE_SECRET_KEY=sk_test_your_actual_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_stripe_publishable_key
SENDGRID_API_KEY=your_actual_sendgrid_api_key
SENDGRID_FROM_EMAIL=your_actual_email@domain.com
JWT_KEY=your-super-secret-jwt-key-minimum-32-characters
```

### 3. Run the Application

#### Production Environment
```bash
# Using script (recommended)
./scripts/docker-run.sh

# Or manually
docker-compose up --build -d
```

#### Development Environment
```bash
# Using script (recommended)
./scripts/docker-run.sh dev

# Or manually
docker-compose -f docker-compose.dev.yml up --build -d
```

## Services

### Production Environment

| Service | Port | Description |
|---------|------|-------------|
| Nginx | 80, 443 | Reverse proxy and load balancer |
| API | 8080 | Event Booking API (direct access) |
| PostgreSQL | 5432 | Main database |
| Redis | 6379 | Caching and SignalR backplane |

### Development Environment

| Service | Port | Description |
|---------|------|-------------|
| API | 5000 | Event Booking API with hot reload |
| PostgreSQL | 5433 | Development database |
| Redis | 6380 | Development Redis |

## Database Migrations

### Run Migrations

```bash
# Production
./scripts/docker-migrate.sh

# Development
./scripts/docker-migrate.sh dev
```

### Manual Migration Commands

```bash
# Production
docker-compose exec api dotnet ef database update

# Development
docker-compose -f docker-compose.dev.yml exec api-dev dotnet ef database update
```

## Useful Commands

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f api
docker-compose logs -f postgres
```

### Stop Services
```bash
# Production
docker-compose down

# Development
docker-compose -f docker-compose.dev.yml down

# Stop and remove volumes (WARNING: This will delete data)
docker-compose down -v
```

### Build Images
```bash
# Build all images
./scripts/docker-build.sh

# Build with version tag
./scripts/docker-build.sh v1.0.0
```

### Access Database
```bash
# Production
docker-compose exec postgres psql -U eventuser -d eventbookingdb

# Development
docker-compose -f docker-compose.dev.yml exec postgres-dev psql -U devuser -d eventbookingdb_dev
```

### Access Redis
```bash
# Production
docker-compose exec redis redis-cli

# Development
docker-compose -f docker-compose.dev.yml exec redis-dev redis-cli
```

## Health Checks

The application includes health checks for all services:

- **API Health**: `http://localhost:8080/health`
- **Database Health**: Automatic PostgreSQL health check
- **Redis Health**: Automatic Redis ping check

## SSL/HTTPS Setup

To enable HTTPS in production:

1. Place your SSL certificates in `nginx/ssl/`:
   - `cert.pem` - SSL certificate
   - `key.pem` - Private key

2. Uncomment the HTTPS server block in `nginx/nginx.conf`

3. Restart the services:
   ```bash
   docker-compose restart nginx
   ```

## Scaling

### Scale API Instances
```bash
docker-compose up --scale api=3 -d
```

### Load Balancing
The Nginx configuration automatically load balances between multiple API instances.

## Monitoring

### Container Stats
```bash
docker stats
```

### Service Status
```bash
docker-compose ps
```

## Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Check what's using the port
   netstat -tulpn | grep :8080
   
   # Kill the process or change ports in docker-compose.yml
   ```

2. **Database Connection Issues**
   ```bash
   # Check if PostgreSQL is running
   docker-compose ps postgres
   
   # View PostgreSQL logs
   docker-compose logs postgres
   ```

3. **Migration Errors**
   ```bash
   # Reset database (WARNING: This will delete all data)
   docker-compose down -v
   docker-compose up -d postgres
   # Wait for PostgreSQL to start, then run migrations
   ./scripts/docker-migrate.sh
   ```

4. **Permission Issues on Linux/Mac**
   ```bash
   # Make scripts executable
   chmod +x scripts/*.sh
   ```

### Reset Everything
```bash
# Stop all services and remove volumes
docker-compose down -v

# Remove all images
docker rmi $(docker images -q eventbooking-*)

# Start fresh
./scripts/docker-run.sh
```

## Environment Variables Reference

| Variable | Description | Default |
|----------|-------------|---------|
| `POSTGRES_DB` | Database name | eventbookingdb |
| `POSTGRES_USER` | Database user | eventuser |
| `POSTGRES_PASSWORD` | Database password | eventpass123 |
| `JWT_KEY` | JWT signing key | Required |
| `STRIPE_SECRET_KEY` | Stripe secret key | Required |
| `STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | Required |
| `SENDGRID_API_KEY` | SendGrid API key | Required |
| `SENDGRID_FROM_EMAIL` | SendGrid from email | Required |
| `ASPNETCORE_ENVIRONMENT` | ASP.NET Core environment | Production |

## Security Considerations

1. **Change Default Passwords**: Update all default passwords in production
2. **Use Secrets Management**: Consider using Docker secrets for sensitive data
3. **Network Security**: Use custom networks and limit exposed ports
4. **SSL/TLS**: Always use HTTPS in production
5. **Regular Updates**: Keep base images updated

## Performance Optimization

1. **Multi-stage Builds**: Dockerfiles use multi-stage builds for smaller images
2. **Layer Caching**: Optimize Dockerfile layer order for better caching
3. **Resource Limits**: Set appropriate CPU and memory limits
4. **Connection Pooling**: Configure database connection pooling
5. **Redis Caching**: Utilize Redis for caching and session storage