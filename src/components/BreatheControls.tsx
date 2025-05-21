import { useState } from 'react';
import type { BreatheEffect } from '../services/lifx';

interface BreatheControlsProps {
    isOpen: boolean;
    onClose: () => void;
    currentColor: string;
    onStart: (effect: BreatheEffect) => void;
}

export function BreatheControls({ isOpen, onClose, currentColor, onStart }: BreatheControlsProps) {
    const [effect, setEffect] = useState<BreatheEffect>({
        color: currentColor,
        from_color: '#000000',
        period: 2,
        cycles: 3,
        persist: false,
        power_on: true,
        peak: 0.5
    });

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-800/90 border border-purple-500/30 rounded-2xl p-6 max-w-md w-full space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-purple-200">Breathe Effect</h2>
                    <button
                        onClick={onClose}
                        className="text-purple-300 hover:text-purple-100"
                    >
                        ✕
                    </button>
                </div>

                <div className="space-y-4">
                    {/* Colors */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-purple-200 mb-2">Target Color</label>
                            <input
                                type="color"
                                value={effect.color}
                                onChange={e => setEffect(prev => ({ ...prev, color: e.target.value }))}
                                className="w-full h-10 rounded-lg cursor-pointer"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-purple-200 mb-2">Start Color</label>
                            <input
                                type="color"
                                value={effect.from_color}
                                onChange={e => setEffect(prev => ({ ...prev, from_color: e.target.value }))}
                                className="w-full h-10 rounded-lg cursor-pointer"
                            />
                        </div>
                    </div>

                    {/* Period */}
                    <div>
                        <label className="block text-sm text-purple-200 mb-2">
                            Period: {effect.period}s
                        </label>
                        <input
                            type="range"
                            min="0.5"
                            max="10"
                            step="0.5"
                            value={effect.period}
                            onChange={e => setEffect(prev => ({ ...prev, period: Number(e.target.value) }))}
                            className="w-full accent-purple-500"
                        />
                    </div>

                    {/* Cycles */}
                    <div>
                        <label className="block text-sm text-purple-200 mb-2">
                            Cycles: {effect.cycles}
                        </label>
                        <input
                            type="range"
                            min="1"
                            max="10"
                            value={effect.cycles}
                            onChange={e => setEffect(prev => ({ ...prev, cycles: Number(e.target.value) }))}
                            className="w-full accent-purple-500"
                        />
                    </div>

                    {/* Peak */}
                    <div>
                        <label className="block text-sm text-purple-200 mb-2">
                            Peak: {effect.peak}
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={effect.peak}
                            onChange={e => setEffect(prev => ({ ...prev, peak: Number(e.target.value) }))}
                            className="w-full accent-purple-500"
                        />
                    </div>

                    {/* Options */}
                    <div className="flex gap-4">
                        <label className="flex items-center gap-2 text-sm text-purple-200">
                            <input
                                type="checkbox"
                                checked={effect.persist}
                                onChange={e => setEffect(prev => ({ ...prev, persist: e.target.checked }))}
                                className="accent-purple-500"
                            />
                            Keep final color
                        </label>
                        <label className="flex items-center gap-2 text-sm text-purple-200">
                            <input
                                type="checkbox"
                                checked={effect.power_on}
                                onChange={e => setEffect(prev => ({ ...prev, power_on: e.target.checked }))}
                                className="accent-purple-500"
                            />
                            Power on if off
                        </label>
                    </div>
                </div>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm rounded-lg border border-purple-500/30
              hover:bg-purple-500/20 transition-all duration-300"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            onStart(effect);
                            onClose();
                        }}
                        className="px-4 py-2 text-sm rounded-lg bg-purple-500 
              hover:bg-purple-600 transition-all duration-300"
                    >
                        Start Effect
                    </button>
                </div>
            </div>
        </div>
    );
}
