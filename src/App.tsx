import { useState, useCallback, useEffect } from 'react'
import type { Engine } from "tsparticles-engine";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import { lifxApi, type BreatheEffect } from './services/lifx';
import { BreatheControls } from './components/BreatheControls';
import './App.css'

const ENABLE_BREATHE = import.meta.env.VITE_ENABLE_BREATHE_EFFECT !== 'false';

interface LampState {
  power: boolean;
  brightness: number;
  color: string;
}

const PRESET_COLORS = [
  { name: 'Sunset Orange', value: '#f97316' },
  { name: 'Electric Purple', value: '#a855f7' },
  { name: 'Cyber Blue', value: '#06b6d4' },
  { name: 'Neo Mint', value: '#10b981' },
] as const;

function App() {
  const [lampState, setLampState] = useState<LampState>({
    power: false,
    brightness: 100,
    color: PRESET_COLORS[0].value
  });
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [showBreatheControls, setShowBreatheControls] = useState(false);

  // Load initial state
  useEffect(() => {
    async function loadLightState() {
      try {
        const lights = await lifxApi.getLights();
        if (lights && lights.length > 0) {
          const light = lights[0]; // Use the first light
          setLampState({
            power: light.power === 'on',
            brightness: Math.round(light.brightness * 100),
            color: PRESET_COLORS[0].value // We'll keep our default color initially
          });
        }
      } catch (err) {
        setError('Failed to load light state');
      } finally {
        setIsLoading(false);
      }
    }
    loadLightState();
  }, []);

  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  const togglePower = async () => {
    try {
      await lifxApi.togglePower();
      const newPower = !lampState.power;
      setLampState(prev => ({ ...prev, power: newPower }));
      setError('');
    } catch (err) {
      setError('Failed to toggle power');
    }
  };

  const adjustBrightness = async (value: number) => {
    try {
      await lifxApi.setState({ brightness: value });
      setLampState(prev => ({ ...prev, brightness: value }));
      setError('');
    } catch (err) {
      setError('Failed to adjust brightness');
    }
  };

  const changeColor = async (color: string) => {
    try {
      await lifxApi.setState({ color });
      setLampState(prev => ({ ...prev, color }));
      setError('');
    } catch (err) {
      setError('Failed to change color');
    }
  };

  const startBreatheEffect = async (effect: BreatheEffect) => {
    try {
      await lifxApi.breathe(effect);
      setError('');
    } catch (err) {
      setError('Failed to start breathe effect');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-6 relative overflow-hidden">
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          background: {
            opacity: 0
          },
          fpsLimit: 120,
          particles: {
            color: {
              value: ["#f97316", "#a855f7", "#06b6d4", "#10b981"],
            },
            links: {
              color: "#ffffff",
              distance: 150,
              enable: true,
              opacity: 0.1,
              width: 1
            },
            move: {
              enable: true,
              random: false,
              speed: 1,
              straight: false,
            },
            number: {
              value: 30,
              density: {
                enable: true,
                area: 800
              }
            },
            opacity: {
              value: 0.15
            },
            shape: {
              type: "circle"
            },
            size: {
              value: { min: 1, max: 3 }
            }
          },
          detectRetina: true
        }}
        className="absolute inset-0"
      />
      <div className="max-w-md mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12 animate-float">
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">
            I Love Lamp
          </h1>
          <div className="text-purple-300 text-lg">Make your space glow</div>
        </div>

        {isLoading ? (
          <div className="text-center p-12">
            <div className="animate-pulse text-purple-300">
              Connecting to your lamp...
            </div>
          </div>
        ) : (
          <>
            {error && (
              <div className="animate-shake mb-6 bg-red-500/20 border border-red-500/50 backdrop-blur-sm rounded-xl p-4 text-red-200">
                {error}
              </div>
            )}

            <div className="space-y-8">
              {/* Power Button */}
              <button
                onClick={togglePower}
                className={`w-full p-6 rounded-2xl transition-all duration-500 bg-gradient-to-r shadow-lg 
                  ${lampState.power
                    ? 'from-green-500 to-emerald-700 shadow-green-500/50 animate-glow'
                    : 'from-slate-700 to-slate-800 shadow-slate-900/50'}`}
              >
                <div className="text-2xl font-bold">
                  {lampState.power ? 'ON' : 'OFF'}
                </div>
                <div className="text-sm opacity-75">
                  {lampState.power ? 'Click to turn off' : 'Click to turn on'}
                </div>
              </button>

              {/* Brightness Control */}
              <div className={`p-6 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 
                ${lampState.power ? 'opacity-100' : 'opacity-50'}`}>
                <label className="block mb-4 text-purple-200">
                  Brightness: {lampState.brightness}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={lampState.brightness}
                  onChange={(e) => adjustBrightness(Number(e.target.value))}
                  className="w-full accent-purple-500"
                  disabled={!lampState.power}
                />
              </div>

              {/* Color Control */}
              <div className={`p-6 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10
                ${lampState.power ? 'opacity-100' : 'opacity-50'}`}>
                <div className="flex justify-between items-center mb-4">
                  <label className="text-purple-200">Color</label>
                  {ENABLE_BREATHE && (
                    <button
                      onClick={() => setShowBreatheControls(true)}
                      disabled={!lampState.power}
                      className="px-3 py-1 text-sm rounded-lg bg-purple-500/20 
                        hover:bg-purple-500/30 border border-purple-500/30
                        disabled:opacity-50 disabled:cursor-not-allowed
                        transition-all duration-300"
                    >
                      ✨ Breathe
                    </button>
                  )}
                </div>

                {/* Custom Color Picker */}
                <div className="mb-6">
                  <input
                    type="color"
                    value={lampState.color}
                    onChange={(e) => changeColor(e.target.value)}
                    disabled={!lampState.power}
                    className="w-full h-14 rounded-xl cursor-pointer disabled:cursor-not-allowed"
                  />
                </div>

                {/* Preset Colors */}
                <div className="grid grid-cols-4 gap-3">
                  {PRESET_COLORS.map(({ name, value }) => (
                    <button
                      key={value}
                      onClick={() => changeColor(value)}
                      disabled={!lampState.power}
                      style={{ backgroundColor: value }}
                      className="aspect-square rounded-xl transition-all duration-300 
                        hover:scale-105 hover:shadow-lg disabled:opacity-50 
                        disabled:cursor-not-allowed group relative overflow-hidden"
                    >
                      <span className="absolute inset-0 flex items-center justify-center 
                        bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity text-xs">
                        {name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {ENABLE_BREATHE && (
              <BreatheControls
                isOpen={showBreatheControls}
                onClose={() => setShowBreatheControls(false)}
                currentColor={lampState.color}
                onStart={startBreatheEffect}
              />
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default App
