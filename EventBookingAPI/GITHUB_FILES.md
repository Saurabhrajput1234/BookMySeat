# GitHub Repository Files Guide

## ✅ FILES TO PUSH TO GITHUB

### Core Application Files
- `Program.cs`
- `EventBookingAPI.csproj`
- `appsettings.json` (with placeholder values)
- `appsettings.Development.json` (with placeholder values)
- All source code files (`.cs` files)
- Controllers, Models, Services, etc.

### Docker Configuration
- `Dockerfile`
- `Dockerfile.dev`
- `docker-compose.yml`
- `docker-compose.dev.yml`
- `.dockerignore`

### Environment Template
- `.env.example` (template with placeholder values)

### Scripts
- `scripts/docker-build.sh`
- `scripts/docker-run.sh`
- `scripts/docker-migrate.sh`
- `scripts/setup-env.sh`

### Configuration Files
- `nginx/nginx.conf`
- `init-db/01-init.sql`

### Documentation
- `README.md`
- `README.Docker.md`
- `GITHUB_FILES.md` (this file)

### Project Files
- `.gitignore`
- Any other documentation or configuration files

## ❌ FILES NOT TO PUSH TO GITHUB (Already in .gitignore)

### Environment Files with Real Credentials
- `.env` (contains real credentials)
- `.env.production` (contains real credentials)
- `.env.development` (contains real credentials)
- `.env.local`
- `.env.staging`
- `.env.test`

### Build Artifacts
- `bin/` folder
- `obj/` folder
- `Debug/` folder
- `Release/` folder
- `*.dll`, `*.exe`, `*.pdb` files

### IDE Files
- `.vs/` (Visual Studio)
- `.vscode/` (VS Code settings - optional)
- `.idea/` (JetBrains Rider)
- `*.user` files
- `*.suo` files

### Database Files
- `*.db`, `*.sqlite`, `*.sqlite3`
- Local database files
- Migration files (if auto-generated)

### SSL Certificates
- `nginx/ssl/` folder
- `*.pem`, `*.key`, `*.crt` files
- Any certificate files

### Docker Data
- `volumes/` folder
- `data/` folder
- Docker volume data

### Logs and Temporary Files
- `logs/` folder
- `*.log` files
- `*.tmp`, `*.temp` files
- `*.cache` files

### OS Files
- `.DS_Store` (Mac)
- `Thumbs.db` (Windows)
- `Desktop.ini` (Windows)

## 🔒 SECURITY NOTES

### Never Push These:
1. **Real API Keys** (Stripe, SendGrid, etc.)
2. **Database Passwords**
3. **JWT Secret Keys**
4. **SSL Certificates**
5. **Any file with real credentials**

### Safe to Push:
1. **Template files** (`.env.example`)
2. **Configuration with placeholders**
3. **Docker setup files**
4. **Documentation**
5. **Source code** (without secrets)

## 📝 BEFORE PUSHING TO GITHUB

1. **Check .env.example** - Ensure it has placeholder values only
2. **Verify .gitignore** - Make sure sensitive files are excluded
3. **Review appsettings.json** - Should have placeholder connection strings
4. **Test locally** - Ensure the setup works with template files
5. **Documentation** - Update README files if needed

## 🚀 REPOSITORY SETUP

```bash
# Initialize git repository
git init

# Add all safe files
git add .

# Check what will be committed (should not include .env files with real data)
git status

# Commit
git commit -m "Initial commit: Event Booking API with Docker setup"

# Add remote repository
git remote add origin https://github.com/yourusername/EventBookingAPI.git

# Push to GitHub
git push -u origin main
```

## 📋 CHECKLIST BEFORE PUSH

- [ ] `.env.example` has placeholder values only
- [ ] Real `.env` files are in `.gitignore`
- [ ] No real API keys in any committed files
- [ ] `appsettings.json` has placeholder connection strings
- [ ] Documentation is up to date
- [ ] Docker files are properly configured
- [ ] Scripts are executable and documented