import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

const LIFX_API_BASE = 'https://api.lifx.com/v1';
const DEFAULT_SELECTOR = 'label:Vibes';

// Get the API token from environment variables
const LIFX_TOKEN = process.env.LIFX_API_TOKEN;
const ENABLE_BREATHE = process.env.ENABLE_BREATHE_EFFECT !== 'false';

const headers = {
    'Authorization': `Bearer ${LIFX_TOKEN}`,
    'Content-Type': 'application/json'
};

export async function VibeTriggers(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    try {
        const action = request.query.get('action');
        const selector = request.query.get('selector') || DEFAULT_SELECTOR;

        switch (action) {
            case 'getLights':
                return await getLights(selector);

            case 'setState':
                const state = await request.json();
                return await setState(state, selector);

            case 'togglePower':
                return await togglePower(selector);

            case 'breathe':
                if (!ENABLE_BREATHE) {
                    return { status: 400, body: 'Breathe effect is disabled' };
                }
                const options = await request.json();
                return await breathe(options, selector);

            default:
                return { status: 400, body: 'Invalid action' };
        }
    } catch (error) {
        context.error('Error processing request:', error);
        return {
            status: 500,
            body: 'Internal server error'
        };
    }
}

async function getLights(selector: string) {
    const response = await fetch(`${LIFX_API_BASE}/lights/${selector}`, { headers });
    if (!response.ok) throw new Error('Failed to fetch lights');
    const data = await response.json();
    return { body: JSON.stringify(data) };
}

async function setState(state: any, selector: string) {
    const payload: any = {};

    if ('power' in state) {
        payload.power = state.power;
    }

    if ('brightness' in state && typeof state.brightness === 'number') {
        payload.brightness = state.brightness / 100;
    }

    if ('color' in state) {
        payload.color = state.color;
    }

    const response = await fetch(`${LIFX_API_BASE}/lights/${selector}/state`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(payload)
    });

    if (!response.ok) throw new Error('Failed to set light state');
    const data = await response.json();
    return { body: JSON.stringify(data) };
}

async function togglePower(selector: string) {
    const response = await fetch(`${LIFX_API_BASE}/lights/${selector}/toggle`, {
        method: 'POST',
        headers
    });
    if (!response.ok) throw new Error('Failed to toggle power');
    const data = await response.json();
    return { body: JSON.stringify(data) };
}

async function breathe(options: any = {}, selector: string) {
    const defaults = {
        period: 2,
        cycles: 3,
        persist: false,
        power_on: true,
        peak: 0.5
    };

    const payload = {
        ...defaults,
        ...options,
        color: options.color || options.from_color ? options.color : undefined,
        from_color: options.from_color
    };

    const response = await fetch(`${LIFX_API_BASE}/lights/${selector}/effects/breathe`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
    });

    if (!response.ok) throw new Error('Failed to apply breathe effect');
    const data = await response.json();
    return { body: JSON.stringify(data) };
}

app.http('VibeTriggers', {
    methods: ['GET', 'POST', 'PUT'],
    authLevel: 'anonymous',
    handler: VibeTriggers
});
