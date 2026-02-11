'use server';

import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const whatsappNumber = process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886';

let client: ReturnType<typeof twilio> | null = null;

function getClient() {
    if (!accountSid || !authToken) {
        console.warn('Twilio credentials not configured');
        return null;
    }

    if (!client) {
        client = twilio(accountSid, authToken);
    }

    return client;
}

export interface WhatsAppMessage {
    to: string; // Phone number with country code, e.g., '+5491123456789'
    body: string;
    mediaUrl?: string;
}

export async function sendWhatsAppMessage({ to, body, mediaUrl }: WhatsAppMessage) {
    const twilioClient = getClient();

    if (!twilioClient) {
        console.error('WhatsApp: Twilio client not initialized');
        return {
            success: false,
            error: 'WhatsApp service not configured',
        };
    }

    try {
        // Ensure phone number has whatsapp: prefix
        const formattedTo = to.startsWith('whatsapp:') ? to : `whatsapp:${to}`;

        const messageOptions: any = {
            from: whatsappNumber,
            to: formattedTo,
            body,
        };

        if (mediaUrl) {
            messageOptions.mediaUrl = [mediaUrl];
        }

        const message = await twilioClient.messages.create(messageOptions);

        console.log(`WhatsApp message sent: ${message.sid}`);

        return {
            success: true,
            messageId: message.sid,
            status: message.status,
        };
    } catch (error: any) {
        console.error('Error sending WhatsApp message:', error);
        return {
            success: false,
            error: error.message || 'Failed to send WhatsApp message',
            errorCode: error.code,
        };
    }
}

export async function sendWhatsAppTemplate({
    to,
    templateName,
    variables,
}: {
    to: string;
    templateName: string;
    variables: string[];
}) {
    // For now, we'll use regular messages
    // Template messages require approval and specific formatting
    // This is a placeholder for future template implementation
    console.log(`Template message not yet implemented: ${templateName}`);
    return {
        success: false,
        error: 'Template messages not yet implemented',
    };
}

export function formatPhoneNumber(phone: string): string {
    // Remove all non-numeric characters
    let cleaned = phone.replace(/\D/g, '');

    // If it starts with 54 (Argentina), ensure it has +
    if (cleaned.startsWith('54')) {
        return `+${cleaned}`;
    }

    // If it doesn't start with country code, assume Argentina (+54)
    if (!cleaned.startsWith('+')) {
        return `+54${cleaned}`;
    }

    return cleaned;
}

export function isValidPhoneNumber(phone: string): boolean {
    const formatted = formatPhoneNumber(phone);
    // Basic validation: should start with + and have at least 10 digits
    return /^\+\d{10,15}$/.test(formatted);
}
