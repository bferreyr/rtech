# Environment Variables for WhatsApp Integration

Add these environment variables to your `.env` file:

```env
# WhatsApp / Twilio Configuration
TWILIO_ACCOUNT_SID=your_account_sid_here
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
WHATSAPP_NOTIFICATIONS_ENABLED=false
```

## Setup Instructions

### 1. Get Twilio Credentials

1. Create a Twilio account at https://www.twilio.com/try-twilio
2. Go to Console Dashboard
3. Copy your **Account SID** and **Auth Token**
4. For testing, use Twilio Sandbox: https://www.twilio.com/console/sms/whatsapp/sandbox
5. For production, register your own WhatsApp Business number

### 2. Configure Environment Variables

Replace the placeholder values in `.env`:
- `TWILIO_ACCOUNT_SID`: Your Twilio Account SID
- `TWILIO_AUTH_TOKEN`: Your Twilio Auth Token  
- `TWILIO_WHATSAPP_NUMBER`: Your WhatsApp-enabled number (sandbox or production)
- `WHATSAPP_NOTIFICATIONS_ENABLED`: Set to `true` to enable notifications

### 3. Test the Integration

1. Set `WHATSAPP_NOTIFICATIONS_ENABLED=true`
2. Go to Admin Settings (`/admin/settings`)
3. Use the "Send Test Message" feature
4. Enter your WhatsApp number (with country code, e.g., +5491123456789)
5. Check if you receive the test message

### 4. Production Setup

For production use:
1. Apply for WhatsApp Business API access through Twilio
2. Register your business phone number
3. Submit message templates for approval
4. Update `TWILIO_WHATSAPP_NUMBER` with your production number
5. Enable notifications: `WHATSAPP_NOTIFICATIONS_ENABLED=true`

## Message Templates

The following templates need to be submitted to WhatsApp for approval:

1. **Order Confirmation** - Sent when order is created
2. **Payment Confirmed** - Sent when payment is verified
3. **Order Shipped** - Sent when tracking URL is added
4. **Order Delivered** - Sent when status changes to DELIVERED
5. **Order Cancelled** - Sent when order is cancelled

## Testing with Twilio Sandbox

1. Join the Twilio WhatsApp Sandbox by sending the join code to the sandbox number
2. Use the sandbox number as `TWILIO_WHATSAPP_NUMBER`
3. Test messages will be sent from the sandbox
4. Note: Sandbox has limitations and is for testing only

## Cost Considerations

- **Twilio Sandbox**: Free for testing
- **Production**: ~$0.005 USD per message
- **Estimated monthly cost** (100 orders × 3 messages): ~$1.50 USD
