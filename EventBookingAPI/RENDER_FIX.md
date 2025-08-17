# 🚨 Render Deployment Fix

Your API is deployed at `https://bookmyseat-gm9o.onrender.com` but has a JWT key format error.

## 🔧 Quick Fix

### 1. Generate Proper JWT Key

Run this command to generate a proper Base64 JWT key

```bash
# Generate secure Base64 key
openssl rand -base64 32

# Or use the script
chmod +x scripts/generate-jwt-key.sh
./scripts/generate-jwt-key.sh
```

### 2. Update Environment Variable in Render

1. Go to your Render dashboard
2. Select your `bookmyseat` service
3. Go to **Environment** tab
4. Update the `JWT_KEY` variable with the new Base64 key
5. Click **Save Changes**

### 3. Alternative: Use String Key

If you prefer to keep your current key, the code now supports both formats:
- Base64 keys (recommended for production)
- Plain string keys (for development)

## 🎯 Current Status

✅ **Service is running** on port 10000
✅ **Code fix applied** - supports both Base64 and string keys
❌ **JWT key format issue** - needs proper Base64 key

## 🔑 Recommended JWT Key

Use this format in Render environment variables:

```
JWT_KEY=<base64-encoded-32-byte-key>
```

Example (generate your own):
```bash
openssl rand -base64 32
# Output: something like "Kj4KfmvqDGPSf7C5HAbiGmTAzx2b2/zfl9xRFc8GE="
```

## 🚀 After Fix

Once you update the JWT key:
1. Render will automatically redeploy
2. The Base64 error will be resolved
3. Your API will be fully functional

## 🔍 Test Your API

After the fix, test these endpoints:
- **Health Check:** https://bookmyseat-gm9o.onrender.com/health
- **Swagger:** https://bookmyseat-gm9o.onrender.com/swagger

## 📝 Code Changes Made

Updated `Program.cs` to handle both Base64 and string JWT keys:

```csharp
IssuerSigningKey = new SymmetricSecurityKey(
    IsBase64String(key) ? Convert.FromBase64String(key) : Encoding.UTF8.GetBytes(key)
)
```

This ensures compatibility with different key formats while maintaining security.