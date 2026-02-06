'use client';

import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import * as Y from 'yjs';
import { WebrtcProvider } from 'y-webrtc';
import { WebsocketProvider } from 'y-websocket';

type ToolMode = 'pen' | 'eraser';

type Point = { x: number; y: number };

type StrokeMap = Y.Map<unknown> & {
  get(key: 'id'): string;
  get(key: 'color'): string;
  get(key: 'size'): number;
  get(key: 'tool'): ToolMode;
  get(key: 'points'): Y.Array<Point>;
};

const COLORS = ['#ffffff', '#ffd166', '#ff6b6b', '#70f2b0', '#38bdf8', '#c084fc'];
const SIGNALING = ['wss://signaling.yjs.dev', 'wss://y-webrtc-signaling-us.fly.dev'];
const WEBSOCKET_ENDPOINT = 'wss://demos.yjs.dev';
const ROOM_PREFIX = 'aaf-blackboard-';

const createRoomId = () => `bb-${Math.random().toString(36).slice(2, 8)}-${Date.now().toString(36)}`;

export default function Blackboard() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const docRef = useRef<Y.Doc | null>(null);
  const providerRef = useRef<WebrtcProvider | null>(null);
  const websocketProviderRef = useRef<WebsocketProvider | null>(null);
  const strokesRef = useRef<Y.Array<StrokeMap> | null>(null);
  const currentStrokeRef = useRef<StrokeMap | null>(null);
  const drawingRef = useRef(false);
  const lastPointRef = useRef<Point | null>(null);

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [roomId, setRoomId] = useState('');
  const [shareLink, setShareLink] = useState('');
  const [participants, setParticipants] = useState(1);
  const [color, setColor] = useState(COLORS[0]);
  const [brush, setBrush] = useState(6);
  const [tool, setTool] = useState<ToolMode>('pen');
  const [isDrawing, setIsDrawing] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [isRealtimeReady, setIsRealtimeReady] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const showToast = useCallback((message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 2200);
  }, []);

  const roomParam = searchParams.get('room');
  useEffect(() => {
    if (roomParam) {
      setRoomId(roomParam);
    } else {
      const generated = createRoomId();
      setRoomId(generated);
      const params = new URLSearchParams(Array.from(searchParams.entries()));
      params.set('room', generated);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }
  }, [pathname, router, searchParams, roomParam]);

  useEffect(() => {
    if (!roomId || typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    params.set('room', roomId);
    setShareLink(`${window.location.origin}${pathname}?${params.toString()}`);
  }, [pathname, roomId]);

  const normalizePoint = useCallback((raw: unknown): Point | null => {
    if (!raw) return null;
    if (typeof raw === 'object') {
      if ('x' in raw && 'y' in raw) {
        const candidate = raw as { x: unknown; y: unknown };
        if (typeof candidate.x === 'number' && typeof candidate.y === 'number') {
          return { x: candidate.x, y: candidate.y };
        }
      }
      if ((raw as Y.Map<unknown>).get instanceof Function) {
        const map = raw as Y.Map<unknown>;
        const x = map.get('x');
        const y = map.get('y');
        if (typeof x === 'number' && typeof y === 'number') {
          return { x, y };
        }
      }
    }
    return null;
  }, []);

  const drawStroke = useCallback(
    (ctx: CanvasRenderingContext2D, strokeMap: StrokeMap, w: number, h: number) => {
      const points = strokeMap.get('points');
      if (!points || points.length === 0) return;

      const normalizedPoints = (points.toArray() as unknown[])
        .map(normalizePoint)
        .filter((point): point is Point => Boolean(point));

      if (normalizedPoints.length === 0) {
        return;
      }

      const pxPoints = normalizedPoints.map((point) => ({
        x: point.x * w,
        y: point.y * h,
      }));

      const toolMode = strokeMap.get('tool') ?? 'pen';
      const strokeWidth = strokeMap.get('size') ?? 6;

      ctx.save();
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = strokeWidth;

      if (toolMode === 'eraser') {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.strokeStyle = 'rgba(0,0,0,1)';
      } else {
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = strokeMap.get('color') ?? '#ffffff';
      }

      if (pxPoints.length === 1) {
        const [point] = pxPoints;
        ctx.beginPath();
        ctx.arc(point.x, point.y, Math.max(strokeWidth / 2, 1), 0, Math.PI * 2);
        ctx.fillStyle = toolMode === 'eraser' ? 'rgba(0,0,0,1)' : ctx.strokeStyle;
        ctx.fill();
        ctx.restore();
        return;
      }

      ctx.beginPath();
      ctx.moveTo(pxPoints[0].x, pxPoints[0].y);

      for (let i = 1; i < pxPoints.length - 1; i += 1) {
        const current = pxPoints[i];
        const next = pxPoints[i + 1];
        const midPointX = (current.x + next.x) / 2;
        const midPointY = (current.y + next.y) / 2;
        ctx.quadraticCurveTo(current.x, current.y, midPointX, midPointY);
      }

      const lastPoint = pxPoints[pxPoints.length - 1];
      ctx.lineTo(lastPoint.x, lastPoint.y);
      ctx.stroke();
      ctx.restore();
    },
    [normalizePoint]
  );

  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const strokes = strokesRef.current;
    if (!canvas || !strokes) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const ratio = window.devicePixelRatio || 1;

    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#040b19');
    gradient.addColorStop(1, '#02040a');
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = 'rgba(148, 163, 184, 0.05)';
    ctx.lineWidth = 1;
    const gap = Math.max(width, height) / 26;
    for (let x = gap; x < width; x += gap) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = gap; y < height; y += gap) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    const bufferCanvas = document.createElement('canvas');
    bufferCanvas.width = Math.max(Math.floor(width * ratio), 1);
    bufferCanvas.height = Math.max(Math.floor(height * ratio), 1);
    const bufferCtx = bufferCanvas.getContext('2d');
    if (!bufferCtx) return;
    bufferCtx.scale(ratio, ratio);

    strokes.toArray().forEach((stroke: StrokeMap) => drawStroke(bufferCtx, stroke, width, height));

    ctx.drawImage(bufferCanvas, 0, 0, width, height);
  }, [drawStroke]);

  const handleResize = useCallback(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const ratio = window.devicePixelRatio || 1;
    canvas.width = rect.width * ratio;
    canvas.height = rect.height * ratio;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(ratio, ratio);
    }
    renderCanvas();
  }, [renderCanvas]);

  const resizeCanvas = useCallback(() => {
    handleResize();
  }, [handleResize]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  useEffect(() => {
    if (!roomId) return;
    const doc = new Y.Doc();
    const webrtcProvider = new WebrtcProvider(`${ROOM_PREFIX}${roomId}`, doc, {
      signaling: SIGNALING,
    });
    const websocketProvider = new WebsocketProvider(
      WEBSOCKET_ENDPOINT,
      `${ROOM_PREFIX}${roomId}`,
      doc,
      {
        awareness: webrtcProvider.awareness,
      }
    );
    const strokes = doc.getArray<StrokeMap>('strokes');

    docRef.current = doc;
    providerRef.current = webrtcProvider;
    websocketProviderRef.current = websocketProvider;
    strokesRef.current = strokes;
    setIsRealtimeReady(true);

    const observer = () => requestAnimationFrame(renderCanvas);
    strokes.observeDeep(observer);
    resizeCanvas();
    renderCanvas();

    const awareness = webrtcProvider.awareness;
    const updateCount = () => setParticipants(awareness.getStates().size);
    awareness.setLocalStateField('name', `user-${Math.random().toString(36).slice(2, 5)}`);
    updateCount();
    awareness.on('change', updateCount);

    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      strokes.unobserveDeep(observer);
      awareness.off('change', updateCount);
      webrtcProvider.destroy();
      websocketProvider.destroy();
      doc.destroy();
      docRef.current = null;
      providerRef.current = null;
      websocketProviderRef.current = null;
      strokesRef.current = null;
      setIsRealtimeReady(false);
    };
  }, [renderCanvas, resizeCanvas, roomId]);

  const relativePoint = useCallback((event: PointerEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    if (x < 0 || x > 1 || y < 0 || y > 1) return null;
    return { x, y };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (!isRealtimeReady) return;
    const strokes = strokesRef.current;
    if (!strokes) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (event.button !== 0) return;
      const point = relativePoint(event);
      if (!point) return;
      drawingRef.current = true;
      setIsDrawing(true);
      canvas.setPointerCapture(event.pointerId);
      event.preventDefault();

      const strokeMap = new Y.Map<unknown>() as StrokeMap;
      const points = new Y.Array<Point>();
      points.push([{ x: point.x, y: point.y }]);
      strokeMap.set('id', `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`);
      strokeMap.set('color', color);
      strokeMap.set('size', tool === 'pen' ? brush : brush + 12);
      strokeMap.set('tool', tool);
      strokeMap.set('points', points);

      strokes.push([strokeMap]);
      currentStrokeRef.current = strokeMap;
      lastPointRef.current = point;
      renderCanvas();
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (!drawingRef.current) return;
      const strokeMap = currentStrokeRef.current;
      if (!strokeMap) return;
      const point = relativePoint(event);
      if (!point) return;
      const last = lastPointRef.current;
      if (last) {
        const delta = Math.hypot(point.x - last.x, point.y - last.y);
        if (delta < 0.002) return;
      }
      const points = strokeMap.get('points');
      points.push([{ x: point.x, y: point.y }]);
      lastPointRef.current = point;
      renderCanvas();
    };

    const endStroke = (event: PointerEvent) => {
      if (!drawingRef.current) return;
      drawingRef.current = false;
      currentStrokeRef.current = null;
      lastPointRef.current = null;
      setIsDrawing(false);
      try {
        canvas.releasePointerCapture(event.pointerId);
      } catch {
        // ignore
      }
      renderCanvas();
    };

    const handlePointerUp = (event: PointerEvent) => endStroke(event);
    const handlePointerLeave = (event: PointerEvent) => endStroke(event);

    canvas.addEventListener('pointerdown', handlePointerDown);
    canvas.addEventListener('pointermove', handlePointerMove);
    canvas.addEventListener('pointerup', handlePointerUp);
    canvas.addEventListener('pointerleave', handlePointerLeave);
    canvas.addEventListener('pointercancel', handlePointerLeave);

    return () => {
      canvas.removeEventListener('pointerdown', handlePointerDown);
      canvas.removeEventListener('pointermove', handlePointerMove);
      canvas.removeEventListener('pointerup', handlePointerUp);
      canvas.removeEventListener('pointerleave', handlePointerLeave);
      canvas.removeEventListener('pointercancel', handlePointerLeave);
    };
  }, [brush, color, isRealtimeReady, renderCanvas, relativePoint, tool]);

  const handleCopyLink = async () => {
    if (!shareLink) return;
    try {
      await navigator.clipboard.writeText(shareLink);
      showToast('Share link copied. Send it to collaborators.');
    } catch {
      showToast('Unable to copy automatically. Please copy manually.');
    }
  };

  const handleNewRoom = () => {
    const fresh = createRoomId();
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    params.set('room', fresh);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    setRoomId(fresh);
    showToast('Created a new collaborative room.');
  };

  const handleClearBoard = () => {
    const strokes = strokesRef.current;
    if (!strokes) return;
    if (strokes.length === 0) {
      showToast('Board already clear.');
      return;
    }
    if (!window.confirm('Clear the board for all participants?')) return;
    strokes.delete(0, strokes.length);
    renderCanvas();
    showToast('Blackboard cleared for everyone.');
  };

  const handleToggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {
        showToast('Unable to enter fullscreen mode.');
      });
    } else {
      document.exitFullscreen().catch(() => {
        showToast('Unable to exit fullscreen mode.');
      });
    }
  };

  const handleOpenInNewTab = () => {
    if (typeof window === 'undefined') return;
    window.open(window.location.href, '_blank', 'noopener');
  };

  const toolbarItems = useMemo(
    () => [
      {
        id: 'pen',
        label: 'Pen',
        active: tool === 'pen',
        onClick: () => setTool('pen'),
        icon: '✏️',
      },
      {
        id: 'eraser',
        label: 'Eraser',
        active: tool === 'eraser',
        onClick: () => setTool('eraser'),
        icon: '🧽',
      },
    ],
    [tool]
  );

  const seoContent = useMemo(
    () => (
      <div className="space-y-12">
        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-gray-900">What Is the Collaborative Blackboard?</h2>
          <p className="text-gray-600 leading-relaxed">
            The AllAppsFree collaborative blackboard is a real-time browser canvas powered by WebRTC and Yjs. Launch a room, share the link, and everyone can draw,
            brainstorm, or annotate together with zero installs. Perfect for remote standups, sprint planning, tutoring sessions, and on-the-fly ideation.
          </p>
        </section>

        <section className="grid md:grid-cols-2 gap-5">
          <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 space-y-2">
            <h3 className="text-indigo-800 font-semibold">Key Advantages</h3>
            <ul className="space-y-1 text-sm text-indigo-900">
              <li>✔️ Live synchronization backed by peer-to-peer WebRTC</li>
              <li>✔️ Instant room links with no account or login</li>
              <li>✔️ Pen, eraser, brush sizing, and curated color palette</li>
              <li>✔️ Elegant gradients, grid guidelines, and haptic visual cues</li>
            </ul>
          </div>
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 space-y-2">
            <h3 className="text-blue-800 font-semibold">Best For</h3>
            <ul className="space-y-1 text-sm text-blue-900">
              <li>✔️ Product and design teams aligning on quick sketches</li>
              <li>✔️ Educators walking through maths, science, or coding flowcharts</li>
              <li>✔️ Remote ops teams mapping workflows during live calls</li>
              <li>✔️ Communities hosting live workshops and breakout sessions</li>
            </ul>
          </div>
        </section>

        <section className="space-y-3">
          <h3 className="text-xl font-semibold text-gray-900">How to Run a Session</h3>
          <ol className="list-decimal list-inside space-y-2 text-gray-600">
            <li>Open the blackboard and copy the share link for teammates.</li>
            <li>Pick your tool: pen for drawing, eraser for corrections, adjust brush size for emphasis.</li>
            <li>Switch colours to differentiate participants or highlight steps.</li>
            <li>Start sketching—everyone connected will see updates instantly.</li>
            <li>Need a fresh slate? Clear the board for all participants with one click.</li>
          </ol>
        </section>

        <section className="space-y-3">
          <h3 className="text-xl font-semibold text-gray-900">Frequently Asked Questions</h3>
          <div className="space-y-3 text-gray-600">
            <p><strong>Does it require accounts?</strong> No. All rooms are ephemeral and run entirely in the browser—just share the link.</p>
            <p><strong>How many people can join?</strong> Peer-to-peer rooms comfortably support small team sessions. For large cohorts, split into multiple rooms.</p>
            <p><strong>Is my data stored?</strong> No drawings are persisted on a server. If everyone leaves the room, the slate resets.</p>
          </div>
        </section>

        <section className="space-y-3">
          <h3 className="text-xl font-semibold text-gray-900">Why Teams Choose AllAppsFree</h3>
          <div className="grid md:grid-cols-2 gap-5">
            <div className="p-6 rounded-2xl border border-emerald-100 bg-emerald-50">
              <h4 className="font-semibold text-emerald-800">Zero Friction</h4>
              <p className="text-sm text-emerald-900">Launch a room in seconds and collaborate from any modern browser without installations.</p>
            </div>
            <div className="p-6 rounded-2xl border border-purple-100 bg-purple-50">
              <h4 className="font-semibold text-purple-800">Premium Experience</h4>
              <p className="text-sm text-purple-900">Enjoy a polished UI with elegant gradients, subtle grid lines, and responsive performance on desktop or tablet.</p>
            </div>
          </div>
          <p className="text-gray-600 leading-relaxed">
            The collaborative blackboard turns quick ideas into shared understanding. Capture thoughts visually, keep everyone aligned, and move projects forward—completely free.
          </p>
        </section>
      </div>
    ),
    []
  );

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-white/10 shadow-2xl overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 px-8 py-6 bg-black/30 backdrop-blur">
          <div className="space-y-2">
            <h1 className="text-3xl font-black text-white tracking-tight">Collaborative Blackboard</h1>
            <p className="text-slate-300 text-sm max-w-xl">
              Share this live room link with teammates to brainstorm in real time. Everyone connected will see drawings instantly.
            </p>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-200/80">
              <span className="px-3 py-1.5 rounded-full bg-white/10 border border-white/20">Room · {roomId.slice(-8)}</span>
              <span className="px-3 py-1.5 rounded-full bg-white/10 border border-white/20">Participants · {participants}</span>
              <span className="px-3 py-1.5 rounded-full bg-white/10 border border-white/20">Live sync via WebRTC</span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleCopyLink}
              className="px-4 py-3 rounded-xl bg-white text-slate-900 font-semibold shadow-lg hover:-translate-y-0.5 transition"
            >
              Copy share link
            </button>
            <button
              onClick={handleNewRoom}
              className="px-4 py-3 rounded-xl bg-slate-700 text-white font-semibold border border-white/20 hover:bg-slate-600 transition"
            >
              Start new room
            </button>
            <button
              onClick={handleToggleFullscreen}
              className="px-4 py-3 rounded-xl bg-slate-800 text-white font-semibold border border-white/20 hover:bg-slate-700 transition"
            >
              {isFullscreen ? 'Exit fullscreen' : 'Fullscreen' }
            </button>
            <button
              onClick={handleOpenInNewTab}
              className="px-4 py-3 rounded-xl bg-slate-800 text-white font-semibold border border-white/20 hover:bg-slate-700 transition"
            >
              Open in new tab
            </button>
          </div>
        </div>

        <div className="px-6 pb-6">
          <div
            ref={containerRef}
            className={`relative w-full aspect-[16/9] rounded-2xl border border-white/10 overflow-hidden shadow-2xl ${
              isDrawing ? 'ring-2 ring-blue-400/40' : 'ring-1 ring-white/10'
            }`}
          >
            <canvas ref={canvasRef} className="w-full h-full cursor-crosshair touch-none" />

            <div className="absolute inset-x-0 top-0 flex flex-wrap items-center gap-4 bg-black/50 backdrop-blur-sm rounded-t-2xl px-4 py-3 border-b border-white/10 pointer-events-none">
              <div className="flex items-center gap-4 pointer-events-auto">
                {toolbarItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={item.onClick}
                    className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold border transition ${
                      item.active ? 'bg-white text-slate-900 border-white shadow-lg' : 'bg-slate-800/80 text-slate-200 border-white/10 hover:bg-slate-700'
                    }`}
                  >
                    <span className="mr-2">{item.icon}</span>
                    {item.label}
                  </button>
                ))}

                <label className="flex items-center gap-2 text-xs sm:text-sm text-slate-200">
                  Brush
                  <input
                    type="range"
                    min={2}
                    max={20}
                    value={brush}
                    onChange={(event) => setBrush(Number(event.target.value))}
                    className="accent-white"
                  />
                  <span className="text-xs text-slate-300 w-8 text-right">{brush}px</span>
                </label>

                <div className="flex items-center gap-2 pointer-events-auto">
                  {COLORS.map((paletteColor) => (
                    <button
                      key={paletteColor}
                      onClick={() => setColor(paletteColor)}
                      className={`w-8 h-8 rounded-full border-2 transition ${
                        color === paletteColor ? 'border-white shadow-lg scale-110' : 'border-transparent opacity-80 hover:opacity-100'
                      }`}
                      style={{ background: paletteColor }}
                    />
                  ))}
                </div>

                <div className="ml-auto flex items-center gap-2 pointer-events-auto">
                  <button
                    onClick={handleToggleFullscreen}
                    className="px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-white/10 text-white border border-white/20 hover:bg-white/20"
                  >
                    {isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
                  </button>
                  <button
                    onClick={handleOpenInNewTab}
                    className="px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-white/10 text-white border border-white/20 hover:bg-white/20"
                  >
                    New tab
                  </button>
                  <button
                    onClick={handleClearBoard}
                    className="px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-red-500 text-white hover:bg-red-400"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>

            {toast && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 text-xs font-semibold bg-black/70 text-white rounded-full backdrop-blur">
                {toast}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-200 shadow-xl p-10">
        {seoContent}
      </div>
    </div>
  );
}
