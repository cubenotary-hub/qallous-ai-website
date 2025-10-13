# Deploying Sage CEO to qallous.ai

## Complete Deployment Guide

This guide walks through deploying the complete Sage CEO system to your qallous.ai domain.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  https://qallous.ai (Website - GitHub Pages)          │
│                                                         │
│  ┌───────────────────────────────────────────┐        │
│  │ CEO Partnership Page                      │        │
│  │ - CEO chat interface                      │        │
│  │ - Voice integration (Retell AI)           │        │
│  │ - Dashboard: /ceo/dashboard.html          │        │
│  └───────────────────────────────────────────┘        │
│                    ↓ API Calls                        │
└────────────────────┼──────────────────────────────────┘
                     ↓
┌────────────────────┼──────────────────────────────────┐
│                    ↓                                   │
│  https://sage.qallous.ai (API Server)                │
│                                                        │
│  ┌──────────────────────────────────────────┐        │
│  │ Sage CEO RAG System                      │        │
│  │ - FastAPI on port 8000                   │        │
│  │ - ChromaDB vector database               │        │
│  │ - 246 knowledge chunks                   │        │
│  └──────────────────────────────────────────┘        │
│                    ↓ API Calls                        │
└────────────────────┼──────────────────────────────────┘
                     ↓
            ┌────────┴────────┐
            │  OpenAI API     │
            │  - GPT-4        │
            │  - Embeddings   │
            └─────────────────┘
```

---

## Deployment Plan

### Phase 1: Deploy Sage Backend (2-3 hours)

#### Option A: Cloud Server (Recommended)

**Services to Consider:**
- **DigitalOcean Droplet:** $6/month (basic)
- **AWS EC2:** t3.small ($15/month)
- **Google Cloud Compute:** e2-small ($13/month)
- **Linode:** Nanode ($5/month)

**Steps:**

1. **Create Server**
   ```bash
   # Launch Ubuntu 22.04 server
   # Get server IP: e.g., 123.45.67.89
   ```

2. **SSH and Setup**
   ```bash
   ssh root@YOUR_SERVER_IP
   
   # Update system
   apt update && apt upgrade -y
   
   # Install Python
   apt install python3 python3-pip python3-venv -y
   
   # Create app directory
   mkdir /opt/sage-ceo
   cd /opt/sage-ceo
   ```

3. **Transfer Sage System**
   ```bash
   # From your local machine:
   scp /tmp/sage-ceo-rag-READY.tar.gz root@YOUR_SERVER_IP:/opt/sage-ceo/
   
   # On server:
   cd /opt/sage-ceo
   tar -xzf sage-ceo-rag-READY.tar.gz
   cd sage-ceo-rag
   ```

4. **Install Dependencies**
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```

5. **Configure Environment**
   ```bash
   # Edit .env file
   nano .env
   
   # Add your API key (it's already there from the archive)
   OPENAI_API_KEY=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
   ```

6. **Create systemd Service** (Run as daemon)
   ```bash
   nano /etc/systemd/system/sage-ceo.service
   ```
   
   **Content:**
   ```ini
   [Unit]
   Description=Sage CEO RAG API Server
   After=network.target

   [Service]
   Type=simple
   User=root
   WorkingDirectory=/opt/sage-ceo/sage-ceo-rag
   Environment="PATH=/opt/sage-ceo/sage-ceo-rag/venv/bin"
   EnvironmentFile=/opt/sage-ceo/sage-ceo-rag/.env
   ExecStart=/opt/sage-ceo/sage-ceo-rag/venv/bin/python3 -m api.main --host 0.0.0.0 --port 8000
   Restart=always

   [Install]
   WantedBy=multi-user.target
   ```

7. **Start Service**
   ```bash
   systemctl daemon-reload
   systemctl enable sage-ceo
   systemctl start sage-ceo
   
   # Check status
   systemctl status sage-ceo
   
   # View logs
   journalctl -u sage-ceo -f
   ```

8. **Install Nginx (Reverse Proxy)**
   ```bash
   apt install nginx -y
   ```
   
   **Configure Nginx:**
   ```bash
   nano /etc/nginx/sites-available/sage-ceo
   ```
   
   **Content:**
   ```nginx
   server {
       listen 80;
       server_name sage.qallous.ai api.qallous.ai;

       location / {
           proxy_pass http://localhost:8000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           
           # CORS headers
           add_header 'Access-Control-Allow-Origin' 'https://qallous.ai' always;
           add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS' always;
           add_header 'Access-Control-Allow-Headers' 'Content-Type, Authorization' always;
       }
   }
   ```
   
   **Enable and restart:**
   ```bash
   ln -s /etc/nginx/sites-available/sage-ceo /etc/nginx/sites-enabled/
   nginx -t
   systemctl restart nginx
   ```

9. **Install SSL Certificate** (Let's Encrypt)
   ```bash
   apt install certbot python3-certbot-nginx -y
   certbot --nginx -d sage.qallous.ai
   
   # Or for api subdomain:
   certbot --nginx -d api.qallous.ai
   ```

10. **Test Backend**
    ```bash
    curl https://sage.qallous.ai/health
    # Should return: {"status":"healthy","vector_store_chunks":246,"version":"1.0.0"}
    ```

---

### Phase 2: Configure DNS (15 minutes)

**In your domain registrar (GoDaddy for qallous.ai):**

#### For Website (GitHub Pages):
```
Type: A
Host: @
Value: 185.199.108.153
TTL: 3600

Type: A
Host: @
Value: 185.199.109.153

Type: A
Host: @
Value: 185.199.110.153

Type: A
Host: @
Value: 185.199.111.153

Type: CNAME
Host: www
Value: cubenotary-hub.github.io
```

#### For Sage API:
```
Type: A
Host: sage  (or api)
Value: YOUR_SERVER_IP
TTL: 3600
```

**Wait 5-60 minutes for DNS propagation**

---

### Phase 3: Update Website (10 minutes)

1. **Update API Configuration**
   
   **File:** `/tmp/qallous-ai-website/index.html` (line ~2631)
   
   **Change:**
   ```javascript
   const API_CONFIG = {
       baseURL: 'https://sage.qallous.ai',  // Production API URL
       endpoints: {
           health: '/health',
           voiceProcess: '/api/ceo-advice',  // Updated endpoint
           // ... keep other endpoints as is
       }
   };
   ```

2. **Commit and Push to GitHub**
   ```bash
   cd /tmp/qallous-ai-website
   
   git add .
   git commit -m "Integrate Sage CEO backend

   - Add /ceo folder with dashboard and docs
   - Update API configuration to point to sage.qallous.ai
   - Add deployment guides"
   
   git push origin main
   ```

3. **Enable GitHub Pages**
   - Go to: https://github.com/cubenotary-hub/qallous-ai-website/settings/pages
   - Source: Deploy from main branch
   - Custom domain: qallous.ai
   - Enforce HTTPS: ✅

---

### Phase 4: Testing (30 minutes)

#### Test Backend:
```bash
# Health check
curl https://sage.qallous.ai/health

# CEO advice
curl -X POST "https://sage.qallous.ai/api/ceo-advice" \
  -H "Content-Type: application/json" \
  -d '{"user_query": "How do I handle a crisis?"}'
```

#### Test Website:
1. Visit: https://qallous.ai
2. Navigate to CEO Partnership section
3. Try the AI chat feature
4. Verify it connects to Sage backend

#### Test Dashboard:
1. Visit: https://qallous.ai/ceo/dashboard.html
2. Verify metrics load
3. Check real-time updates

---

## URL Structure (Final)

```
https://qallous.ai/                      → Main website
https://qallous.ai/ceo/dashboard.html    → Sage analytics dashboard
https://sage.qallous.ai/                 → Sage API root
https://sage.qallous.ai/docs             → API documentation
https://sage.qallous.ai/health           → Health check
https://sage.qallous.ai/api/ceo-advice   → Main endpoint
```

---

## Monitoring & Maintenance

### Monitor Sage Backend:
```bash
# Server logs
journalctl -u sage-ceo -f

# Nginx logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# Sage application logs
tail -f /opt/sage-ceo/sage-ceo-rag/server.log
```

### Monitor OpenAI Usage:
- Dashboard: https://platform.openai.com/usage
- Set usage alerts to avoid surprises

### Monitor Website:
- GitHub Pages: https://github.com/cubenotary-hub/qallous-ai-website/deployments
- SSL Certificate: Auto-renews via certbot

---

## Costs Estimate

### Infrastructure:
- Server (DigitalOcean): $6-15/month
- Domain (GoDaddy): Already owned
- SSL Certificate: FREE (Let's Encrypt)
- GitHub Pages: FREE

### API Usage (Variable):
- OpenAI API: ~$0.002 per query (depends on usage)
- Estimated: $50-200/month (depending on query volume)

**Total: ~$60-220/month**

---

## Rollback Plan

If something goes wrong:

```bash
# Rollback website
cd /tmp/qallous-ai-website
git revert HEAD
git push

# Restart Sage service
ssh root@YOUR_SERVER_IP
systemctl restart sage-ceo

# Check logs
journalctl -u sage-ceo -f
```

---

## Success Criteria

✅ https://qallous.ai loads and displays correctly  
✅ https://qallous.ai/ceo/dashboard.html shows metrics  
✅ https://sage.qallous.ai/health returns healthy status  
✅ CEO chat feature on website connects to Sage API  
✅ Queries return CEO-level advice in <2 seconds  
✅ SSL certificates valid (HTTPS working)  

---

## Support

**Documentation:**
- Website Repo: github.com/cubenotary-hub/qallous-ai-website
- Sage Repo: github.com/cubenotary-hub/sage-ceo-rag
- This file: qallous-ai-website/ceo/DEPLOYMENT.md

**Logs:**
- Sage API: `journalctl -u sage-ceo`
- Nginx: `/var/log/nginx/`
- Website: GitHub Pages deployment logs

---

**Ready to deploy! Follow the phases above to go live on qallous.ai**

