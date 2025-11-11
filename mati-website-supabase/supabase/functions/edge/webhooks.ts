import { serve } from 'std/http';

export const handler = serve(async (req) => {
    const { method, url } = req;

    if (method === 'POST') {
        const body = await req.json();
        // Process the webhook payload
        // Example: Handle different event types
        switch (body.event) {
            case 'user.created':
                // Handle user creation
                break;
            case 'user.updated':
                // Handle user update
                break;
            // Add more cases as needed
            default:
                return new Response('Event not handled', { status: 400 });
        }
        return new Response('Webhook processed', { status: 200 });
    }

    return new Response('Method not allowed', { status: 405 });
});