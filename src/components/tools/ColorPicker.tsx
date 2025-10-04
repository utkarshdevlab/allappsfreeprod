'use client';

import { useState, useRef } from 'react';

interface ColorInfo {
  hex: string;
  rgb: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
  cmyk: { c: number; m: number; y: number; k: number };
}

export default function ColorPicker() {
  const [selectedColor, setSelectedColor] = useState<ColorInfo>({
    hex: '#3B82F6',
    rgb: { r: 59, g: 130, b: 246 },
    hsl: { h: 217, s: 91, l: 60 },
    cmyk: { c: 76, m: 47, y: 0, k: 4 }
  });
  const [uploadedImage, setUploadedImage] = useState<string>('');
  const [colorHistory, setColorHistory] = useState<ColorInfo[]>([]);
  const [copied, setCopied] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  };

  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  };

  const rgbToCmyk = (r: number, g: number, b: number) => {
    const rNorm = r / 255;
    const gNorm = g / 255;
    const bNorm = b / 255;
    
    const k = 1 - Math.max(rNorm, gNorm, bNorm);
    const c = k === 1 ? 0 : (1 - rNorm - k) / (1 - k);
    const m = k === 1 ? 0 : (1 - gNorm - k) / (1 - k);
    const y = k === 1 ? 0 : (1 - bNorm - k) / (1 - k);

    return {
      c: Math.round(c * 100),
      m: Math.round(m * 100),
      y: Math.round(y * 100),
      k: Math.round(k * 100)
    };
  };

  const updateColor = (hex: string) => {
    const rgb = hexToRgb(hex);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);
    
    const colorInfo = { hex, rgb, hsl, cmyk };
    setSelectedColor(colorInfo);
    
    // Add to history
    if (!colorHistory.some(c => c.hex === hex)) {
      setColorHistory(prev => [colorInfo, ...prev.slice(0, 19)]);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.drawImage(img, 0, 0);
        setUploadedImage(event.target?.result as string);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const y = ((e.clientY - rect.top) / rect.height) * canvas.height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imageData = ctx.getImageData(x, y, 1, 1);
    const [r, g, b] = imageData.data;
    
    const hex = `#${[r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')}`;
    updateColor(hex);
  };

  const copyToClipboard = async (text: string, label: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(''), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Color Display */}
      <div className="bg-white rounded-2xl p-8 border-2 border-gray-200">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Color Preview */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Selected Color</h3>
            <div
              className="w-full h-64 rounded-xl shadow-lg border-4 border-white ring-2 ring-gray-200 transition-all"
              style={{ backgroundColor: selectedColor.hex }}
            />
            
            {/* Color Picker Input */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pick a Color
              </label>
              <input
                type="color"
                value={selectedColor.hex}
                onChange={(e) => updateColor(e.target.value)}
                className="w-full h-16 rounded-lg cursor-pointer border-2 border-gray-300"
              />
            </div>
          </div>

          {/* Color Values */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Color Values</h3>
            
            {/* HEX */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase">HEX</p>
                  <p className="text-lg font-mono font-bold text-gray-900">{selectedColor.hex}</p>
                </div>
                <button
                  onClick={() => copyToClipboard(selectedColor.hex, 'hex')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                >
                  {copied === 'hex' ? '✓' : 'Copy'}
                </button>
              </div>
            </div>

            {/* RGB */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase">RGB</p>
                  <p className="text-lg font-mono font-bold text-gray-900">
                    {selectedColor.rgb.r}, {selectedColor.rgb.g}, {selectedColor.rgb.b}
                  </p>
                </div>
                <button
                  onClick={() => copyToClipboard(`rgb(${selectedColor.rgb.r}, ${selectedColor.rgb.g}, ${selectedColor.rgb.b})`, 'rgb')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                >
                  {copied === 'rgb' ? '✓' : 'Copy'}
                </button>
              </div>
            </div>

            {/* HSL */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase">HSL</p>
                  <p className="text-lg font-mono font-bold text-gray-900">
                    {selectedColor.hsl.h}°, {selectedColor.hsl.s}%, {selectedColor.hsl.l}%
                  </p>
                </div>
                <button
                  onClick={() => copyToClipboard(`hsl(${selectedColor.hsl.h}, ${selectedColor.hsl.s}%, ${selectedColor.hsl.l}%)`, 'hsl')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                >
                  {copied === 'hsl' ? '✓' : 'Copy'}
                </button>
              </div>
            </div>

            {/* CMYK */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase">CMYK</p>
                  <p className="text-lg font-mono font-bold text-gray-900">
                    {selectedColor.cmyk.c}%, {selectedColor.cmyk.m}%, {selectedColor.cmyk.y}%, {selectedColor.cmyk.k}%
                  </p>
                </div>
                <button
                  onClick={() => copyToClipboard(`cmyk(${selectedColor.cmyk.c}%, ${selectedColor.cmyk.m}%, ${selectedColor.cmyk.y}%, ${selectedColor.cmyk.k}%)`, 'cmyk')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                >
                  {copied === 'cmyk' ? '✓' : 'Copy'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Color Picker */}
      <div className="bg-white rounded-2xl p-8 border-2 border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Pick Color from Image</h3>
        
        <div className="mb-4">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
          >
            📤 Upload Image
          </button>
        </div>

        {uploadedImage && (
          <div className="relative">
            <p className="text-sm text-gray-600 mb-2">Click on the image to pick a color</p>
            <canvas
              ref={canvasRef}
              onClick={handleCanvasClick}
              className="max-w-full h-auto rounded-lg border-2 border-gray-300 cursor-crosshair"
              style={{ maxHeight: '400px' }}
            />
          </div>
        )}

        {!uploadedImage && (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
            <div className="text-6xl mb-4">🎨</div>
            <p className="text-gray-600">Upload an image to pick colors from it</p>
          </div>
        )}
      </div>

      {/* Color History */}
      {colorHistory.length > 0 && (
        <div className="bg-white rounded-2xl p-8 border-2 border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">Color History</h3>
            <button
              onClick={() => setColorHistory([])}
              className="text-sm text-red-600 hover:text-red-800 font-medium"
            >
              Clear All
            </button>
          </div>
          
          <div className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-10 gap-3">
            {colorHistory.map((color, index) => (
              <button
                key={index}
                onClick={() => setSelectedColor(color)}
                className="aspect-square rounded-lg border-2 border-gray-300 hover:border-blue-500 hover:scale-110 transition-all shadow-sm hover:shadow-md"
                style={{ backgroundColor: color.hex }}
                title={color.hex}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
