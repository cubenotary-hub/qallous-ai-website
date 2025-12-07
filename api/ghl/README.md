# GoHighLevel API Proxy - Setup Guide

This secure serverless function proxies GoHighLevel API calls, keeping your API key safe on the server side.

## 🔒 Security Benefits

- ✅ API key never exposed to frontend
- ✅ Server-side validation and sanitization
- ✅ Rate limiting ready (can be added)
- ✅ Error handling without exposing sensitive info

## 📋 Setup Instructions

### 1. Set Environment Variables in Vercel

Go to your Vercel project:
1. **Settings** → **Environment Variables**
2. Add these variables:

```
GHL_API_KEY=your_go_high_level_api_key_here
GHL_WEBHOOK_URL=https://services.leadconnectorhq.com/hooks/your-webhook (optional)
```

### 2. Deploy

The function will automatically deploy with your next push to main branch.

### 3. Test

After deployment, test the endpoint:

```javascript
// Test from browser console or fetch
fetch('/api/ghl/contact', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'test@example.com',
    name: 'Test User',
    company: 'Test Company',
    demo_type: 'Voice AI Receptionist',
    message: 'Test message'
  })
})
.then(r => r.json())
.then(console.log)
.catch(console.error);
```

## 📡 API Endpoint

**URL**: `/api/ghl/contact`  
**Method**: `POST`  
**Content-Type**: `application/json`

### Request Body:
```json
{
  "email": "user@example.com",
  "name": "User Name",
  "company": "Company Name",
  "demo_type": "Voice AI Receptionist",
  "lead_type": "Demo Request",
  "message": "Additional information",
  "source": "qallous.ai"
}
```

### Response:
```json
{
  "success": true,
  "webhook": true,
  "contact": {
    "id": "contact_id"
  }
}
```

## 🔧 How It Works

1. Frontend sends lead data to `/api/ghl/contact`
2. Serverless function receives request
3. Function uses secure API key from environment variable
4. Function creates contact in GoHighLevel
5. Function also triggers webhook (if configured)
6. Success/failure response sent back to frontend

## 🚨 IMPORTANT

- **Never** commit API keys to git
- **Always** use environment variables
- **Rotate** API keys if exposed
- **Monitor** API usage for abuse

## 📝 Notes

- The webhook URL is optional - API contact creation will still work without it
- Errors are logged server-side but don't expose sensitive information to client
- CORS is configured to allow requests from your domain

