const API_BASE = '/api/VibeTriggers';
const DEFAULT_SELECTOR = 'label:Vibes';

export interface LightState {
    power: 'on' | 'off';
    brightness: number;
    color: string;
}

export interface BreatheEffect {
    color?: string;        // The color to use for the effect
    from_color?: string;   // Start from this color
    period?: number;       // Time in seconds for one cycle
    cycles?: number;       // Number of times to repeat
    persist?: boolean;     // Keep the last effect color
    power_on?: boolean;    // Turn on the light if it's off
    peak?: number;         // Defines where in a period the target color is at its maximum
}

export const lifxApi = {
    async getLights(selector: string = DEFAULT_SELECTOR) {
        const response = await fetch(`${API_BASE}?action=getLights&selector=${encodeURIComponent(selector)}`);
        if (!response.ok) throw new Error('Failed to fetch lights');
        return response.json();
    },

    async setState(state: Partial<LightState>, selector: string = DEFAULT_SELECTOR) {
        const response = await fetch(`${API_BASE}?action=setState&selector=${encodeURIComponent(selector)}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(state)
        });

        if (!response.ok) throw new Error('Failed to set light state');
        return response.json();
    },

    async togglePower(selector: string = DEFAULT_SELECTOR) {
        const response = await fetch(`${API_BASE}?action=togglePower&selector=${encodeURIComponent(selector)}`, {
            method: 'POST'
        });
        if (!response.ok) throw new Error('Failed to toggle power');
        return response.json();
    },

    async breathe(options: BreatheEffect = {}, selector: string = DEFAULT_SELECTOR) {
        const response = await fetch(`${API_BASE}?action=breathe&selector=${encodeURIComponent(selector)}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(options)
        });

        if (!response.ok) {
            if (response.status === 400) {
                throw new Error('Breathe effect is disabled');
            }
            throw new Error('Failed to apply breathe effect');
        }
        return response.json();
    }
};
