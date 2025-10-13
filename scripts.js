    // Partnership data - will be moved to external config later
    const PARTNERSHIPS = [
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
            price: "$4,500/month"
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
            price: "$4,000/month"
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
            price: "$4,500/month"
        },
        {
            id: "legal-partnership",
            humanRole: "Legal Counsel",
            aiPartner: {
                name: "Legal Expert AI",
                qualifications: ["JD, Yale Law", "Supreme Court Clerk", "15 Years Big Law"],
                avatar: "⚖️",
                specialties: ["Contract Review", "Compliance", "Legal Research"]
            },
            synergy: {
                speed: "12x",
                outcomes: "98%", 
                timeSaved: "18h/week"
            },
            price: "$3,500/month"
        },
        {
            id: "dev-partnership",
            humanRole: "Lead Developer",
            aiPartner: {
                name: "Code Architect AI",
                qualifications: ["CS PhD, MIT", "10 Years Principal Engineer", "System Design Expert"],
                avatar: "👨‍💻",
                specialties: ["System Design", "Code Review", "Architecture Planning"]
            },
            synergy: {
                speed: "15x",
                outcomes: "96%",
                timeSaved: "20h/week" 
            },
            price: "$3,000/month"
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
            demoLink: "/demos/voice-agent-demo/",
            description: "AI-powered voice receptionist that handles calls, schedules appointments, and qualifies leads"
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
                        <a href="${partnership.demoLink}" class="btn btn-primary" style="width: 100%; background: linear-gradient(135deg, #00ff88, #00d4ff); font-size: 1.1rem; padding: 1rem; text-decoration: none;">
                            ${partnership.id === 'pm-partnership' ? '📱 Try AI PM Bot FREE' : '📞 Try Voice Agent FREE'}
                        </a>
                        <p style="text-align: center; margin-top: 0.5rem; font-size: 0.75rem; color: var(--gray);">Live Demo • FREE Access</p>
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
                    const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.health}`);
                    return response.ok;
                } catch {
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
            const retryBtn = event.target;
            const originalText = retryBtn.innerHTML;
            retryBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Connecting...';
            retryBtn.disabled = true;

            try {
                const isHealthy = await QallousAPI.healthCheck();
                updateAPIStatus(isHealthy);
                updateAPIStatusModal();
                
                if (isHealthy) {
                    alert('✅ Successfully connected to API!');
                } else {
                    alert('⚠️ Could not connect to API. Please check if the backend is running.');
                }
            } catch (error) {
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
        QallousAPI.healthCheck().then(isHealthy => {
            updateAPIStatus(isHealthy);
            if (isHealthy) {
                console.log('✅ Qallous.ai API Connected');
            } else {
                console.warn('⚠️ Qallous.ai API Unavailable - Using demo mode');
            }
        });

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

        // Header background change on scroll
        window.addEventListener('scroll', function() {
            const header = document.querySelector('header');
            if (window.scrollY > 50) {
                header.style.background = 'rgba(2, 6, 23, 0.95)';
                header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.2)';
            } else {
                header.style.background = 'rgba(2, 6, 23, 0.8)';
                header.style.boxShadow = 'none';
            }
        });

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

        // Updated AI Responses for Augmented Partnership
        const aiResponses = {
            greeting: [
                "🤝 Hello! I'm your AI guide to human-AI partnerships! Ready to find your perfect AI colleague?",
                "🚀 Welcome to the augmented workforce revolution! I help professionals like you find AI partners with verified Fortune 500 experience.",
                "👑 Greetings! I'm here to match you with AI colleagues that have better resumes than most humans. What role would you like to augment?"
            ],
            services: [
                "We specialize in human-AI partnerships! CEOs with Sage advisor, Product Managers with AI PM Bot, Business Owners with Voice Receptionist, CTOs with AI architects, and more. Which role would you like to amplify?",
                "Our augmented partnerships combine human leadership with AI execution. NEW: Try our AI PM Bot or Voice Receptionist FREE! We also have AI colleagues for executives, developers, legal professionals, and finance leaders.",
                "We create powerful duos: Human expertise + AI execution. 🎉 3 FREE options: Sage CEO Advisor, AI PM Bot (mobile app), Voice Receptionist. Plus premium partnerships with verified Fortune 500 experience. Which interests you?"
            ],
            pricing: [
                "🎉 TRIPLE FREE OFFER: Try CEO + Sage, AI PM Bot, OR AI Voice Receptionist absolutely FREE! Limited time. Other partnerships start at $3,000/month.",
                "Get started FREE with your choice: Sage CEO Advisor, AI Product Manager Bot, or AI Voice Receptionist! Limited time offer. Other partnerships from $3,000/month.",
                "3 FREE AI Partners available now: 1) CEO Strategic Advisor, 2) Product Manager Bot, 3) Voice Receptionist. Experience AI-augmented work with zero commitment!"
            ],
            contact: [
                "Ready to meet your AI partner? Take our 2-minute matching quiz to find your perfect augmentation match!",
                "Let's find your AI counterpart! Would you like to see which AI colleague has the ideal resume to complement your skills?",
                "Time to amplify your career! What's the best way to connect you with your future AI partner?"
            ],
            default: [
                "Fascinating! Our augmented partnerships can handle that challenge and more. What's your primary professional role?",
                "Perfect! Our human-AI duos excel at complex professional challenges. What specific outcomes are you looking to achieve?",
                "Excellent! I specialize in matching professionals with AI colleagues. What role would you like to augment with AI superpowers?"
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
            messageDiv.textContent = text;
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
            
            if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
                return aiResponses.greeting[Math.floor(Math.random() * aiResponses.greeting.length)];
            } else if (message.includes('service') || message.includes('what do you do') || message.includes('offer')) {
                return aiResponses.services[Math.floor(Math.random() * aiResponses.services.length)];
            } else if (message.includes('price') || message.includes('cost') || message.includes('how much')) {
                return aiResponses.pricing[Math.floor(Math.random() * aiResponses.pricing.length)];
            } else if (message.includes('contact') || message.includes('reach') || message.includes('demo')) {
                return aiResponses.contact[Math.floor(Math.random() * aiResponses.contact.length)];
            } else {
                return aiResponses.default[Math.floor(Math.random() * aiResponses.default.length)];
            }
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

        // GoHighLevel Integration
        const GHL_WEBHOOK_URL = 'https://services.leadconnectorhq.com/hooks/VyJcHAjfnIhVYnv9rw5K/webhook-trigger/e72f8def-b814-41aa-a407-54073461cdf7';

        async function sendToGoHighLevel(leadData) {
            try {
                const response = await fetch(GHL_WEBHOOK_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(leadData)
                });
                
                if (response.ok) {
                    console.log('Lead sent to GoHighLevel successfully');
                    return true;
                } else {
                    console.error('GHL webhook error:', response.statusText);
                    return false;
                }
            } catch (error) {
                console.error('Error sending to GoHighLevel:', error);
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

        document.getElementById('projectForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('projectName').value;
            const email = document.getElementById('projectEmail').value;
            const company = document.getElementById('projectCompany').value;
            const service = document.getElementById('projectService').value;
            const budget = document.getElementById('projectBudget').value;
            const timeline = document.getElementById('projectTimeline').value;
            const description = document.getElementById('projectDescription').value;
            
            if (name && email && company && service && budget && timeline && description) {
                closeModal('projectModal');
                alert('Project request submitted! Our AI-augmented team will review your requirements and get back to you within 2 hours.');
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
