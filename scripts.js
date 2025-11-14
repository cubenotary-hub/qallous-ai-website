    // Partnership data - will be moved to external config later
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
        
        messageDiv.innerHTML = `
            <div style="margin-bottom: 0.5rem;">
                <strong style="color: ${sender === 'user' ? 'var(--accent)' : 'var(--neon-purple)'};">${sender === 'user' ? '👤 You' : '👑 Sage'}</strong>
                ${metadata.confidence ? `<span style="font-size: 0.8rem; color: var(--gray); margin-left: 0.5rem;">Confidence: ${(metadata.confidence * 100).toFixed(0)}%</span>` : ''}
            </div>
            <div style="color: var(--light); line-height: 1.7;">${message.replace(/\n/g, '<br>')}</div>
            ${metadata.reasoning ? `<div style="margin-top: 1rem; padding: 0.8rem; background: rgba(0,0,0,0.3); border-radius: 8px; font-size: 0.85rem; color: var(--gray);">💡 ${metadata.reasoning}</div>` : ''}
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
        list.innerHTML = questions.map(q => `<button onclick="document.getElementById('sage-question-input').value='${q.replace(/'/g, "\\'")}'; askSageQuestion();" 
                style="background: rgba(0, 212, 255, 0.1); border: 1px solid rgba(0, 212, 255, 0.3); color: var(--accent); padding: 0.5rem 1rem; border-radius: 20px; cursor: pointer; font-size: 0.85rem; transition: all 0.2s;" 
                onmouseover="this.style.background='rgba(0, 212, 255, 0.2)'" onmouseout="this.style.background='rgba(0, 212, 255, 0.1)'">${q}</button>`).join('');
        container.style.display = 'block';
    }

    // Render partnership cards
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

    // Initialize on load - will be properly integrated later
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', renderPartnershipCards);
    } else {
        renderPartnershipCards();
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

        // Simple smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            });
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
                "🤖 Hello! I'm your AI Receptionist from QALLOUS.AI! Ready to experience the future of work with our AI-augmented workforce?",
                "🚀 Welcome! I'm here to help you find the perfect AI partnership. We've helped companies achieve 10-24x faster results. What brings you here today?",
                "👋 Hi there! I can answer questions about our partnerships, show you case studies, or connect you with our team at qudeuce@qallous.ai. How can I help?"
            ],
            services: [
                "We offer 6 AI-augmented partnerships: CEO+Sage AI, Product Manager+AI Bot, Business Owner+Voice Agent, CTO+Architect AI, CMO+Marketing AI, and CFO+Finance AI. 🎉 3 are FREE! Which interests you?",
                "Our partnerships combine human expertise with Fortune 500-level AI colleagues. Check out our <a href='case-studies.html' style='color: var(--neon-blue);'>Case Studies</a> to see real results: $8.5M raised, 50K users scaled, 97% satisfaction achieved!",
                "We create powerful human-AI duos! 🎉 FREE: Sage CEO Advisor (30+ years), AI PM Bot (mobile-first), Voice Receptionist (24/7). Premium: CTO, CMO, CFO partnerships. Want to see our <a href='case-studies.html' style='color: var(--neon-blue);'>success stories</a>?"
            ],
            pricing: [
                "🎉 TRIPLE FREE OFFER: CEO+Sage AI, AI PM Bot, or Voice Receptionist - completely FREE! Premium partnerships from $3,000-5,000/month. Check our <a href='faq.html' style='color: var(--neon-blue);'>FAQ</a> for details!",
                "FREE partnerships available now! Try before you buy. For pricing details and custom quotes, visit our <a href='faq.html' style='color: var(--neon-blue);'>FAQ page</a> or email qudeuce@qallous.ai",
                "Get started FREE with Sage AI, AI PM Bot, or Voice Receptionist! Other partnerships: CTO ($3,500/mo), CMO ($3,500/mo), CFO ($4,000/mo). Questions? See <a href='faq.html' style='color: var(--neon-blue);'>FAQ</a>"
            ],
            contact: [
                "📧 Email us directly at <a href='mailto:qudeuce@qallous.ai' style='color: var(--neon-blue);'>qudeuce@qallous.ai</a> for partnership requests, demos, or questions. We typically respond within 2 hours!",
                "Want to get started? Email <a href='mailto:qudeuce@qallous.ai' style='color: var(--neon-blue);'>qudeuce@qallous.ai</a> or take our 2-minute matching quiz to find your perfect AI partner!",
                "Ready to transform your business? Contact qudeuce@qallous.ai for demos and consultations. Or explore our <a href='case-studies.html' style='color: var(--neon-blue);'>case studies</a> first!"
            ],
            faq: [
                "Great question! I'd recommend checking our comprehensive <a href='faq.html' style='color: var(--neon-blue);'>FAQ page</a> - it covers partnerships, pricing, security, getting started, and more! Or email qudeuce@qallous.ai",
                "You can find detailed answers in our <a href='faq.html' style='color: var(--neon-blue);'>FAQ section</a>! Topics include: What is QALLOUS.AI, partnerships offered, pricing, security (GDPR/HIPAA/SOC2), and how to start.",
                "Check out our <a href='faq.html' style='color: var(--neon-blue);'>FAQ page</a> for detailed information! Can't find what you need? Email qudeuce@qallous.ai and we'll help immediately."
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
                "🎉 3 FREE partnerships: 1) CEO+Sage AI (30+ years Fortune 500), 2) AI PM Bot (mobile app for sprint planning), 3) Voice Receptionist (24/7 availability). Try them all! Which first?",
                "FREE TIER: CEO Strategic Advisor, Product Manager Bot, or Voice Agent - no credit card needed! These are full-featured, not trials. Start now or email qudeuce@qallous.ai!",
                "Limited-time FREE offer: Sage AI (IPO/M&A expert), AI PM Bot (backlog genius), Voice Receptionist (never miss calls). See <a href='faq.html' style='color: var(--neon-blue);'>FAQ</a> for details!"
            ],
            security: [
                "Security is our priority! We're GDPR, HIPAA, SOC2, and ISO27001 compliant. Enterprise-grade encryption, 99.9% uptime, regular audits. Questions? See <a href='faq.html#security' style='color: var(--neon-blue);'>security FAQ</a>",
                "Your data is safe! Full compliance with GDPR, HIPAA, SOC2, ISO27001. We never share data without consent. More details in our <a href='faq.html' style='color: var(--neon-blue);'>FAQ</a> or email qudeuce@qallous.ai",
                "Enterprise security standards: end-to-end encryption, compliance certifications (GDPR/HIPAA/SOC2/ISO27001), 98/100 security score. Trust but verify? Email qudeuce@qallous.ai"
            ],
            demo: [
                "Want a demo? Email <a href='mailto:qudeuce@qallous.ai?subject=Demo%20Request' style='color: var(--neon-blue);'>qudeuce@qallous.ai</a> to schedule! Or try our FREE partnerships instantly - no demo needed for Sage AI, AI PM Bot, or Voice Receptionist!",
                "Free partnerships are ready NOW (no demo needed)! For premium partnerships (CTO/CMO/CFO), email qudeuce@qallous.ai to schedule a personalized demo. We'll show real-time results!",
                "Try FREE: Sage AI, AI PM Bot, Voice Receptionist available immediately. Want CTO/CMO/CFO demo? Contact qudeuce@qallous.ai. Check <a href='case-studies.html' style='color: var(--neon-blue);'>case studies</a> first!"
            ],
            default: [
                "Interesting question! I can help with partnerships, pricing, case studies, FAQs, or connect you with our team. Try asking about a specific partnership or email qudeuce@qallous.ai!",
                "Let me help! I know about: 🤝 Partnerships, 💰 Pricing, 📊 Case Studies, ❓ FAQs, 🔒 Security. Or I can connect you with qudeuce@qallous.ai. What interests you?",
                "I'm here to help! Want to see <a href='case-studies.html' style='color: var(--neon-blue);'>success stories</a>? Check <a href='faq.html' style='color: var(--neon-blue);'>FAQs</a>? Or email qudeuce@qallous.ai? Let me know!"
            ]
        };

        // Chat functionality
        chatToggle.addEventListener('click', () => {
            isChatOpen = !isChatOpen;
            chatWindow.classList.toggle('active', isChatOpen);
            chatToggle.classList.toggle('pulse', !isChatOpen);
            
            if (isChatOpen) {
                chatInput.focus();
            }
        });

        chatClose.addEventListener('click', () => {
            isChatOpen = false;
            chatWindow.classList.remove('active');
            chatToggle.classList.add('pulse');
        });

        function addMessage(text, isUser = false) {
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${isUser ? 'user' : 'bot'}`;
            // Allow HTML in bot messages for links
            if (isUser) {
                messageDiv.textContent = text;
            } else {
                messageDiv.innerHTML = text;
            }
            chatMessages.appendChild(messageDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        function showTyping() {
            typingIndicator.style.display = 'flex';
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        function hideTyping() {
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

        chatSend.addEventListener('click', sendMessage);
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });

        // Auto-open chat after 10 seconds
        setTimeout(() => {
            if (!isChatOpen) {
                chatToggle.classList.add('pulse');
            }
        }, 10000);

        // Modal Functions
        function openLoginModal() {
            document.getElementById('loginModal').style.display = 'block';
        }

        function openSignupModal() {
            document.getElementById('signupModal').style.display = 'block';
        }

        function openDemoModal() {
            document.getElementById('demoModal').style.display = 'block';
        }

        function openProjectModal(serviceName) {
            document.getElementById('projectService').value = serviceName;
            document.getElementById('projectModal').style.display = 'block';
        }

        function closeModal(modalId) {
            document.getElementById(modalId).style.display = 'none';
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

        // GoHighLevel Direct API Integration
        const GHL_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2NhdGlvbl9pZCI6IlZ5SmNIQWpmbkloVlludjlydzVLIiwidmVyc2lvbiI6MSwiaWF0IjoxNzYwMzYwMjcxMzY0LCJzdWIiOiJPS3d6a0RYWG5NeXhnMWlBakNTUCJ9.82-5bQFv9DWPdi-UmhJVidqgUPlE5O9k0G8zMLvy3MU';
        const GHL_WEBHOOK_URL = 'https://services.leadconnectorhq.com/hooks/VyJcHAjfnIhVYnv9rw5K/webhook-trigger/e72f8def-b814-41aa-a407-54073461cdf7';

        async function sendToGoHighLevel(leadData) {
            // Send to both webhook AND create contact directly via API
            const results = await Promise.allSettled([
                // Method 1: Webhook (for workflow triggers)
                fetch(GHL_WEBHOOK_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(leadData)
                }),
                
                // Method 2: Direct API (creates contact immediately)
                createGHLContact(leadData)
            ]);

            const webhookSuccess = results[0].status === 'fulfilled' && results[0].value.ok;
            const apiSuccess = results[1].status === 'fulfilled' && results[1].value;

            console.log('GHL Integration:', { webhook: webhookSuccess, api: apiSuccess });
            return webhookSuccess || apiSuccess;
        }

        async function createGHLContact(leadData) {
            try {
                const contactPayload = {
                    email: leadData.email,
                    firstName: leadData.name?.split(' ')[0] || 'Lead',
                    lastName: leadData.name?.split(' ').slice(1).join(' ') || '',
                    companyName: leadData.company || '',
                    source: leadData.source || 'qallous.ai',
                    tags: [
                        'Website Lead',
                        'Demo Request',
                        leadData.demo_type || 'General'
                    ],
                    customFields: [
                        { key: 'demo_type', field_value: leadData.demo_type },
                        { key: 'lead_type', field_value: leadData.lead_type },
                        { key: 'message', field_value: leadData.message || '' }
                    ]
                };

                const response = await fetch('https://services.leadconnectorhq.com/contacts/', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${GHL_API_KEY}`,
                        'Content-Type': 'application/json',
                        'Version': '2021-07-28'
                    },
                    body: JSON.stringify(contactPayload)
                });

                if (response.ok) {
                    const result = await response.json();
                    console.log('✅ GHL Contact Created:', result.contact?.id);
                    return result;
                } else {
                    console.error('GHL API Error:', response.status, await response.text());
                    return null;
                }
            } catch (error) {
                console.error('Error creating GHL contact:', error);
                return null;
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

        // Form Submissions
        document.getElementById('loginForm').addEventListener('submit', async function(e) {
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
                    alert('Login successful! Welcome to your AI-augmented workforce portal.');
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

        document.getElementById('signupForm').addEventListener('submit', async function(e) {
            e.preventDefault();
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
        });

        document.getElementById('demoForm').addEventListener('submit', async function(e) {
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

        document.getElementById('projectForm').addEventListener('submit', async function(e) {
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
            if (typeof renderPartnershipCards === 'function') {
                console.log('✨ Initializing Partnership Features');
                renderPartnershipCards();
            }
            
            // Update any existing service references in the chat
            updateAIChatForPartnerships();
        });

        function updateAIChatForPartnerships() {
            // This function ensures the AI chat reflects the new partnership model
            console.log('🤖 Partnership AI Chat Initialized');
        }
