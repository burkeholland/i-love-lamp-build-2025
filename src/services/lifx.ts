const LIFX_API_BASE = 'https://api.lifx.com/v1';
const DEFAULT_SELECTOR = 'label:Vibes';

// Get the API token from environment variables
const LIFX_TOKEN = import.meta.env.VITE_LIFX_API_TOKEN;

if (!LIFX_TOKEN) {
    console.error('LIFX API token not found. Please set VITE_LIFX_API_TOKEN in your .env file');
}

const headers = {
    'Authorization': `Bearer ${LIFX_TOKEN}`,
    'Content-Type': 'application/json'
};

export interface LightState {
    power: 'on' | 'off';
    brightness: number;
    color: string;
}

export const lifxApi = {
    async getLights(selector: string = DEFAULT_SELECTOR) {
        const response = await fetch(`${LIFX_API_BASE}/lights/${selector}`, { headers });
        if (!response.ok) throw new Error('Failed to fetch lights');
        return response.json();
    },

    async setState(state: Partial<LightState>, selector: string = DEFAULT_SELECTOR) {
        const payload: any = {};

        if ('power' in state) {
            payload.power = state.power;
        }

        if ('brightness' in state && typeof state.brightness === 'number') {
            payload.brightness = state.brightness / 100; // Convert from percentage to 0-1
        }

        if ('color' in state) {
            // Convert hex to hue, saturation, brightness
            payload.color = state.color;
        }

        const response = await fetch(`${LIFX_API_BASE}/lights/${selector}/state`, {
            method: 'PUT',
            headers,
            body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error('Failed to set light state');
        return response.json();
    },

    async togglePower(selector: string = DEFAULT_SELECTOR) {
        const response = await fetch(`${LIFX_API_BASE}/lights/${selector}/toggle`, {
            method: 'POST',
            headers
        });
        if (!response.ok) throw new Error('Failed to toggle power');
        return response.json();
    }
};
