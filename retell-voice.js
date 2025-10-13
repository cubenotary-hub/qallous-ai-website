/**
 * Retell.AI Voice Receptionist Integration
 * Voice AI that answers FAQs and discusses case studies for QALLOUS.AI
 */

// Retell.AI Configuration
const RETELL_CONFIG = {
    // Note: Replace with your actual Retell.AI API key from dashboard
    apiKey: 'YOUR_RETELL_API_KEY',
    agentId: 'YOUR_AGENT_ID',
    
    // Knowledge Base - FAQs and Case Studies
    knowledgeBase: {
        companyInfo: {
            name: "QALLOUS.AI",
            tagline: "AI-Augmented Workforce 2.0",
            mission: "Providing AI-augmented professionals that deliver 10x faster results",
            value_proposition: "Human professionals amplified by AI colleagues with verified Fortune 500 experience"
        },
        
        faqs: [
            {
                question: "What is QALLOUS.AI?",
                answer: "QALLOUS.AI is an AI-augmented staffing platform that provides human professionals enhanced with AI partners. We match you with AI colleagues that have better resumes than most humans, delivering 10x faster execution and 95% better outcomes."
            },
            {
                question: "What partnerships do you offer?",
                answer: "We currently offer 6 AI-augmented partnerships: CEO with Sage Strategic Advisor AI (FREE), Product Manager with AI PM Bot (FREE), Business Owner with AI Voice Receptionist (FREE), CTO with Chief Architect AI, CMO with Marketing Genius AI, and CFO with Financial Strategist AI."
            },
            {
                question: "Which partnerships are free?",
                answer: "We have a TRIPLE FREE OFFER for a limited time: CEO plus Sage AI, Product Manager plus AI PM Bot, and Business Owner plus AI Voice Receptionist. These are completely free to try right now!"
            },
            {
                question: "How do I request a partnership?",
                answer: "For the free partnerships, you can try them directly on our website. For CTO, CMO, and CFO partnerships, click the 'Request Augment' button to send an email to qudeuce@qallou.ai with your details."
            },
            {
                question: "What AI tools do you use?",
                answer: "Our AI Arsenal includes Design Engine for creative concepts, Code Engine for development, Strategy Engine for predictive analytics, and Copy Engine for content generation. All tools give our professionals superhuman capabilities."
            },
            {
                question: "How fast are the results?",
                answer: "Our AI-augmented professionals deliver 7x to 24x faster execution depending on the role. For example, our CEO partnership delivers 10x faster execution, while our Voice Receptionist delivers 24x faster results."
            },
            {
                question: "What is Sage AI?",
                answer: "Sage is our Strategic Advisor AI with 30+ years Fortune 500 CEO experience, 15 successful IPOs, and $50 billion in M&A transactions. It's currently FREE and provides expert advice on IPO preparation, M&A strategy, crisis management, and strategic planning."
            },
            {
                question: "Can I try a demo?",
                answer: "Yes! You can try Sage AI for free on our website, access the AI Product Manager Bot demo, or experience the AI Voice Receptionist demo. All are available at no cost for a limited time."
            },
            {
                question: "How do you ensure quality?",
                answer: "All our AI partners have verified Fortune 500 experience and proven track records. We deliver 90-98% better outcomes with time savings of 10-30 hours per week."
            },
            {
                question: "What industries do you serve?",
                answer: "We serve all industries with executive-level AI augmentation. Our partnerships work across technology, finance, marketing, healthcare, legal, and any business requiring C-level expertise."
            }
        ],
        
        caseStudies: [
            {
                title: "CEO + Sage AI - Strategic Planning Success",
                industry: "Technology",
                results: "10x faster execution, 95% better outcomes, 15 hours saved per week",
                description: "A tech CEO used Sage AI to prepare for their IPO. Sage provided strategic planning, M&A strategy, and crisis management expertise, resulting in a successful $100M IPO in record time."
            },
            {
                title: "Product Manager + AI PM Bot - Sprint Acceleration",
                industry: "Software",
                results: "12x faster sprint planning, 93% better outcomes, 16 hours saved per week",
                description: "A product team integrated the AI PM Bot for sprint planning and backlog management. The bot automated user story creation and feature prioritization, accelerating development cycles by 300%."
            },
            {
                title: "Business Owner + AI Voice Receptionist",
                industry: "Professional Services",
                results: "24x faster operations, 97% better outcomes, 30 hours saved per week",
                description: "A consulting firm deployed our AI Voice Receptionist for 24/7 call handling. The AI handled appointment scheduling, customer queries, and lead qualification, freeing up 30 hours weekly for revenue-generating activities."
            },
            {
                title: "CTO + Chief Architect AI - System Design",
                industry: "Enterprise",
                results: "8x faster execution, 92% better outcomes, 12 hours saved per week",
                description: "An enterprise CTO leveraged Chief Architect AI for system design and team scaling. The AI provided AWS solutions architecture and tech strategy, reducing technical debt by 40%."
            },
            {
                title: "CMO + Marketing Genius AI - Campaign Success",
                industry: "E-commerce",
                results: "7x faster execution, 90% better outcomes, 10 hours saved per week",
                description: "An e-commerce CMO used Marketing Genius AI for campaign optimization. The AI analyzed market trends and optimized ROI, resulting in a 250% increase in conversion rates."
            },
            {
                title: "CFO + Financial Strategist AI - M&A Deal",
                industry: "Finance",
                results: "9x faster execution, 94% better outcomes, 14 hours saved per week",
                description: "A CFO partnered with Financial Strategist AI for a major acquisition. The AI provided financial modeling and risk assessment, closing a $50M deal 60% faster than traditional methods."
            }
        ],
        
        services: [
            "AI-Augmented Professional Partnerships",
            "Strategic Advisory (Sage AI)",
            "Product Management Automation",
            "Voice AI Receptionist",
            "Technical Architecture Consulting",
            "Marketing Optimization",
            "Financial Planning & Analysis"
        ],
        
        contactInfo: {
            email: "qudeuce@qallou.ai",
            requestAugment: "Email qudeuce@qallou.ai to request a custom partnership",
            freeDemos: "Try our FREE demos: Sage AI, AI PM Bot, Voice Receptionist"
        }
    }
};

// Initialize Retell Voice Client
let retellClient = null;
let isCallActive = false;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    const voiceBtn = document.getElementById('voice-receptionist-btn');
    
    if (!voiceBtn) {
        console.error('Voice receptionist button not found');
        return;
    }

    // Initialize Retell Client
    try {
        // Check if Retell SDK is loaded
        if (typeof RetellWebClient !== 'undefined') {
            retellClient = new RetellWebClient();
            console.log('✅ Retell.AI Voice Client initialized');
        } else {
            console.warn('⚠️ Retell SDK not loaded - Using fallback mode');
        }
    } catch (error) {
        console.error('Failed to initialize Retell client:', error);
    }

    // Voice button click handler
    voiceBtn.addEventListener('click', async function() {
        if (isCallActive) {
            // End call
            await endVoiceCall();
        } else {
            // Start call
            await startVoiceCall();
        }
    });

    // Show tooltip on page load
    setTimeout(() => {
        showVoiceTooltip();
    }, 3000);
});

async function startVoiceCall() {
    const voiceBtn = document.getElementById('voice-receptionist-btn');
    
    try {
        // Add active state
        voiceBtn.classList.add('active');
        isCallActive = true;
        
        // Change icon to active
        const icon = voiceBtn.querySelector('i');
        icon.className = 'fas fa-phone-volume';

        if (retellClient) {
            // Start Retell.AI call
            await retellClient.startCall({
                apiKey: RETELL_CONFIG.apiKey,
                agentId: RETELL_CONFIG.agentId,
                sampleRate: 24000, // 24kHz for better quality
                enableUpdate: true,
                customData: {
                    source: 'qallous.ai',
                    timestamp: new Date().toISOString()
                }
            });

            // Listen for call events
            retellClient.on('call-started', () => {
                console.log('📞 Voice call started');
                showCallStatus('Connected! How can I help you?', 'success');
            });

            retellClient.on('call-ended', () => {
                console.log('📞 Voice call ended');
                endVoiceCall();
            });

            retellClient.on('error', (error) => {
                console.error('Voice call error:', error);
                showCallStatus('Call error. Please try again.', 'error');
                endVoiceCall();
            });

            retellClient.on('agent-start-talking', () => {
                voiceBtn.style.animation = 'voice-pulse 0.8s infinite';
            });

            retellClient.on('agent-stop-talking', () => {
                voiceBtn.style.animation = '';
            });
        } else {
            // Fallback mode - show instructions
            showCallStatus('Voice AI receptionist would answer here. Please add your Retell.AI API key.', 'info');
            
            // Auto-end after 3 seconds in fallback mode
            setTimeout(() => {
                endVoiceCall();
            }, 3000);
        }

        // Track call in GHL
        if (typeof sendToGoHighLevel === 'function') {
            sendToGoHighLevel({
                email: 'voice-interaction@qallou.ai',
                name: 'Voice AI Call',
                demo_type: 'Voice Receptionist',
                lead_type: 'voice_call',
                source: 'voice_ai_button',
                timestamp: new Date().toISOString()
            }).catch(err => console.error('GHL tracking error:', err));
        }

    } catch (error) {
        console.error('Failed to start voice call:', error);
        showCallStatus('Failed to connect. Please try again.', 'error');
        endVoiceCall();
    }
}

async function endVoiceCall() {
    const voiceBtn = document.getElementById('voice-receptionist-btn');
    
    try {
        if (retellClient && isCallActive) {
            await retellClient.stopCall();
        }
        
        // Remove active state
        voiceBtn.classList.remove('active');
        isCallActive = false;
        
        // Reset icon
        const icon = voiceBtn.querySelector('i');
        icon.className = 'fas fa-microphone';
        
        // Clear any status messages
        setTimeout(() => {
            const statusEl = document.querySelector('.voice-call-status');
            if (statusEl) statusEl.remove();
        }, 2000);

    } catch (error) {
        console.error('Failed to end voice call:', error);
    }
}

function showCallStatus(message, type = 'info') {
    // Remove existing status
    const existing = document.querySelector('.voice-call-status');
    if (existing) existing.remove();

    // Create status element
    const statusEl = document.createElement('div');
    statusEl.className = 'voice-call-status';
    statusEl.style.cssText = `
        position: fixed;
        bottom: 180px;
        right: 30px;
        background: ${type === 'success' ? 'rgba(0, 255, 136, 0.95)' : type === 'error' ? 'rgba(255, 71, 87, 0.95)' : 'rgba(0, 212, 255, 0.95)'};
        color: ${type === 'info' ? 'var(--primary)' : 'white'};
        padding: 1rem 1.5rem;
        border-radius: 12px;
        font-size: 0.9rem;
        z-index: 9998;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        animation: slideIn 0.3s ease;
        max-width: 300px;
    `;
    statusEl.textContent = message;
    document.body.appendChild(statusEl);

    // Add animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateX(100px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
    `;
    document.head.appendChild(style);
}

function showVoiceTooltip() {
    const tooltip = document.createElement('div');
    tooltip.style.cssText = `
        position: fixed;
        bottom: 190px;
        right: 30px;
        background: linear-gradient(135deg, #00ff88, #00d4ff);
        color: var(--primary);
        padding: 1rem 1.5rem;
        border-radius: 12px;
        font-size: 0.9rem;
        font-weight: 600;
        z-index: 9998;
        box-shadow: 0 10px 40px rgba(0, 255, 136, 0.4);
        animation: slideIn 0.3s ease, fadeOut 0.3s ease 5s forwards;
        white-space: nowrap;
    `;
    tooltip.innerHTML = '💬 Talk to QALLOUS.AI Voice Receptionist!';
    document.body.appendChild(tooltip);

    setTimeout(() => {
        tooltip.remove();
    }, 5300);
}

// Export knowledge base for other scripts
window.QALLOUS_KNOWLEDGE_BASE = RETELL_CONFIG.knowledgeBase;

console.log('🎙️ Retell.AI Voice Receptionist Ready!');
console.log('📚 Knowledge Base Loaded:', Object.keys(RETELL_CONFIG.knowledgeBase));

