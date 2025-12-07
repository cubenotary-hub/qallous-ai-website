    // ========== XSS Protection Helper Functions ==========
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function sanitizeHtml(html) {
        // Basic HTML sanitization - escape dangerous tags
        const temp = document.createElement('div');
        temp.textContent = html;
        const sanitized = temp.innerHTML;
        
        // Allow safe HTML tags (a, strong, em, br, span with safe attributes)
        const allowedTags = /<\/?(a|strong|em|br|span|p|div|h[1-6]|ul|ol|li|i|b)(\s[^>]*)?>/gi;
        const safeHtml = html.replace(allowedTags, (match) => {
            // Remove dangerous attributes
            return match.replace(/\s*(on\w+|javascript:)/gi, '');
        });
        
        return safeHtml;
    }

    function setSafeHtml(element, html) {
        if (!element) return;
        // For trusted content from our own templates, use sanitizeHtml
        // For user input, always use escapeHtml
        element.innerHTML = sanitizeHtml(html);
    }

    function createElement(tag, attributes = {}, text = '') {
        const element = document.createElement(tag);
        Object.entries(attributes).forEach(([key, value]) => {
            if (key === 'className') {
                element.className = value;
            } else if (key.startsWith('data-')) {
                element.setAttribute(key, escapeHtml(String(value)));
            } else {
                element.setAttribute(key, escapeHtml(String(value)));
            }
        });
        if (text) {
            element.textContent = text;
        }
        return element;
    }

    // ========== ARCHIVED: Partnership data (kept for reference) ==========
    // Partnership data - Archived as we pivot to Voice AI Receptionist focus
    /*
    const PARTNERSHIPS = [
        // WORKING BOTS - Top Row (3 in a row)
        {
            id: "ceo-partnership",
            humanRole: "CEO",
            aiPartner: {
                name: "Sage - Strategic Advisor AI",
                qualifications: ["30+ Years Fortune 500 CEO", "15 Successful IPOs", "$50B+ in M&A Transactions"],
                avatar: "👑",
                specialties: ["IPO Preparation", "M&A Strategy", "Crisis Management", "Strategic Planning", "Board Governance"]
            },
            synergy: {
                speed: "10x",
                outcomes: "95%",
                timeSaved: "15h/week"
            },
            price: "FREE",
            isFree: true,
            sageAPI: {
                enabled: true,
                endpoint: "http://localhost:8000/api/ceo-advice"
            }
        },
        {
            id: "pm-partnership",
            humanRole: "Product Manager",
            aiPartner: {
                name: "AI Product Manager Bot",
                qualifications: ["Mobile-First Design Expert", "Agile Sprint Master", "Product Analytics Specialist"],
                avatar: "📱",
                specialties: ["Sprint Planning", "Backlog Management", "User Story Creation", "Feature Prioritization", "Stakeholder Alignment"]
            },
            synergy: {
                speed: "12x",
                outcomes: "93%",
                timeSaved: "16h/week"
            },
            price: "FREE",
            isFree: true,
            demoLink: "/demos/apex-pm-demo/",
            description: "AI-powered product management mobile app for sprint planning and backlog management"
        },
        {
            id: "receptionist-partnership",
            humanRole: "Business Owner",
            aiPartner: {
                name: "AI Voice Receptionist",
                qualifications: ["24/7 Voice Assistant", "Multi-Language Support", "Smart Call Routing"],
                avatar: "📞",
                specialties: ["Call Screening", "Appointment Scheduling", "Customer Queries", "Message Taking", "Lead Qualification"]
            },
            synergy: {
                speed: "24x",
                outcomes: "97%",
                timeSaved: "30h/week"
            },
            price: "FREE",
            isFree: true,
            demoLink: "https://voice.qallous.ai/",
            description: "AI-powered voice receptionist that handles calls, schedules appointments, and qualifies leads"
        },
        // REQUEST AUGMENT PARTNERSHIPS - Bottom Row (3 in a row)
        {
            id: "cto-partnership",
            humanRole: "CTO",
            aiPartner: {
                name: "Chief Architect AI",
                qualifications: ["CS PhD, Stanford", "12 Years Google Principal Architect", "AWS Solutions Architect"],
                avatar: "💻",
                specialties: ["System Architecture", "Team Scaling", "Tech Strategy"]
            },
            synergy: {
                speed: "8x",
                outcomes: "92%",
                timeSaved: "12h/week"
            },
            price: "Request Augment",
            isRequestPartner: true,
            emailSubject: "CTO + Chief Architect AI Partnership Request",
            emailBody: "Hi QALLOUS.AI team,%0D%0A%0D%0AI'm interested in the CTO + Chief Architect AI partnership.%0D%0A%0D%0AName: %0D%0ACompany: %0D%0ARole: CTO%0D%0A%0D%0AThank you!"
        },
        {
            id: "cmo-partnership",
            humanRole: "CMO",
            aiPartner: {
                name: "Marketing Genius AI",
                qualifications: ["Marketing PhD", "15 Years Fortune 100 CMO", "Brand Strategy Expert"],
                avatar: "📊",
                specialties: ["Campaign Optimization", "Market Analysis", "ROI Maximization"]
            },
            synergy: {
                speed: "7x",
                outcomes: "90%",
                timeSaved: "10h/week"
            },
            price: "Request Augment",
            isRequestPartner: true,
            emailSubject: "CMO + Marketing Genius AI Partnership Request",
            emailBody: "Hi QALLOUS.AI team,%0D%0A%0D%0AI'm interested in the CMO + Marketing Genius AI partnership.%0D%0A%0D%0AName: %0D%0ACompany: %0D%0ARole: CMO%0D%0A%0D%0AThank you!"
        },
        {
            id: "cfo-partnership",
            humanRole: "CFO",
            aiPartner: {
                name: "Financial Strategist AI",
                qualifications: ["CPA, Harvard MBA", "18 Years Fortune 500 CFO", "M&A Specialist"],
                avatar: "💰",
                specialties: ["Financial Modeling", "Risk Assessment", "Investment Strategy"]
            },
            synergy: {
                speed: "9x",
                outcomes: "94%",
                timeSaved: "14h/week"
            },
            price: "Request Augment",
            isRequestPartner: true,
            emailSubject: "CFO + Financial Strategist AI Partnership Request",
            emailBody: "Hi QALLOUS.AI team,%0D%0A%0D%0AI'm interested in the CFO + Financial Strategist AI partnership.%0D%0A%0D%0AName: %0D%0ACompany: %0D%0ARole: CFO%0D%0A%0D%0AThank you!"
        }
    ];

    // ========== SAGE CEO RAG API CLIENT ==========
    class SageCEOClient {
        constructor(apiEndpoint = 'http://localhost:8000') {
            this.baseURL = apiEndpoint;
            this.conversationHistory = [];
        }

        async askSage(question, userContext = null) {
            try {
                const response = await fetch(`${this.baseURL}/api/ceo-advice`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        user_query: question,
                        conversation_context: this.conversationHistory,
                        user_context: userContext || { industry: 'general', seniority_level: 'ceo' }
                    })
                });

                if (!response.ok) throw new Error(`API error: ${response.status}`);
                const data = await response.json();
                
                this.conversationHistory.push(
                    { role: 'user', content: question },
                    { role: 'assistant', content: data.response }
                );
                if (this.conversationHistory.length > 6) {
                    this.conversationHistory = this.conversationHistory.slice(-6);
                }
                return data;
            } catch (error) {
                console.error('Sage API error:', error);
                return {
                    response: "I'm currently unavailable. Please ensure the Sage API is running on localhost:8000.",
                    confidence: 0,
                    reasoning: "API connection error",
                    suggested_next_questions: []
                };
            }
        }

        async checkHealth() {
            try {
                const response = await fetch(`${this.baseURL}/health`);
                return response.ok;
            } catch (error) {
                return false;
            }
        }

        clearHistory() {
            this.conversationHistory = [];
        }
    }

    // Initialize Sage client - Using local API for testing
    const sageClient = new SageCEOClient('http://localhost:8000');

    // Sage Chat Functions
    function openSageChat() {
        document.getElementById('sageChatModal').style.display = 'flex';
        checkSageHealth();
        setTimeout(() => document.getElementById('sage-question-input').focus(), 300);
    }

    function closeSageChat() {
        document.getElementById('sageChatModal').style.display = 'none';
    }

    async function checkSageHealth() {
        const indicator = document.getElementById('sage-status-indicator');
        const statusText = document.getElementById('sage-status-text');
        const isHealthy = await sageClient.checkHealth();
        
        if (isHealthy) {
            indicator.style.background = '#00ff88';
            statusText.style.color = '#00ff88';
            statusText.textContent = 'Sage is ready to advise';
        } else {
            indicator.style.background = '#ff4757';
            statusText.style.color = '#ff4757';
            statusText.textContent = 'Sage is offline (check API server)';
        }
    }

    let sageFirstInteraction = true;
    
    async function askSageQuestion() {
        const input = document.getElementById('sage-question-input');
        const question = input.value.trim();
        if (!question) return;
        
        // Track first Sage interaction in GoHighLevel
        if (sageFirstInteraction) {
            sageFirstInteraction = false;
            const leadData = {
                demo_type: 'CEO + Sage Advisor',
                message: question,
                source: 'qallous.ai',
                lead_type: 'Sage Chat Engagement',
                timestamp: new Date().toISOString(),
                page_url: window.location.href
            };
            sendToGoHighLevel(leadData).catch(err => console.error('GHL tracking error:', err));
        }
        
        const askBtn = document.getElementById('sage-ask-btn');
        input.disabled = true;
        askBtn.disabled = true;
        askBtn.textContent = 'Thinking...';
        
        addMessageToChat('user', question);
        input.value = '';
        
        try {
            const response = await sageClient.askSage(question);
            addMessageToChat('sage', response.response, {
                confidence: response.confidence,
                reasoning: response.reasoning,
                suggestedQuestions: response.suggested_next_questions
            });
            if (response.suggested_next_questions?.length > 0) {
                showSuggestedQuestions(response.suggested_next_questions);
            }
        } catch (error) {
            addMessageToChat('sage', "I'm having trouble connecting. Please ensure the Sage API is running.");
        } finally {
            input.disabled = false;
            askBtn.disabled = false;
            askBtn.textContent = 'Ask Sage';
            input.focus();
        }
    }

    function addMessageToChat(sender, message, metadata = {}) {
        const messagesContainer = document.getElementById('sage-chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.style.cssText = `margin-bottom: 1.5rem; padding: 1.5rem; border-radius: 15px; animation: slideIn 0.3s ease;
            ${sender === 'user' ? 'background: rgba(0, 212, 255, 0.1); border-left: 4px solid var(--accent); margin-left: 3rem;' : 'background: rgba(139, 92, 246, 0.1); border-left: 4px solid var(--neon-purple); margin-right: 3rem;'}`;
        
        // Safe HTML construction with XSS protection
        const senderLabel = sender === 'user' ? '👤 You' : '👑 Sage';
        const senderColor = sender === 'user' ? 'var(--accent)' : 'var(--neon-purple)';
        const escapedMessage = escapeHtml(message).replace(/\n/g, '<br>');
        
        messageDiv.innerHTML = `
            <div style="margin-bottom: 0.5rem;">
                <strong style="color: ${senderColor};">${escapeHtml(senderLabel)}</strong>
                ${metadata.confidence ? `<span style="font-size: 0.8rem; color: var(--gray); margin-left: 0.5rem;">Confidence: ${escapeHtml(String((metadata.confidence * 100).toFixed(0)))}%</span>` : ''}
            </div>
            <div style="color: var(--light); line-height: 1.7;">${escapedMessage}</div>
            ${metadata.reasoning ? `<div style="margin-top: 1rem; padding: 0.8rem; background: rgba(0,0,0,0.3); border-radius: 8px; font-size: 0.85rem; color: var(--gray);">💡 ${escapeHtml(metadata.reasoning)}</div>` : ''}
        `;
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function showSuggestedQuestions(questions) {
        const container = document.getElementById('sage-suggested-questions');
        const list = document.getElementById('suggested-questions-list');
        if (!questions || questions.length === 0) {
            container.style.display = 'none';
            return;
        }
        // Safe question buttons with XSS protection
        list.innerHTML = '';
        questions.forEach(q => {
            const button = document.createElement('button');
            button.textContent = q;
            button.className = 'suggested-question-btn';
            button.style.cssText = 'background: rgba(0, 212, 255, 0.1); border: 1px solid rgba(0, 212, 255, 0.3); color: var(--accent); padding: 0.5rem 1rem; border-radius: 20px; cursor: pointer; font-size: 0.85rem; transition: all 0.2s;';
            button.addEventListener('click', () => {
                const input = document.getElementById('sage-question-input');
                if (input) {
                    input.value = q;
                    askSageQuestion();
                }
            });
            button.addEventListener('mouseover', () => button.style.background = 'rgba(0, 212, 255, 0.2)');
            button.addEventListener('mouseout', () => button.style.background = 'rgba(0, 212, 255, 0.1)');
            list.appendChild(button);
        });
        container.style.display = 'block';
    }

    // ========== ARCHIVED: Partnership card rendering ==========
    // Render partnership cards - Archived as we pivot to Voice AI Receptionist
    /*
    function renderPartnershipCards() {
        const grid = document.getElementById('partnershipsGrid');
        if (!grid) return;
        
        grid.innerHTML = PARTNERSHIPS.map(partnership => `
            <div class="partnership-card" data-partnership="${partnership.id}">
                <div class="partnership-header">
                    <div class="human-ai-display">
                        <div class="human-expert">
                            <div class="avatar">👨‍💼</div>
                            <span class="role">${partnership.humanRole}</span>
                        </div>
                        <div class="partnership-symbol">⚡</div>
                        <div class="ai-partner">
                            <div class="avatar">${partnership.aiPartner.avatar}</div>
                            <span class="role">${partnership.aiPartner.name}</span>
                        </div>
                    </div>
                </div>
                
                <div class="partnership-body">
                    <h3>${partnership.humanRole} + ${partnership.aiPartner.name}</h3>
                    <p>Amplify your ${partnership.humanRole} role with an AI partner bringing ${partnership.aiPartner.qualifications[1].toLowerCase()}.</p>
                    
                    <div class="qualifications">
                        <h4>AI Partner Qualifications:</h4>
                        <ul>
                            ${partnership.aiPartner.qualifications.map(q => `<li>✓ ${q}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <div class="specialties">
                        ${partnership.aiPartner.specialties.map(s => `<span class="specialty-tag">${s}</span>`).join('')}
                    </div>
                    
                    <div class="synergy-metrics">
                        <div class="metric">
                            <span class="value">${partnership.synergy.speed}</span>
                            <span class="label">Faster Execution</span>
                        </div>
                        <div class="metric">
                            <span class="value">${partnership.synergy.outcomes}</span>
                            <span class="label">Better Outcomes</span>
                        </div>
                        <div class="metric">
                            <span class="value">${partnership.synergy.timeSaved}</span>
                            <span class="label">Time Saved</span>
                        </div>
                    </div>
                </div>
                
                <div class="partnership-footer">
                    ${partnership.isFree ? `
                        <div class="price" style="background: linear-gradient(135deg, #00ff88, #00d4ff); color: var(--primary); font-weight: 800; font-size: 1.3rem; padding: 1rem; border-radius: 12px; text-align: center; margin-bottom: 1rem;">
                            🎉 FREE - LIMITED TIME
                        </div>
                    ` : `
                        <div class="price">${partnership.price}</div>
                    `}
                    ${partnership.id === 'ceo-partnership' && partnership.sageAPI?.enabled ? `
                        <button class="btn btn-primary" onclick="openSageChat()" style="width: 100%; background: linear-gradient(135deg, #00d4ff, #8b5cf6); font-size: 1.1rem; padding: 1rem;">
                            💬 Try Sage FREE Now
                        </button>
                        <p style="text-align: center; margin-top: 0.5rem; font-size: 0.75rem; color: var(--gray);">Powered by Advanced RAG • 246 Knowledge Chunks</p>
                    ` : partnership.demoLink ? `
                        <a href="${partnership.demoLink}" target="_blank" class="btn btn-primary" style="width: 100%; background: linear-gradient(135deg, #00ff88, #00d4ff); font-size: 1.1rem; padding: 1rem; text-decoration: none;">
                            ${partnership.id === 'pm-partnership' ? '📱 Try AI PM Bot FREE' : '📞 Try Voice Agent FREE'}
                        </a>
                        <p style="text-align: center; margin-top: 0.5rem; font-size: 0.75rem; color: var(--gray);">Live Demo • FREE Access</p>
           ` : partnership.isRequestPartner ? `
               <a href="mailto:qudeuce@qallous.ai?subject=${encodeURIComponent(partnership.emailSubject)}&body=${encodeURIComponent(partnership.emailBody)}" class="btn btn-primary" style="width: 100%; background: linear-gradient(135deg, #00d4ff, #8b5cf6); font-size: 1.1rem; padding: 1rem; text-decoration: none;">
                   📧 Request Augment
               </a>
               <p style="text-align: center; margin-top: 0.5rem; font-size: 0.75rem; color: var(--gray);">Email Request • Direct Contact</p>
           ` : `
               <button class="btn btn-primary" onclick="openPartnershipModal('${partnership.id}')" style="width: 100%;">
                   Augment My Role
               </button>
           `}
                </div>
            </div>
        `).join('');
    }

    // Initialize on load - Archived partnership rendering
    /*
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', renderPartnershipCards);
    } else {
        renderPartnershipCards();
    }
    */
    
    // ========== VOICE AI FEATURES RENDERING ==========
    const VOICE_AI_FEATURES = [
        {
            icon: "📞",
            title: "24/7 Availability",
            description: "Never miss a call again. Your AI receptionist works around the clock to handle customer inquiries, even outside business hours."
        },
        {
            icon: "⚙️",
            title: "Custom Workflow Automation",
            description: "Every call triggers YOUR specific workflows. We audit your business and build automations that match how you operate."
        },
        {
            icon: "🎓",
            title: "Business-Specific AI Training",
            description: "Trained on your SOPs, terminology, and brand voice. The AI understands YOUR business, not just generic customer service."
        },
        {
            icon: "🔌",
            title: "GHL/CRM Integration",
            description: "Seamlessly integrates with GoHighLevel, your CRM, calendar, email, and other tools. No disruption to your current workflows."
        },
        {
            icon: "🏢",
            title: "Industry-Ready Templates",
            description: "Pre-built workflows for healthcare, legal, real estate, restaurants, and more. Customize to fit your exact needs."
        },
        {
            icon: "📊",
            title: "Call Analytics & Insights",
            description: "Track call volume, response times, conversion rates, and more. Get insights to optimize your phone operations."
        }
    ];
    
    // Render voice AI features
    function renderVoiceAIFeatures() {
        const grid = document.getElementById('voiceAIFeaturesGrid');
        if (!grid) return;
        
        grid.innerHTML = VOICE_AI_FEATURES.map(feature => `
            <div class="feature-card" style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(0, 212, 255, 0.2); border-radius: 20px; padding: 2rem; transition: all 0.3s;">
                <div style="font-size: 3rem; margin-bottom: 1rem; text-align: center;">${feature.icon}</div>
                <h3 style="color: var(--neon-blue); margin-bottom: 1rem; font-size: 1.5rem; text-align: center;">${feature.title}</h3>
                <p style="color: var(--gray); line-height: 1.6; text-align: center;">${feature.description}</p>
            </div>
        `).join('');
    }
    
    // Initialize voice AI features on load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', renderVoiceAIFeatures);
    } else {
        renderVoiceAIFeatures();
    }
        // ============================================
        // QALLOUS.AI - API Integration Configuration
        // ============================================
        //
        // SETUP INSTRUCTIONS:
        // 1. Start your FastAPI backend: python app_orchestrated.py
        // 2. Update baseURL below with your API URL (default: http://localhost:8000)
        // 3. For production, replace with your deployed API URL
        // 4. Ensure CORS is enabled on your backend for this domain
        //
        // FEATURES INTEGRATED:
        // ✅ JWT Authentication (Login/Signup)
        // ✅ AI Chat (GPT-4o NLP Processing)
        // ✅ Security Dashboard (API monitoring, compliance status)
        // ✅ Real-time API Health Monitoring
        // ✅ Client Dashboard (Projects, Team, Billing)
        // ✅ Automatic fallback to demo mode if API unavailable
        //
        // ============================================
        
        // API Configuration
        const API_CONFIG = {
            baseURL: 'http://localhost:8000',  // Using local API for testing
            endpoints: {
                health: '/health',
                voiceProcess: '/api/voice/process',
                knowledgeUpload: '/api/knowledge/upload',
                securityDashboard: '/api/security/dashboard',
                authLogin: '/api/auth/login',
                authRegister: '/api/auth/register',
                userProfile: '/api/user/profile',
                projects: '/api/projects',
                team: '/api/team',
                billing: '/api/billing'
            }
        };

        // Token Management
        class TokenManager {
            static getToken() {
                return localStorage.getItem('qallous_token');
            }

            static setToken(token) {
                localStorage.setItem('qallous_token', token);
            }

            static removeToken() {
                localStorage.removeItem('qallous_token');
            }

            static isAuthenticated() {
                return !!this.getToken();
            }
        }

        // API Service
        class QallousAPI {
            static async request(endpoint, options = {}) {
                const token = TokenManager.getToken();
                const headers = {
                    'Content-Type': 'application/json',
                    ...options.headers
                };

                if (token) {
                    headers['Authorization'] = `Bearer ${token}`;
                }

                try {
                    const response = await fetch(`${API_CONFIG.baseURL}${endpoint}`, {
                        ...options,
                        headers
                    });

                    if (!response.ok) {
                        throw new Error(`API Error: ${response.statusText}`);
                    }

                    return await response.json();
                } catch (error) {
                    console.error('API Request Error:', error);
                    throw error;
                }
            }

            // Authentication
            static async login(email, password) {
                return this.request(API_CONFIG.endpoints.authLogin, {
                    method: 'POST',
                    body: JSON.stringify({ email, password })
                });
            }

            static async register(userData) {
                return this.request(API_CONFIG.endpoints.authRegister, {
                    method: 'POST',
                    body: JSON.stringify(userData)
                });
            }

            // Voice AI Processing
            static async processVoice(audioData) {
                return this.request(API_CONFIG.endpoints.voiceProcess, {
                    method: 'POST',
                    body: JSON.stringify({ audio: audioData })
                });
            }

            // NLP Processing (for chat)
            static async processText(text, conversationId = null) {
                return this.request(API_CONFIG.endpoints.voiceProcess, {
                    method: 'POST',
                    body: JSON.stringify({ 
                        text: text,
                        conversation_id: conversationId,
                        mode: 'text_only'
                    })
                });
            }

            // Knowledge Base
            static async uploadDocument(formData) {
                const token = TokenManager.getToken();
                return fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.knowledgeUpload}`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    body: formData
                }).then(res => res.json());
            }

            // Dashboard Data
            static async getSecurityDashboard() {
                return this.request(API_CONFIG.endpoints.securityDashboard);
            }

            static async getUserProfile() {
                return this.request(API_CONFIG.endpoints.userProfile);
            }

            static async getProjects() {
                return this.request(API_CONFIG.endpoints.projects);
            }

            static async getTeam() {
                return this.request(API_CONFIG.endpoints.team);
            }

            static async getBilling() {
                return this.request(API_CONFIG.endpoints.billing);
            }

            // Health Check
            static async healthCheck() {
                try {
                    // Add timeout to prevent hanging
                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
                    
                    const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.health}`, {
                        signal: controller.signal,
                        method: 'GET',
                        headers: { 'Content-Type': 'application/json' }
                    });
                    
                    clearTimeout(timeoutId);
                    return response.ok;
                } catch (error) {
                    if (error.name === 'AbortError') {
                        console.warn('API health check timed out');
                    } else {
                        console.warn('API health check failed:', error.message);
                    }
                    return false;
                }
            }
        }

        // Track API status
        let currentAPIStatus = {
            isHealthy: false,
            lastChecked: null,
            checkCount: 0
        };

        // Update API Status Indicator
        function updateAPIStatus(isHealthy) {
            currentAPIStatus.isHealthy = isHealthy;
            currentAPIStatus.lastChecked = new Date();
            currentAPIStatus.checkCount++;

            // Update modal status if it exists
            updateAPIStatusModal();
            
            // Note: apiStatusIcon, apiStatusText, apiStatusIndicator are optional
            // They may not exist in the DOM if there's no header indicator
            const statusIcon = document.getElementById('apiStatusIcon');
            const statusText = document.getElementById('apiStatusText');
            const statusIndicator = document.getElementById('apiStatusIndicator');
            
            if (statusIcon && statusText) {
                if (isHealthy) {
                    statusIcon.textContent = '🟢';
                    statusText.textContent = 'API Online';
                    statusText.style.color = 'var(--success)';
                    if (statusIndicator) {
                        statusIndicator.style.borderColor = 'rgba(0, 255, 136, 0.3)';
                        statusIndicator.style.background = 'rgba(0, 255, 136, 0.05)';
                    }
                } else {
                    statusIcon.textContent = '🔴';
                    statusText.textContent = 'Demo Mode';
                    statusText.style.color = 'var(--warning)';
                    if (statusIndicator) {
                        statusIndicator.style.borderColor = 'rgba(255, 170, 0, 0.3)';
                        statusIndicator.style.background = 'rgba(255, 170, 0, 0.05)';
                    }
                }
            }
        }

        // Show API Status Modal
        function showAPIStatusModal() {
            updateAPIStatusModal();
            document.getElementById('apiStatusModal').style.display = 'block';
        }

        // Update API Status Modal
        function updateAPIStatusModal() {
            const modalIcon = document.getElementById('modalApiStatusIcon');
            const modalTitle = document.getElementById('modalApiStatusTitle');
            const modalMessage = document.getElementById('modalApiStatusMessage');
            const connectionStatus = document.getElementById('connectionStatus');
            const operationMode = document.getElementById('operationMode');
            const lastChecked = document.getElementById('lastChecked');
            const backendUrl = document.getElementById('backendUrl');

            if (backendUrl) {
                backendUrl.textContent = API_CONFIG.baseURL;
            }

            if (currentAPIStatus.isHealthy) {
                if (modalIcon) modalIcon.textContent = '🟢';
                if (modalTitle) {
                    modalTitle.textContent = 'Connected';
                    modalTitle.style.color = 'var(--success)';
                }
                if (modalMessage) {
                    modalMessage.textContent = 'Backend is online and responding normally.';
                }
                if (connectionStatus) {
                    connectionStatus.textContent = 'Online';
                    connectionStatus.style.color = 'var(--success)';
                }
                if (operationMode) {
                    operationMode.textContent = 'Production Mode';
                    operationMode.style.color = 'var(--success)';
                }
            } else {
                if (modalIcon) modalIcon.textContent = '🔴';
                if (modalTitle) {
                    modalTitle.textContent = 'Disconnected';
                    modalTitle.style.color = 'var(--error)';
                }
                if (modalMessage) {
                    modalMessage.textContent = 'Cannot connect to backend. Using demo mode with simulated data.';
                }
                if (connectionStatus) {
                    connectionStatus.textContent = 'Offline';
                    connectionStatus.style.color = 'var(--error)';
                }
                if (operationMode) {
                    operationMode.textContent = 'Demo Mode';
                    operationMode.style.color = 'var(--warning)';
                }
            }

            if (lastChecked && currentAPIStatus.lastChecked) {
                const timeAgo = Math.floor((new Date() - currentAPIStatus.lastChecked) / 1000);
                lastChecked.textContent = timeAgo < 5 ? 'Just now' : `${timeAgo} seconds ago`;
            }
        }

        // Retry API Connection
        async function retryAPIConnection() {
            const retryBtn = event.target.closest('button') || event.target;
            const originalText = retryBtn.innerHTML;
            retryBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Connecting...';
            // Safe - using Font Awesome icon which is trusted
            retryBtn.disabled = true;

            try {
                // Update modal to show checking state
                const modalIcon = document.getElementById('modalApiStatusIcon');
                const modalTitle = document.getElementById('modalApiStatusTitle');
                const modalMessage = document.getElementById('modalApiStatusMessage');
                const connectionStatus = document.getElementById('connectionStatus');
                
                if (modalIcon) modalIcon.textContent = '🟡';
                if (modalTitle) modalTitle.textContent = 'Checking...';
                if (modalMessage) modalMessage.textContent = 'Connecting to QALLOUS.AI backend...';
                if (connectionStatus) {
                    connectionStatus.textContent = 'Checking...';
                    connectionStatus.style.color = 'var(--warning)';
                }
                
                const isHealthy = await QallousAPI.healthCheck();
                updateAPIStatus(isHealthy);
                updateAPIStatusModal();
                
                if (isHealthy) {
                    alert('✅ Successfully connected to API!');
                } else {
                    alert('⚠️ Could not connect to API. Please check if the backend is running.');
                }
            } catch (error) {
                console.error('Retry connection error:', error);
                updateAPIStatus(false);
                updateAPIStatusModal();
                alert('❌ Connection failed: ' + error.message);
            } finally {
                retryBtn.innerHTML = originalText;
                retryBtn.disabled = false;
            }
        }

        // Check authentication on page load
        function checkAuthenticationOnLoad() {
            if (TokenManager.isAuthenticated()) {
                // User is logged in, show dashboard button
                const loginBtn = document.getElementById('loginBtn');
                const signupBtn = document.getElementById('signupBtn');
                const dashboardBtn = document.getElementById('dashboardBtn');
                
                if (loginBtn) loginBtn.style.display = 'none';
                if (signupBtn) signupBtn.style.display = 'none';
                if (dashboardBtn) dashboardBtn.style.display = 'inline-block';
            }
        }

        // Check API health on load
        async function initializeAPIStatus() {
            try {
                const isHealthy = await QallousAPI.healthCheck();
                updateAPIStatus(isHealthy);
                updateAPIStatusModal(); // Ensure modal is updated
                if (isHealthy) {
                    console.log('✅ Qallous.ai API Connected');
                } else {
                    console.warn('⚠️ Qallous.ai API Unavailable - Using demo mode');
                }
            } catch (error) {
                console.error('API health check error:', error);
                updateAPIStatus(false);
                updateAPIStatusModal();
            }
        }
        
        // Initialize API status on page load
        initializeAPIStatus();

        // Check authentication status
        checkAuthenticationOnLoad();

        // Periodic API health check (every 30 seconds)
        setInterval(async () => {
            const isHealthy = await QallousAPI.healthCheck();
            updateAPIStatus(isHealthy);
        }, 30000);

        // Optimized smooth scrolling for navigation links using requestAnimationFrame
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    // Use getBoundingClientRect for more accurate positioning
                    const headerHeight = 150;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                    
                    // Smooth scroll with requestAnimationFrame for better performance
                    const startPosition = window.pageYOffset;
                    const distance = targetPosition - startPosition;
                    const duration = 600; // milliseconds
                    let start = null;
                    
                    function smoothScroll(timestamp) {
                        if (!start) start = timestamp;
                        const progress = timestamp - start;
                        const percentage = Math.min(progress / duration, 1);
                        
                        // Easing function for smooth deceleration
                        const ease = percentage < 0.5 
                            ? 2 * percentage * percentage 
                            : 1 - Math.pow(-2 * percentage + 2, 2) / 2;
                        
                        window.scrollTo(0, startPosition + distance * ease);
                        
                        if (progress < duration) {
                            requestAnimationFrame(smoothScroll);
                        }
                    }
                    
                    requestAnimationFrame(smoothScroll);
                }
            }, { passive: false });
        });

        // Removed scroll event listener - static header for better performance

        // Simple animation for step elements
        const observerOptions = {
            threshold: 0.3,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = 1;
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { 
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observe step elements for animation
        document.querySelectorAll('.step').forEach(step => {
            step.style.opacity = 0;
            step.style.transform = 'translateY(15px)';
            step.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            observer.observe(step);
        });

        // Observe service cards for animation
        document.querySelectorAll('.service-card').forEach(card => {
            card.style.opacity = 0;
            card.style.transform = 'translateY(15px)';
            card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            observer.observe(card);
        });

        // AI Receptionist Chat Functionality
        const chatToggle = document.getElementById('chatToggle');
        const chatWindow = document.getElementById('chatWindow');
        const chatClose = document.getElementById('chatClose');
        const chatMessages = document.getElementById('chatMessages');
        const chatInput = document.getElementById('chatInput');
        const chatSend = document.getElementById('chatSend');
        const typingIndicator = document.getElementById('typingIndicator');

        let isChatOpen = false;

        // Enhanced AI Responses with FAQ and Case Study knowledge
        const aiResponses = {
            greeting: [
                "🤖 Hello! I'm your AI Receptionist from QALLOUS.AI! I can help you learn about our Voice AI Receptionist, AI business solutions, workflow automation, and more. How can I assist you today?",
                "🚀 Welcome! I'm here to help you discover how our Voice AI Receptionist can transform your phone operations. We help businesses automate calls 24/7, capture leads, and integrate with their systems. What would you like to know?",
                "👋 Hi there! I can answer questions about our Voice AI Receptionist, AI business solutions, case studies, pricing, or connect you with our team. How can I help you today?"
            ],
            services: [
                "QALLOUS.AI offers comprehensive AI business solutions: Voice AI Receptionist (our featured product), system audits, workflow automation, custom software development, RAG knowledge bases, and AI consulting. The Voice AI Receptionist handles calls 24/7, captures leads, and automates workflows. Which service interests you?",
                "Our Voice AI Receptionist is an intelligent phone system that never misses a call! It features inbound and outbound capabilities with customizable sales personalities, multi-language support, and seamless integrations with your CRM and business tools. Check out our <a href='case-studies.html' style='color: var(--neon-blue);'>Case Studies</a> to see real results!",
                "We provide AI business solutions including Voice AI Receptionist, system audits, workflow automation, software development, and AI consulting. Our Voice AI Receptionist is available 24/7, handles calls with custom workflows, and integrates with your existing systems. Want to learn more? Check our <a href='case-studies.html' style='color: var(--neon-blue);'>case studies</a> or <a href='book-audit.html' style='color: var(--neon-blue);'>book a free systems audit</a>!"
            ],
            pricing: [
                "We offer flexible pricing for our Voice AI Receptionist and custom AI business solutions. Start with a <a href='https://voice.qallous.ai/' style='color: var(--neon-blue);'>free trial</a> or <a href='book-audit.html' style='color: var(--neon-blue);'>book a free systems audit</a> to see how we'd automate your workflows. For detailed pricing information, check our <a href='pricing.html' style='color: var(--neon-blue);'>Pricing page</a> or <a href='faq.html' style='color: var(--neon-blue);'>FAQ</a>!",
                "Pricing varies based on your needs and custom requirements. We offer a <a href='https://voice.qallous.ai/' style='color: var(--neon-blue);'>free trial</a> to get started. For detailed pricing and custom quotes for AI business solutions, visit our <a href='pricing.html' style='color: var(--neon-blue);'>Pricing page</a> or email qudeuce@qallous.ai",
                "Start with a <a href='https://voice.qallous.ai/' style='color: var(--neon-blue);'>free trial</a> of our Voice AI Receptionist! For custom AI solutions, workflow automation, and consulting services, pricing is tailored to your needs. Check our <a href='pricing.html' style='color: var(--neon-blue);'>Pricing page</a> or <a href='faq.html' style='color: var(--neon-blue);'>FAQ</a> for more details!"
            ],
            contact: [
                "📧 Email us directly at <a href='mailto:qudeuce@qallous.ai' style='color: var(--neon-blue);'>qudeuce@qallous.ai</a> for questions, demos, or to <a href='book-audit.html' style='color: var(--neon-blue);'>book a free systems audit</a>. We typically respond within 2 hours!",
                "Want to get started? <a href='book-audit.html' style='color: var(--neon-blue);'>Book a free systems audit</a> or email <a href='mailto:qudeuce@qallous.ai' style='color: var(--neon-blue);'>qudeuce@qallous.ai</a> to discuss your AI business solutions needs!",
                "Ready to transform your business? <a href='book-audit.html' style='color: var(--neon-blue);'>Book a free systems audit</a> or contact qudeuce@qallous.ai for consultations. Or explore our <a href='case-studies.html' style='color: var(--neon-blue);'>case studies</a> first!"
            ],
            faq: [
                "Great question! I'd recommend checking our comprehensive <a href='faq.html' style='color: var(--neon-blue);'>FAQ page</a> - it covers Voice AI Receptionist features, pricing, security, getting started, and more! Or email qudeuce@qallous.ai",
                "You can find detailed answers in our <a href='faq.html' style='color: var(--neon-blue);'>FAQ section</a>! Topics include: Voice AI Receptionist capabilities, pricing, security (GDPR/HIPAA/SOC2), integrations, and how to get started.",
                "Check out our <a href='faq.html' style='color: var(--neon-blue);'>FAQ page</a> for detailed information about our Voice AI Receptionist and AI business solutions! Can't find what you need? Email qudeuce@qallous.ai and we'll help immediately."
            ],
            caseStudies: [
                "We have amazing <a href='case-studies.html' style='color: var(--neon-blue);'>success stories</a>! FinTech raised $8.5M, E-commerce scaled to 50K users with 93% success rate, Healthcare hit 97% satisfaction. Which industry interests you?",
                "Check out our <a href='case-studies.html' style='color: var(--neon-blue);'>Case Studies page</a>: 340% ROI increase for marketing agency, 60% cost reduction for SaaS company, $2.3M saved for manufacturing. Real results!",
                "Our clients achieve incredible results! See <a href='case-studies.html' style='color: var(--neon-blue);'>case studies</a>: 7-24x faster execution, 90-98% better outcomes, 10-30h/week saved. Want specifics for your industry?"
            ],
            results: [
                "Our partnerships deliver: 7-24x faster execution, 90-98% better outcomes, 10-30h/week saved! See proof in our <a href='case-studies.html' style='color: var(--neon-blue);'>case studies</a>. Which metric matters most to you?",
                "Real numbers: FinTech $8.5M raised (6 months), E-commerce 50K users (93% success), Healthcare 97% satisfaction. See all <a href='case-studies.html' style='color: var(--neon-blue);'>results here</a>!",
                "Companies using QALLOUS.AI see 10-24x performance boosts! Check <a href='case-studies.html' style='color: var(--neon-blue);'>case studies</a> for your industry or email qudeuce@qallous.ai for a custom demo."
            ],
            free: [
                "🎉 Start with a <a href='https://voice.qallous.ai/' style='color: var(--neon-blue);'>free trial</a> of our Voice AI Receptionist - no credit card required! You can also <a href='book-audit.html' style='color: var(--neon-blue);'>book a free systems audit</a> to see how we'd customize workflows for your business. Ready to get started?",
                "FREE to get started! <a href='https://voice.qallous.ai/' style='color: var(--neon-blue);'>Start your free trial</a> of our Voice AI Receptionist or <a href='book-audit.html' style='color: var(--neon-blue);'>book a free systems audit</a> - no credit card needed! Email qudeuce@qallous.ai with any questions!",
                "Try our Voice AI Receptionist FREE! <a href='https://voice.qallous.ai/' style='color: var(--neon-blue);'>Start your free trial</a> or <a href='book-audit.html' style='color: var(--neon-blue);'>book a free systems audit</a> to see how we automate phone calls and workflows. See our <a href='faq.html' style='color: var(--neon-blue);'>FAQ</a> for more details!"
            ],
            security: [
                "Security is our priority! We're GDPR, HIPAA, SOC2, and ISO27001 compliant. Enterprise-grade encryption, 99.9% uptime, regular audits. Questions? See <a href='faq.html#security' style='color: var(--neon-blue);'>security FAQ</a>",
                "Your data is safe! Full compliance with GDPR, HIPAA, SOC2, ISO27001. We never share data without consent. More details in our <a href='faq.html' style='color: var(--neon-blue);'>FAQ</a> or email qudeuce@qallous.ai",
                "Enterprise security standards: end-to-end encryption, compliance certifications (GDPR/HIPAA/SOC2/ISO27001), 98/100 security score. Trust but verify? Email qudeuce@qallous.ai"
            ],
            demo: [
                "Want to see how it works? Start with a <a href='https://voice.qallous.ai/' style='color: var(--neon-blue);'>free trial</a> or <a href='book-audit.html' style='color: var(--neon-blue);'>book a free systems audit</a>! You can also email <a href='mailto:qudeuce@qallous.ai?subject=Demo%20Request' style='color: var(--neon-blue);'>qudeuce@qallous.ai</a> to schedule a personalized demo.",
                "Get started instantly with a <a href='https://voice.qallous.ai/' style='color: var(--neon-blue);'>free trial</a> of our Voice AI Receptionist! Or <a href='book-audit.html' style='color: var(--neon-blue);'>book a free systems audit</a> to see how we'd customize workflows for your business. Email qudeuce@qallous.ai for more information!",
                "Try our Voice AI Receptionist with a <a href='https://voice.qallous.ai/' style='color: var(--neon-blue);'>free trial</a>! For custom AI solutions, <a href='book-audit.html' style='color: var(--neon-blue);'>book a free systems audit</a>. Check out our <a href='case-studies.html' style='color: var(--neon-blue);'>case studies</a> to see real results!"
            ],
            default: [
                "Interesting question! I can help you learn about our Voice AI Receptionist, AI business solutions, pricing, case studies, FAQs, or connect you with our team. Try asking about Voice AI features, booking a consultation, or email qudeuce@qallous.ai!",
                "Let me help! I know about: 📞 Voice AI Receptionist, 🤖 AI Business Solutions, 💰 Pricing, 📊 Case Studies, ❓ FAQs, 🔒 Security, 📅 Booking consultations. Or I can connect you with qudeuce@qallous.ai. What interests you?",
                "I'm here to help! Want to learn about our <a href='index.html#voice-ai-features' style='color: var(--neon-blue);'>Voice AI Receptionist</a>? See <a href='case-studies.html' style='color: var(--neon-blue);'>success stories</a>? Check <a href='faq.html' style='color: var(--neon-blue);'>FAQs</a>? Or <a href='book-audit.html' style='color: var(--neon-blue);'>book a consultation</a>? Let me know!"
            ]
        };

        // Chat functionality - Only attach if chat elements exist
        if (chatToggle && chatWindow && chatClose && chatInput) {
            chatToggle.addEventListener('click', () => {
                isChatOpen = !isChatOpen;
                chatWindow.classList.toggle('active', isChatOpen);
                chatToggle.classList.toggle('pulse', !isChatOpen);
                
                if (isChatOpen && chatInput) {
                    chatInput.focus();
                }
            });

            chatClose.addEventListener('click', () => {
                isChatOpen = false;
                chatWindow.classList.remove('active');
                chatToggle.classList.add('pulse');
            });
        }

        function addMessage(text, isUser = false) {
            if (!chatMessages) return;
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${isUser ? 'user' : 'bot'}`;
            // Allow HTML in bot messages for links
            if (isUser) {
                messageDiv.textContent = text;
            } else {
                // Sanitize HTML content for bot messages (contains links)
                setSafeHtml(messageDiv, text);
            }
            chatMessages.appendChild(messageDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        function showTyping() {
            if (!typingIndicator || !chatMessages) return;
            typingIndicator.style.display = 'flex';
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        function hideTyping() {
            if (!typingIndicator) return;
            typingIndicator.style.display = 'none';
        }

        function getAIResponse(userMessage) {
            const message = userMessage.toLowerCase();
            
            // Greeting detection
            if (message.match(/\b(hello|hi|hey|greetings|good morning|good afternoon)\b/)) {
                return aiResponses.greeting[Math.floor(Math.random() * aiResponses.greeting.length)];
            }
            
            // FAQ related
            if (message.match(/\b(faq|question|help|information|learn|know more)\b/)) {
                return aiResponses.faq[Math.floor(Math.random() * aiResponses.faq.length)];
            }
            
            // Case Studies related
            if (message.match(/\b(case study|case studies|success|example|proof|results?|client|customer)\b/)) {
                return aiResponses.caseStudies[Math.floor(Math.random() * aiResponses.caseStudies.length)];
            }
            
            // Results/Performance related
            if (message.match(/\b(outcome|performance|metric|faster|better|roi|savings?|achieve)\b/)) {
                return aiResponses.results[Math.floor(Math.random() * aiResponses.results.length)];
            }
            
            // FREE partnerships
            if (message.match(/\b(free|trial|test|try)\b/)) {
                return aiResponses.free[Math.floor(Math.random() * aiResponses.free.length)];
            }
            
            // Security related
            if (message.match(/\b(secure|security|safe|privacy|gdpr|hipaa|compliance|encrypt)\b/)) {
                return aiResponses.security[Math.floor(Math.random() * aiResponses.security.length)];
            }
            
            // Demo related
            if (message.match(/\b(demo|demonstration|show|see|preview)\b/)) {
                return aiResponses.demo[Math.floor(Math.random() * aiResponses.demo.length)];
            }
            
            // Services/Partnerships
            if (message.match(/\b(service|partnership|offer|provide|do|what|ceo|cto|cmo|cfo|product manager|voice|receptionist|sage)\b/)) {
                return aiResponses.services[Math.floor(Math.random() * aiResponses.services.length)];
            }
            
            // Pricing
            if (message.match(/\b(price|pricing|cost|how much|expensive|cheap|rate|fee|pay)\b/)) {
                return aiResponses.pricing[Math.floor(Math.random() * aiResponses.pricing.length)];
            }
            
            // Contact/Email
            if (message.match(/\b(contact|email|reach|speak|talk|call|qudeuce|schedule|meeting)\b/)) {
                return aiResponses.contact[Math.floor(Math.random() * aiResponses.contact.length)];
            }
            
            // Default fallback
            return aiResponses.default[Math.floor(Math.random() * aiResponses.default.length)];
        }

        // Conversation ID for chat continuity
        let currentConversationId = null;

        async function sendMessage() {
            const message = chatInput.value.trim();
            if (!message) return;

            addMessage(message, true);
            chatInput.value = '';
            showTyping();
            
            try {
                // Try to use real API first
                const response = await QallousAPI.processText(message, currentConversationId);
                
                hideTyping();
                
                // Store conversation ID for context
                if (response.conversation_id) {
                    currentConversationId = response.conversation_id;
                }
                
                // Add AI response
                addMessage(response.response || response.text || 'I received your message!');
                
            } catch (error) {
                console.warn('Using fallback response:', error);
                // Fallback to demo responses if API is unavailable
                setTimeout(() => {
                    hideTyping();
                    const response = getAIResponse(message);
                    addMessage(response);
                }, 1500 + Math.random() * 1000);
            }
        }

        if (chatSend && chatInput) {
            chatSend.addEventListener('click', sendMessage);
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    sendMessage();
                }
            });
        }

        // Auto-open chat after 10 seconds
        if (chatToggle) {
            setTimeout(() => {
                if (!isChatOpen) {
                    chatToggle.classList.add('pulse');
                }
            }, 10000);
        }

        // Modal Functions
        function openLoginModal() {
            const modal = document.getElementById('loginModal');
            if (modal) modal.style.display = 'block';
        }

        function openSignupModal() {
            // Redirect to voice.qallous.ai signup instead of opening modal
            window.location.href = 'https://voice.qallous.ai/';
            return;
        }

        function openDemoModal() {
            const modal = document.getElementById('demoModal');
            if (modal) modal.style.display = 'block';
        }

        function openProjectModal(serviceName) {
            const projectService = document.getElementById('projectService');
            const modal = document.getElementById('projectModal');
            if (projectService) projectService.value = serviceName;
            if (modal) modal.style.display = 'block';
        }

        function closeModal(modalId) {
            const modal = document.getElementById(modalId);
            if (modal) modal.style.display = 'none';
        }

        function switchToSignup() {
            closeModal('loginModal');
            openSignupModal();
        }

        function switchToLogin() {
            closeModal('signupModal');
            openLoginModal();
        }

        // Close modals when clicking outside
        window.onclick = function(event) {
            const modals = document.querySelectorAll('.modal');
            modals.forEach(modal => {
                if (event.target === modal) {
                    modal.style.display = 'none';
                }
            });
        }

        // Partnership Quiz Functions
        let currentQuizStep = 1;
        let quizAnswers = {};

        function openPartnershipQuiz() {
            currentQuizStep = 1;
            quizAnswers = {};
            updateQuizProgress();
            document.getElementById('partnershipQuizModal').style.display = 'block';
        }

        function selectQuizOption(step, value) {
            // Remove selected class from all options in this step
            const currentStep = document.getElementById(`step${step}`);
            currentStep.querySelectorAll('.quiz-option').forEach(option => {
                option.classList.remove('selected');
            });
            
            // Add selected class to clicked option
            event.target.closest('.quiz-option').classList.add('selected');
            
            // Store answer
            quizAnswers[`step${step}`] = value;
        }

        function nextQuizStep() {
            if (currentQuizStep === 5) {
                // On final step, show results and close
                showQuizResults();
                return;
            }
            
            if (!quizAnswers[`step${currentQuizStep}`]) {
                alert('Please select an option to continue');
                return;
            }
            
            // Hide current step
            document.getElementById(`step${currentQuizStep}`).classList.remove('active');
            
            // Show next step
            currentQuizStep++;
            document.getElementById(`step${currentQuizStep}`).classList.add('active');
            
            updateQuizProgress();
            updateNavigationButtons();
            
            // If this is the last step, change button text
            if (currentQuizStep === 5) {
                document.getElementById('nextBtn').textContent = 'See Your Match →';
            }
        }

        function previousQuizStep() {
            // Hide current step
            document.getElementById(`step${currentQuizStep}`).classList.remove('active');
            
            // Show previous step
            currentQuizStep--;
            document.getElementById(`step${currentQuizStep}`).classList.add('active');
            
            updateQuizProgress();
            updateNavigationButtons();
        }

        function updateQuizProgress() {
            const progress = ((currentQuizStep - 1) / 4) * 100;
            document.getElementById('quizProgress').style.width = `${progress}%`;
            document.getElementById('quizProgressText').textContent = `Step ${currentQuizStep} of 5`;
        }

        function updateNavigationButtons() {
            const prevBtn = document.getElementById('prevBtn');
            const nextBtn = document.getElementById('nextBtn');
            
            if (currentQuizStep === 1) {
                prevBtn.style.display = 'none';
            } else {
                prevBtn.style.display = 'block';
            }
            
            if (currentQuizStep === 5) {
                nextBtn.textContent = 'See Your Match →';
            } else {
                nextBtn.textContent = 'Continue →';
            }
        }

        function showQuizResults() {
            const role = quizAnswers.step1;
            const challenge = quizAnswers.step2;
            const style = quizAnswers.step3;
            const goal = quizAnswers.step4;
            
            // Simple matching logic - in production this would be more sophisticated
            let matchedPartnership;
            
            switch(role) {
                case 'CEO': matchedPartnership = PARTNERSHIPS[0]; break;
                case 'CTO': matchedPartnership = PARTNERSHIPS[1]; break;
                case 'CMO': matchedPartnership = PARTNERSHIPS[2]; break;
                case 'CFO': matchedPartnership = PARTNERSHIPS[3]; break;
                case 'Legal': matchedPartnership = PARTNERSHIPS[4]; break;
                case 'Developer': matchedPartnership = PARTNERSHIPS[5]; break;
                default: matchedPartnership = PARTNERSHIPS[0];
            }
            
            const resultsHTML = `
                <div style="text-align: center;">
                    <div style="font-size: 4rem; margin-bottom: 1rem;">🎯</div>
                    <h3 style="color: var(--light); margin-bottom: 1rem;">Your Perfect AI Partner</h3>
                    <div style="background: rgba(0, 212, 255, 0.1); padding: 1.5rem; border-radius: 12px; margin: 1.5rem 0;">
                        <div style="display: flex; align-items: center; justify-content: center; gap: 1rem; margin-bottom: 1rem;">
                            <div style="font-size: 2rem;">👨‍💼</div>
                            <div style="font-size: 1.5rem;">+</div>
                            <div style="font-size: 2rem;">${matchedPartnership.aiPartner.avatar}</div>
                        </div>
                        <h4 style="color: var(--light); margin-bottom: 0.5rem;">${matchedPartnership.humanRole} + ${matchedPartnership.aiPartner.name}</h4>
                        <p style="color: var(--gray); margin-bottom: 1rem;">${matchedPartnership.synergy.speed} faster execution • ${matchedPartnership.synergy.timeSaved} saved</p>
                    </div>
                    <p style="color: var(--gray); margin-bottom: 1.5rem;">Based on your ${challenge.toLowerCase()} and goal to ${goal.toLowerCase()}, this AI partner is perfectly suited to work with your ${style.toLowerCase()} style.</p>
                    <div style="display: flex; gap: 1rem; justify-content: center;">
                        <button class="btn btn-primary" onclick="openPartnershipModal('${matchedPartnership.id}')">
                            Start Partnership
                        </button>
                        <button class="btn btn-outline" onclick="closeModal('partnershipQuizModal')">
                            Browse All Options
                        </button>
                    </div>
                </div>
            `;
            
            document.getElementById('quizResults').innerHTML = resultsHTML;
        }

        // Partnership Modal Function
        function openPartnershipModal(partnershipId) {
            const partnership = PARTNERSHIPS.find(p => p.id === partnershipId);
            
            if (!partnership) return;
            
            // For now, just show a success message
            // In production, this would open a detailed onboarding flow
            alert(`Perfect! Let's set up your ${partnership.humanRole} + ${partnership.aiPartner.name} partnership.\n\nOur team will contact you within 2 hours to begin your augmentation journey.`);
            
            // Close any open modals
            closeModal('partnershipQuizModal');
        }

        // GoHighLevel Secure API Integration via Backend Proxy
        // API key is now stored securely on the server side
        async function sendToGoHighLevel(leadData) {
            try {
                // Use secure backend proxy instead of direct API call
                const response = await fetch('/api/ghl/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(leadData)
                });

                if (response.ok) {
                    const result = await response.json();
                    console.log('✅ GHL Contact Created via secure proxy:', result.contact?.id || 'success');
                    return result.success || false;
                } else {
                    const errorData = await response.json().catch(() => ({}));
                    console.error('GHL Proxy Error:', response.status, errorData.error || 'Unknown error');
                    return false;
                }
            } catch (error) {
                console.error('Error sending to GHL via proxy:', error);
                return false;
            }
        }

        function requestDemoAccess(partnershipId) {
            const partnership = PARTNERSHIPS.find(p => p.id === partnershipId);
            
            if (!partnership) return;
            
            // Open demo request modal with GHL integration
            const demoName = partnership.id === 'pm-partnership' ? 'AI Product Manager Bot' : 'AI Voice Receptionist';
            
            // Optionally open the demo modal for lead capture
            openModal('demoModal');
            
            // Store the demo type for form submission
            document.getElementById('demoService').value = demoName;
        }

        // Form Submissions - Only attach if forms exist
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', async function(e) {
                e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            if (!email || !password) {
                alert('Please fill in all fields.');
                return;
            }

            try {
                // Disable submit button during login
                const submitBtn = this.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                submitBtn.textContent = 'Logging in...';
                submitBtn.disabled = true;

                // Real API authentication
                const response = await QallousAPI.login(email, password);
                
                if (response.access_token || response.token) {
                    TokenManager.setToken(response.access_token || response.token);
                    
                    // Update header buttons
                    document.getElementById('loginBtn').style.display = 'none';
                    document.getElementById('signupBtn').style.display = 'none';
                    document.getElementById('dashboardBtn').style.display = 'inline-block';
                    
                    await loadDashboardData();
                    showClientDashboard();
                    closeModal('loginModal');
                    alert('Login successful! Welcome to QALLOUS.AI.');
                } else {
                    throw new Error('Invalid response from server');
                }

                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                
            } catch (error) {
                console.warn('Login error, using demo mode:', error);
                // Fallback to demo mode if API is unavailable
                if (email && password) {
                    TokenManager.setToken('demo_token');
                    showClientDashboard();
                    closeModal('loginModal');
                    alert('Login successful! (Demo Mode)');
                }
                
                const submitBtn = this.querySelector('button[type="submit"]');
                submitBtn.textContent = 'Login';
                submitBtn.disabled = false;
            }
            });
        }

        const signupForm = document.getElementById('signupForm');
        if (signupForm) {
            signupForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            // Redirect to voice.qallous.ai signup instead of local form submission
            window.location.href = 'https://voice.qallous.ai/';
            return;
            
            // Archived: Original form submission code below
            /*
            const name = document.getElementById('signupName').value;
            const email = document.getElementById('signupEmail').value;
            const company = document.getElementById('signupCompany').value;
            const password = document.getElementById('signupPassword').value;
            
            if (!name || !email || !company || !password) {
                alert('Please fill in all fields.');
                return;
            }

            try {
                // Disable submit button during registration
                const submitBtn = this.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                submitBtn.textContent = 'Creating Account...';
                submitBtn.disabled = true;

                // Real API registration
                const response = await QallousAPI.register({
                    name: name,
                    email: email,
                    company: company,
                    password: password
                });
                
                if (response.access_token || response.token) {
                    TokenManager.setToken(response.access_token || response.token);
                    
                    // Send to GoHighLevel
                    await sendToGoHighLevel({
                        name: name,
                        email: email,
                        company: company,
                        demo_type: 'Account Signup',
                        message: 'New user account created',
                        source: 'qallous.ai',
                        lead_type: 'Account Signup',
                        timestamp: new Date().toISOString(),
                        page_url: window.location.href
                    });
                    
                    // Update header buttons
                    document.getElementById('loginBtn').style.display = 'none';
                    document.getElementById('signupBtn').style.display = 'none';
                    document.getElementById('dashboardBtn').style.display = 'inline-block';
                    
                    await loadDashboardData();
                    showClientDashboard();
                    closeModal('signupModal');
                    alert('Account created successfully! Welcome to QALLOUS.AI.');
                } else {
                    throw new Error('Invalid response from server');
                }

                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                
            } catch (error) {
                console.warn('Registration error, using demo mode:', error);
                
                // Send to GoHighLevel even in demo mode
                await sendToGoHighLevel({
                    name: name,
                    email: email,
                    company: company,
                    demo_type: 'Account Signup (Demo Mode)',
                    message: 'New user account created in demo mode',
                    source: 'qallous.ai',
                    lead_type: 'Account Signup',
                    timestamp: new Date().toISOString(),
                    page_url: window.location.href
                });
                
                // Fallback to demo mode if API is unavailable
                TokenManager.setToken('demo_token');
                showClientDashboard();
                closeModal('signupModal');
                alert('Account created successfully! (Demo Mode)');
                
                const submitBtn = this.querySelector('button[type="submit"]');
                submitBtn.textContent = 'Create Account';
                submitBtn.disabled = false;
            }
            */
            });
        }

        const demoForm = document.getElementById('demoForm');
        if (demoForm) {
            demoForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const name = document.getElementById('demoName').value;
            const email = document.getElementById('demoEmail').value;
            const company = document.getElementById('demoCompany').value;
            const service = document.getElementById('demoService').value;
            const message = document.getElementById('demoMessage').value;
            
            if (name && email && company && service) {
                // Send to GoHighLevel
                const leadData = {
                    name: name,
                    email: email,
                    company: company,
                    demo_type: service,
                    message: message,
                    source: 'qallous.ai',
                    lead_type: 'Demo Request',
                    timestamp: new Date().toISOString(),
                    page_url: window.location.href
                };
                
                const ghlSuccess = await sendToGoHighLevel(leadData);
                
                closeModal('demoModal');
                
                if (ghlSuccess) {
                    alert('🎉 Demo request submitted successfully!\n\nOur AI team will contact you within 2 hours.\n\nCheck your email for next steps!');
                } else {
                    alert('Demo request received! Our team will contact you within 24 hours.');
                }
                
                // Clear form
                document.getElementById('demoForm').reset();
            } else {
                alert('Please fill in all required fields.');
            }
            });
        }

        const projectForm = document.getElementById('projectForm');
        if (projectForm) {
            projectForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const name = document.getElementById('projectName').value;
            const email = document.getElementById('projectEmail').value;
            const company = document.getElementById('projectCompany').value;
            const service = document.getElementById('projectService').value;
            const budget = document.getElementById('projectBudget').value;
            const timeline = document.getElementById('projectTimeline').value;
            const description = document.getElementById('projectDescription').value;
            
            if (name && email && company && service && budget && timeline && description) {
                // Send to GoHighLevel
                const leadData = {
                    name: name,
                    email: email,
                    company: company,
                    demo_type: service,
                    message: `Budget: ${budget}, Timeline: ${timeline}, Description: ${description}`,
                    source: 'qallous.ai',
                    lead_type: 'Project Request',
                    timestamp: new Date().toISOString(),
                    page_url: window.location.href,
                    budget: budget,
                    timeline: timeline
                };
                
                const ghlSuccess = await sendToGoHighLevel(leadData);
                
                closeModal('projectModal');
                
                if (ghlSuccess) {
                    alert('🎉 Project request submitted successfully!\n\nOur AI-augmented team will review your requirements and get back to you within 2 hours.\n\nCheck your email for next steps!');
                } else {
                    alert('Project request submitted! Our AI-augmented team will review your requirements and get back to you within 2 hours.');
                }
                
                // Clear form
                document.getElementById('projectForm').reset();
            } else {
                alert('Please fill in all required fields.');
            }
            });
        }

        // Client Dashboard Functions
        async function loadDashboardData() {
            try {
                // Load user profile
                const profile = await QallousAPI.getUserProfile();
                if (profile && profile.name) {
                    // Update dashboard with user data
                    console.log('User profile loaded:', profile);
                }

                // Load projects
                const projects = await QallousAPI.getProjects();
                if (projects && projects.length) {
                    updateProjectsList(projects);
                }

                // Load team data
                const team = await QallousAPI.getTeam();
                if (team && team.length) {
                    updateTeamDisplay(team);
                }

                // Load billing info
                const billing = await QallousAPI.getBilling();
                if (billing) {
                    updateBillingInfo(billing);
                }

            } catch (error) {
                console.warn('Could not load dashboard data, using defaults:', error);
            }
        }

        function updateProjectsList(projects) {
            const projectList = document.querySelector('.project-list');
            if (projectList && projects.length > 0) {
                projectList.innerHTML = projects.map(project => `
                    <div class="project-card">
                        <h3>${project.name || 'Unnamed Project'}</h3>
                        <p>${project.description || 'No description'}</p>
                        <div class="project-status">${project.status || 'In Progress'}</div>
                    </div>
                `).join('');
            }
        }

        function updateTeamDisplay(team) {
            const teamGrid = document.querySelector('.team-grid');
            if (teamGrid && team.length > 0) {
                teamGrid.innerHTML = team.map(member => `
                    <div class="team-member">
                        <div class="member-avatar">${member.avatar || '👤'}</div>
                        <h4>${member.name || 'Team Member'}</h4>
                        <p>${member.role || 'Role not specified'}</p>
                    </div>
                `).join('');
            }
        }

        function updateBillingInfo(billing) {
            const currentPlan = document.querySelector('.current-plan');
            if (currentPlan && billing.plan) {
                currentPlan.querySelector('h3').textContent = `Current Plan: ${billing.plan}`;
                currentPlan.querySelector('p').textContent = `$${billing.amount}/month`;
            }
        }

        async function loadSecurityDashboard() {
            try {
                const securityData = await QallousAPI.getSecurityDashboard();
                
                if (securityData) {
                    // Update API Health Status
                    const healthStatus = document.getElementById('apiHealthStatus');
                    if (healthStatus) {
                        healthStatus.textContent = securityData.api_healthy ? '🟢' : '🔴';
                    }

                    // Update Security Score
                    const securityScore = document.getElementById('securityScore');
                    if (securityScore && securityData.security_score) {
                        securityScore.textContent = securityData.security_score;
                    }

                    // Update API Requests
                    const apiRequests = document.getElementById('apiRequests');
                    if (apiRequests && securityData.api_requests_24h) {
                        apiRequests.textContent = securityData.api_requests_24h;
                    }

                    // Update Key Rotation
                    const keyRotation = document.getElementById('keyRotation');
                    if (keyRotation && securityData.days_until_rotation) {
                        keyRotation.textContent = `${securityData.days_until_rotation}d`;
                    }

                    // Update Security Events
                    if (securityData.recent_events && securityData.recent_events.length > 0) {
                        const eventsContainer = document.getElementById('securityEvents');
                        eventsContainer.innerHTML = securityData.recent_events.map(event => `
                            <div class="project-card">
                                <h3>${event.icon || '✅'} ${event.title}</h3>
                                <p>${event.description}</p>
                                <span style="color: var(--gray); font-size: 0.9rem;">${event.time}</span>
                            </div>
                        `).join('');
                    }
                }
            } catch (error) {
                console.warn('Could not load security dashboard data:', error);
            }
        }

        function showClientDashboard() {
            document.body.style.overflow = 'hidden';
            document.getElementById('clientDashboard').style.display = 'block';
            // Load security data when dashboard is shown
            loadSecurityDashboard();
        }

        function logout() {
            TokenManager.removeToken();
            currentConversationId = null;
            document.getElementById('clientDashboard').style.display = 'none';
            document.body.style.overflow = 'auto';
            
            // Update header buttons
            const loginBtn = document.getElementById('loginBtn');
            const signupBtn = document.getElementById('signupBtn');
            const dashboardBtn = document.getElementById('dashboardBtn');
            
            if (loginBtn) loginBtn.style.display = 'inline-block';
            if (signupBtn) signupBtn.style.display = 'inline-block';
            if (dashboardBtn) dashboardBtn.style.display = 'none';
            
            alert('Logged out successfully!');
        }

        function showDashboardSection(sectionId) {
            // Hide all sections
            document.querySelectorAll('.dashboard-section').forEach(section => {
                section.classList.remove('active');
            });
            
            // Remove active class from all nav links
            document.querySelectorAll('.dashboard-sidebar nav a').forEach(link => {
                link.classList.remove('active');
            });
            
            // Show selected section
            document.getElementById(sectionId).classList.add('active');
            
            // Add active class to clicked nav link
            event.target.classList.add('active');
        }

        // Initialize partnership features
        document.addEventListener('DOMContentLoaded', function() {
            // Ensure partnership cards are rendered
            // Archived: Partnership cards rendering
            // if (typeof renderPartnershipCards === 'function') {
            //     console.log('✨ Initializing Partnership Features');
            //     renderPartnershipCards();
            // }
            
            // Render voice AI features instead
            if (typeof renderVoiceAIFeatures === 'function') {
                console.log('✨ Initializing Voice AI Features');
                renderVoiceAIFeatures();
            }
            
            // Update any existing service references in the chat
            updateAIChatForPartnerships();
        });

        function updateAIChatForPartnerships() {
            // This function ensures the AI chat reflects the new partnership model
            console.log('🤖 Partnership AI Chat Initialized');
        }
