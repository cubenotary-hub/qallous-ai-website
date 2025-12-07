// Secure GoHighLevel API Proxy for Vercel Serverless Functions
// This keeps the API key secure on the server side

module.exports = async (req, res) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Get API key from environment variable (set in Vercel dashboard)
    const GHL_API_KEY = process.env.GHL_API_KEY;
    const GHL_WEBHOOK_URL = process.env.GHL_WEBHOOK_URL;

    if (!GHL_API_KEY) {
        console.error('GHL_API_KEY environment variable not set');
        return res.status(500).json({ error: 'Server configuration error' });
    }

    try {
        const leadData = req.body;

        // Validate required fields
        if (!leadData || !leadData.email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        // Sanitize and prepare contact payload
        const contactPayload = {
            email: String(leadData.email || '').trim(),
            firstName: String(leadData.name?.split(' ')[0] || 'Lead').trim(),
            lastName: String(leadData.name?.split(' ').slice(1).join(' ') || '').trim(),
            companyName: String(leadData.company || '').trim(),
            source: String(leadData.source || 'qallous.ai').trim(),
            tags: [
                'Website Lead',
                'Demo Request',
                String(leadData.demo_type || 'General').trim()
            ],
            customFields: [
                { key: 'demo_type', field_value: String(leadData.demo_type || '').trim() },
                { key: 'lead_type', field_value: String(leadData.lead_type || '').trim() },
                { key: 'message', field_value: String(leadData.message || '').trim() }
            ]
        };

        // Send to both webhook (if configured) and API
        const promises = [];
        
        if (GHL_WEBHOOK_URL) {
            promises.push(
                fetch(GHL_WEBHOOK_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(leadData)
                }).catch(err => {
                    console.error('Webhook error:', err);
                    return { ok: false };
                })
            );
        }
        
        promises.push(
            fetch('https://services.leadconnectorhq.com/contacts/', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${GHL_API_KEY}`,
                    'Content-Type': 'application/json',
                    'Version': '2021-07-28'
                },
                body: JSON.stringify(contactPayload)
            }).catch(err => {
                console.error('API error:', err);
                return { ok: false, json: () => Promise.resolve({}) };
            })
        );

        const results = await Promise.allSettled(promises);

        // Check results
        const webhookResult = GHL_WEBHOOK_URL ? results[0] : null;
        const apiResult = GHL_WEBHOOK_URL ? results[1] : results[0];

        const webhookSuccess = !GHL_WEBHOOK_URL || (webhookResult?.status === 'fulfilled' && webhookResult.value.ok);
        const apiSuccess = apiResult.status === 'fulfilled' && apiResult.value.ok;

        if (apiSuccess) {
            let apiResponse;
            try {
                apiResponse = await apiResult.value.json();
            } catch (e) {
                apiResponse = { contact: { id: 'created' } };
            }
            
            return res.status(200).json({
                success: true,
                webhook: webhookSuccess,
                contact: apiResponse.contact || { id: 'created' }
            });
        } else {
            console.error('GHL API Error:', apiResult.status === 'rejected' ? apiResult.reason : 'Unknown error');
            return res.status(500).json({
                success: false,
                error: 'Failed to create contact',
                webhook: webhookSuccess
            });
        }

    } catch (error) {
        console.error('GHL Proxy Error:', error);
        return res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
};
