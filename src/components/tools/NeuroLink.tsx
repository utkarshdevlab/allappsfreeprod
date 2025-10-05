'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface Neuron {
  id: number;
  x: number;
  y: number;
  active: boolean;
}

interface Connection {
  from: number;
  to: number;
}

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 500;
const NEURON_RADIUS = 20;
const TARGET_LOAD_MIN = 40;
const TARGET_LOAD_MAX = 60;

export default function NeuroLink() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [neurons, setNeurons] = useState<Neuron[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [signalLoad, setSignalLoad] = useState(0);
  const [isStable, setIsStable] = useState(false);
  const [level, setLevel] = useState(1);
  const [connecting, setConnecting] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const animationRef = useRef<number>();

  // Initialize neurons
  useEffect(() => {
    const neuronCount = 5 + level;
    const newNeurons: Neuron[] = [];
    
    // Start with all neurons inactive for challenge
    for (let i = 0; i < neuronCount; i++) {
      newNeurons.push({
        id: i,
        x: Math.random() * (CANVAS_WIDTH - 100) + 50,
        y: Math.random() * (CANVAS_HEIGHT - 100) + 50,
        active: false // Start inactive for challenge
      });
    }
    
    setNeurons(newNeurons);
    setConnections([]);
    setSignalLoad(0);
    setIsStable(false);
  }, [level]);

  // Calculate signal load
  useEffect(() => {
    const activeNeurons = neurons.filter(n => n.active).length;
    const connectionCount = connections.length;
    const load = (activeNeurons * 10) + (connectionCount * 5);
    setSignalLoad(load);
    setIsStable(load >= TARGET_LOAD_MIN && load <= TARGET_LOAD_MAX);
  }, [neurons, connections]);

  const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if clicked on a neuron
    const clickedNeuron = neurons.find(n => {
      const dx = n.x - x;
      const dy = n.y - y;
      return Math.sqrt(dx * dx + dy * dy) <= NEURON_RADIUS;
    });

    if (clickedNeuron) {
      if (connecting !== null) {
        // Complete connection
        if (connecting !== clickedNeuron.id) {
          const connectionExists = connections.some(
            c => (c.from === connecting && c.to === clickedNeuron.id) ||
                 (c.from === clickedNeuron.id && c.to === connecting)
          );

          if (!connectionExists) {
            setConnections(prev => [...prev, { from: connecting, to: clickedNeuron.id }]);
          }
        }
        setConnecting(null);
      } else {
        // Start connection on click, toggle on double click
        if (e.detail === 2) {
          // Double click - toggle neuron
          setNeurons(prev => prev.map(n =>
            n.id === clickedNeuron.id ? { ...n, active: !n.active } : n
          ));
        } else {
          // Single click - start connection
          setConnecting(clickedNeuron.id);
        }
      }
    } else {
      setConnecting(null);
    }
  }, [neurons, connections, connecting]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  }, []);

  const removeConnection = useCallback((index: number) => {
    setConnections(prev => prev.filter((_, i) => i !== index));
  }, []);

  const nextLevel = useCallback(() => {
    setLevel(prev => prev + 1);
  }, []);

  const resetLevel = useCallback(() => {
    setConnections([]);
    setNeurons(prev => prev.map(n => ({ ...n, active: false })));
  }, []);

  // Canvas rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      // Clear canvas
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw connections
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 2;
      connections.forEach((conn) => {
        const from = neurons.find(n => n.id === conn.from);
        const to = neurons.find(n => n.id === conn.to);
        
        if (from && to) {
          ctx.beginPath();
          ctx.moveTo(from.x, from.y);
          ctx.lineTo(to.x, to.y);
          ctx.stroke();

          // Animated signal
          const t = (Date.now() % 2000) / 2000;
          const signalX = from.x + (to.x - from.x) * t;
          const signalY = from.y + (to.y - from.y) * t;
          
          ctx.fillStyle = '#60a5fa';
          ctx.beginPath();
          ctx.arc(signalX, signalY, 4, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Draw temporary connection line
      if (connecting !== null) {
        const neuron = neurons.find(n => n.id === connecting);
        if (neuron) {
          ctx.strokeStyle = '#a855f7';
          ctx.setLineDash([5, 5]);
          ctx.beginPath();
          ctx.moveTo(neuron.x, neuron.y);
          ctx.lineTo(mousePos.x, mousePos.y);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      }

      // Draw neurons
      neurons.forEach(neuron => {
        // Glow effect for active neurons
        if (neuron.active) {
          ctx.shadowBlur = 20;
          ctx.shadowColor = '#3b82f6';
        }

        ctx.fillStyle = neuron.active ? '#3b82f6' : '#475569';
        ctx.beginPath();
        ctx.arc(neuron.x, neuron.y, NEURON_RADIUS, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowBlur = 0;

        // Neuron border
        ctx.strokeStyle = neuron.active ? '#60a5fa' : '#64748b';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Neuron ID
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(neuron.id.toString(), neuron.x, neuron.y);
      });

      animationRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [neurons, connections, connecting, mousePos]);

  const getLoadColor = () => {
    if (isStable) return 'from-green-500 to-green-600';
    if (signalLoad < TARGET_LOAD_MIN) return 'from-blue-500 to-blue-600';
    return 'from-red-500 to-red-600';
  };

  const getLoadStatus = () => {
    if (isStable) return '✓ Stable';
    if (signalLoad < TARGET_LOAD_MIN) return '↓ Too Low';
    return '↑ Overload';
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="text-3xl font-bold">{level}</div>
          <div className="text-purple-100 text-sm">Level</div>
        </div>
        <div className={`bg-gradient-to-br ${getLoadColor()} rounded-xl p-6 text-white`}>
          <div className="text-3xl font-bold">{signalLoad}%</div>
          <div className="text-white/80 text-sm">Signal Load</div>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="text-3xl font-bold">{connections.length}</div>
          <div className="text-blue-100 text-sm">Connections</div>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white">
          <div className="text-2xl font-bold">{getLoadStatus()}</div>
          <div className="text-orange-100 text-sm">Status</div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border-2 border-blue-200">
        <h3 className="text-lg font-bold text-blue-900 mb-4">🧠 How to Play NeuroLink</h3>
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-blue-800">
          <li className="flex items-start space-x-2">
            <span className="text-blue-600 font-bold">→</span>
            <span>Single click neuron to start drawing connection</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-blue-600 font-bold">→</span>
            <span>Click another neuron to complete connection</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-blue-600 font-bold">→</span>
            <span>Double click neuron to activate/deactivate it</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-blue-600 font-bold">→</span>
            <span>Balance signal load between 40% and 60%</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-blue-600 font-bold">→</span>
            <span>Active neurons increase load by 10%</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-blue-600 font-bold">→</span>
            <span>Each connection adds 5% load</span>
          </li>
        </ul>
      </div>

      {/* Game Canvas */}
      <div className="bg-white rounded-2xl p-8 border-2 border-gray-200">
        <div className="flex flex-col items-center">
          <div className="mb-4 text-center">
            <div className="text-sm text-gray-600 mb-2">
              Target: {TARGET_LOAD_MIN}% - {TARGET_LOAD_MAX}%
            </div>
            <div className="w-full max-w-md bg-gray-200 rounded-full h-4 overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${isStable ? 'bg-green-500' : signalLoad < TARGET_LOAD_MIN ? 'bg-blue-500' : 'bg-red-500'}`}
                style={{ width: `${Math.min(100, signalLoad)}%` }}
              />
            </div>
          </div>

          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            onClick={handleCanvasClick}
            onMouseMove={handleMouseMove}
            className="border-4 border-gray-800 rounded-lg shadow-2xl cursor-pointer"
          />

          {isStable && (
            <div className="mt-6 p-4 bg-green-100 border-2 border-green-500 rounded-xl text-center">
              <p className="text-green-800 font-bold text-lg">🧠 Neural Network Stable!</p>
              <button
                onClick={nextLevel}
                className="mt-4 px-8 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 font-bold"
              >
                Next Level →
              </button>
            </div>
          )}

          {/* Controls */}
          <div className="mt-6 flex gap-4">
            <button
              onClick={resetLevel}
              className="px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 font-bold"
            >
              🔄 Reset
            </button>
            {connections.length > 0 && (
              <button
                onClick={() => removeConnection(connections.length - 1)}
                className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 font-bold"
              >
                ✂️ Remove Last Connection
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
