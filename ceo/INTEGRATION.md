# Integrating Sage CEO into Qallous AI Website

## Overview

This guide integrates the Sage CEO RAG backend with the Qallous AI website's CEO + Strategic Advisor AI partnership feature.

---

## Architecture

```
qallous.ai Website (Frontend)
    ↓
API Gateway / Subdomain (api.qallous.ai or sage.qallous.ai)
    ↓
Sage CEO RAG Backend (FastAPI on port 8000)
    ↓
OpenAI API (GPT-4 + Embeddings)
```

---

## Integration Points

### 1. Website API Configuration

**File:** `index.html` (line ~2631)

**Current:**
```javascript
const API_CONFIG = {
    baseURL: 'http://localhost:8000',  // Local development
    endpoints: {
        voiceProcess: '/api/voice/process',
        // ... other endpoints
    }
};
```

**For Production:**
```javascript
const API_CONFIG = {
    baseURL: 'https://api.qallous.ai',  // Production API
    endpoints: {
        voiceProcess: '/api/ceo-advice',  // Map to Sage endpoint
        health: '/health',
        // ... other endpoints
    }
};
```

---

### 2. Endpoint Mapping

Map Qallous website calls to Sage CEO endpoints:

| Qallous Frontend | Sage Backend | Purpose |
|-----------------|--------------|---------|
| `/api/voice/process` | `/api/ceo-advice` | Main CEO advice endpoint |
| `/api/voice/stream` | `/api/ceo-advice-stream` | Streaming for voice |
| `/health` | `/health` | Health check |
| `/api/stats` | `/api/stats` | Knowledge base stats |

---

### 3. Request/Response Format

#### Frontend Request (from Qallous):
```javascript
{
  voice_input: "How do I prepare for an IPO?",
  user_id: "user123",
  session_id: "session456"
}
```

#### Backend Request (to Sage):
```json
{
  "user_query": "How do I prepare for an IPO?",
  "conversation_context": [],
  "user_context": {
    "industry": "technology",
    "seniority_level": "ceo"
  }
}
```

#### Transformation Layer Needed:
Create an adapter API that translates between Qallous format and Sage format.

---

## Deployment Options

### Option 1: Subdomain (Recommended)
```
Website: https://qallous.ai (frontend)
API: https://sage.qallous.ai or https://api.qallous.ai (Sage backend)
```

**DNS Configuration:**
- `qallous.ai` → GitHub Pages (website)
- `sage.qallous.ai` → Your server running Sage
- Or `api.qallous.ai` → Your server

### Option 2: Same Server
```
Website + API on same server
- Static files at /var/www/qallous.ai
- API at /api/* (reverse proxy to Sage)
```

### Option 3: Serverless
```
Website: GitHub Pages / Vercel
API: AWS Lambda / Google Cloud Run
```

---

## Step-by-Step Integration

### Step 1: Deploy Sage Backend

**Option A: AWS EC2**
```bash
# 1. Launch EC2 instance (Ubuntu)
# 2. SSH to instance
ssh ubuntu@your-ec2-instance

# 3. Copy Sage system
scp sage-ceo-rag-READY.tar.gz ubuntu@your-instance:/opt/
ssh ubuntu@your-instance
cd /opt
tar -xzf sage-ceo-rag-READY.tar.gz

# 4. Install dependencies
cd sage-ceo-rag
sudo apt update && sudo apt install python3-pip
pip3 install -r requirements.txt

# 5. Start server
./start_server.sh
```

**Option B: Docker**
```bash
# 1. Build image
cd /tmp/sage-ceo-rag
docker build -t sage-ceo-rag .

# 2. Run container
docker run -d -p 8000:8000 \
  -e OPENAI_API_KEY="your-key" \
  sage-ceo-rag

# 3. Deploy to cloud (AWS ECS, Google Cloud Run, etc.)
```

---

### Step 2: Configure DNS

**Add DNS Records:**

For `sage.qallous.ai` pointing to your Sage server:
```
Type: A
Name: sage
Value: YOUR_SERVER_IP
TTL: 3600
```

Or for API subdomain:
```
Type: A
Name: api
Value: YOUR_SERVER_IP
TTL: 3600
```

---

### Step 3: Update Website Configuration

**File:** `qallous-ai-website/index.html`

**Change line ~2631:**
```javascript
const API_CONFIG = {
    baseURL: 'https://sage.qallous.ai',  // Or 'https://api.qallous.ai'
    endpoints: {
        // ...
    }
};
```

---

### Step 4: Create API Adapter (Optional)

If you want to keep the website's API format, create an adapter:

**File:** `sage-ceo-rag/api/adapter.py`
```python
@app.post("/api/voice/process")
async def voice_process_adapter(request: VoiceRequest):
    # Transform Qallous format to Sage format
    sage_request = {
        "user_query": request.voice_input,
        "user_context": {
            "industry": request.get("industry", "general"),
            "seniority_level": "ceo"
        }
    }
    
    # Call Sage's endpoint
    response = await get_ceo_advice(sage_request)
    
    # Transform back to Qallous format
    return {
        "success": True,
        "response": response.response,
        "confidence": response.confidence
    }
```

---

### Step 5: Deploy Website to qallous.ai

**Using GitHub Pages:**

1. **Add CNAME file:**
```bash
echo "qallous.ai" > /tmp/qallous-ai-website/CNAME
```

2. **Configure GitHub Pages:**
   - Go to repository settings
   - Enable GitHub Pages from main branch
   - Set custom domain: qallous.ai

3. **Configure DNS for website:**
```
Type: A
Name: @
Value: 185.199.108.153
Value: 185.199.109.153
Value: 185.199.110.153
Value: 185.199.111.153

Type: CNAME
Name: www
Value: cubenotary-hub.github.io
```

---

## Testing the Integration

### 1. Test Sage Backend Locally
```bash
curl http://localhost:8000/health
```

### 2. Test from Website
Open `index.html` in browser, use CEO chat feature

### 3. Test on Production
```bash
curl https://sage.qallous.ai/health
```

---

## Dashboard Access

**Dashboard URL:**
```
https://qallous.ai/ceo/dashboard.html
```

**Features:**
- Real-time query analytics
- Performance metrics
- Success tracking
- Topic distribution
- User satisfaction scores

---

## Security Considerations

1. **API Key:** Store in environment variables, never in frontend code
2. **Rate Limiting:** Implement to prevent abuse
3. **Authentication:** Add API key auth for production
4. **CORS:** Configure allowed origins
5. **HTTPS:** Required for production (Let's Encrypt for free SSL)

---

## Monitoring

**Sage Dashboard:** https://qallous.ai/ceo/dashboard.html
**API Health:** https://sage.qallous.ai/health
**OpenAI Usage:** https://platform.openai.com/usage

---

## Next Steps

1. ✅ Create `/ceo` folder in qallous-ai-website
2. ✅ Add Sage dashboard
3. ✅ Add integration documentation
4. ⏳ Deploy Sage backend to cloud
5. ⏳ Configure DNS
6. ⏳ Update website API configuration
7. ⏳ Push to GitHub
8. ⏳ Deploy website to qallous.ai

---

**Integration Status:** Ready for deployment
**Repository:** github.com/cubenotary-hub/qallous-ai-website

