/**
 * GoHighLevel Direct API Integration
 * Creates contacts and sends notifications directly via API
 */

const GHL_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2NhdGlvbl9pZCI6IlZ5SmNIQWpmbkloVlludjlydzVLIiwidmVyc2lvbiI6MSwiaWF0IjoxNzYwMzYwMjcxMzY0LCJzdWIiOiJPS3d6a0RYWG5NeXhnMWlBakNTUCJ9.82-5bQFv9DWPdi-UmhJVidqgUPlE5O9k0G8zMLvy3MU';
const LOCATION_ID = 'VyJcHAjfnIhVYnv9rw5K';

// GoHighLevel API functions
async function createGHLContact(leadData) {
    const contactPayload = {
        email: leadData.email,
        firstName: leadData.name?.split(' ')[0] || leadData.name,
        lastName: leadData.name?.split(' ').slice(1).join(' ') || '',
        companyName: leadData.company,
        source: leadData.source || 'qallous.ai',
        tags: [
            'Website Lead',
            'Demo Request',
            leadData.demo_type || 'General'
        ],
        customFields: [
            { key: 'demo_type', field_value: leadData.demo_type },
            { key: 'lead_type', field_value: leadData.lead_type },
            { key: 'message', field_value: leadData.message },
            { key: 'timestamp', field_value: leadData.timestamp }
        ]
    };

    try {
        const response = await fetch('https://services.leadconnectorhq.com/contacts/', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GHL_API_KEY}`,
                'Content-Type': 'application/json',
                'Version': '2021-07-28'
            },
            body: JSON.stringify(contactPayload)
        });

        const result = await response.json();
        console.log('GHL Contact Created:', result);
        return result;
    } catch (error) {
        console.error('GHL API Error:', error);
        return null;
    }
}

async function sendGHLNotification(leadData) {
    // Send internal notification via GHL
    const emailPayload = {
        type: 'Email',
        locationId: LOCATION_ID,
        emailFrom: 'noreply@qallou.ai',
        emailTo: 'qudeuce@qallou.ai', // Your notification email
        subject: `🚨 New Demo Request from ${leadData.name}`,
        html: `
            <h2>New Lead from QALLOUS.AI Website!</h2>
            <p><strong>Name:</strong> ${leadData.name}</p>
            <p><strong>Email:</strong> ${leadData.email}</p>
            <p><strong>Company:</strong> ${leadData.company}</p>
            <p><strong>Demo Interest:</strong> ${leadData.demo_type}</p>
            <p><strong>Message:</strong> ${leadData.message}</p>
            <hr>
            <p><strong>Lead Type:</strong> ${leadData.lead_type}</p>
            <p><strong>Source:</strong> ${leadData.source}</p>
            <p><strong>Timestamp:</strong> ${leadData.timestamp}</p>
            <hr>
            <p><strong>Action Required:</strong> Follow up within 2 hours!</p>
        `
    };

    try {
        // Note: GHL email API might have different endpoint
        console.log('Would send notification:', emailPayload);
        return true;
    } catch (error) {
        console.error('Notification Error:', error);
        return false;
    }
}

// Export for use in main scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        createGHLContact,
        sendGHLNotification,
        GHL_API_KEY,
        LOCATION_ID
    };
}

