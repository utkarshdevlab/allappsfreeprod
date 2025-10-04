'use client';

import { useState, useRef } from 'react';
import NextImage from 'next/image';

interface CompressedImage {
  id: string;
  original: File;
  originalSize: number;
  originalUrl: string;
  compressedUrl: string;
  compressedSize: number;
  quality: number;
  width: number;
  height: number;
}

export default function ImageCompressor() {
  const [images, setImages] = useState<CompressedImage[]>([]);
  const [quality, setQuality] = useState(80);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setIsProcessing(true);
    const newImages: CompressedImage[] = [];

    for (const file of Array.from(files)) {
      if (!file.type.startsWith('image/')) continue;

      const originalUrl = URL.createObjectURL(file);
      const compressed = await compressImage(file, quality);

      newImages.push({
        id: `${Date.now()}-${Math.random()}`,
        original: file,
        originalSize: file.size,
        originalUrl,
        compressedUrl: compressed.url,
        compressedSize: compressed.size,
        quality,
        width: compressed.width,
        height: compressed.height
      });
    }

    setImages(prev => [...prev, ...newImages]);
    setIsProcessing(false);
  };

  const compressImage = (file: File, quality: number): Promise<{ url: string; size: number; width: number; height: number }> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          
          const ctx = canvas.getContext('2d');
          if (!ctx) return;

          ctx.drawImage(img, 0, 0);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                const url = URL.createObjectURL(blob);
                resolve({
                  url,
                  size: blob.size,
                  width: img.width,
                  height: img.height
                });
              }
            },
            'image/jpeg',
            quality / 100
          );
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const downloadImage = (image: CompressedImage) => {
    const link = document.createElement('a');
    link.href = image.compressedUrl;
    link.download = `compressed-${image.original.name}`;
    link.click();
  };

  const downloadAll = () => {
    images.forEach((img, index) => {
      setTimeout(() => downloadImage(img), index * 100);
    });
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getSavings = (original: number, compressed: number) => {
    return Math.round((1 - compressed / original) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
        <h2 className="text-2xl font-bold mb-4">Compress Your Images</h2>
        <p className="text-blue-100 mb-6">Reduce file size without losing quality</p>
        
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isProcessing}
          className="px-8 py-4 bg-white text-blue-600 rounded-xl hover:bg-blue-50 font-bold text-lg disabled:opacity-50 transition-all shadow-lg"
        >
          {isProcessing ? '⏳ Processing...' : '📤 Select Images'}
        </button>
      </div>

      {/* Quality Slider */}
      <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">Compression Quality</h3>
          <span className="text-3xl font-bold text-blue-600">{quality}%</span>
        </div>
        <input
          type="range"
          min="10"
          max="100"
          value={quality}
          onChange={(e) => setQuality(parseInt(e.target.value))}
          className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-sm text-gray-600 mt-2">
          <span>Smaller file (Lower quality)</span>
          <span>Larger file (Higher quality)</span>
        </div>
      </div>

      {/* Images Grid */}
      {images.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900">
              Compressed Images ({images.length})
            </h3>
            <button
              onClick={downloadAll}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
            >
              ⬇️ Download All
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {images.map((img) => (
              <div key={img.id} className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
                <div className="relative h-48 bg-gray-100">
                  <NextImage
                    src={img.compressedUrl}
                    alt="Compressed"
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
                
                <div className="p-4">
                  <h4 className="font-semibold text-gray-900 truncate mb-3">
                    {img.original.name}
                  </h4>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Original</p>
                      <p className="text-sm font-bold text-gray-900">{formatSize(img.originalSize)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Compressed</p>
                      <p className="text-sm font-bold text-green-600">{formatSize(img.compressedSize)}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-600">Savings</span>
                      <span className="text-sm font-bold text-green-600">
                        {getSavings(img.originalSize, img.compressedSize)}% smaller
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${getSavings(img.originalSize, img.compressedSize)}%` }}
                      />
                    </div>
                  </div>

                  <div className="text-xs text-gray-500 mb-4">
                    {img.width} × {img.height} • Quality: {img.quality}%
                  </div>

                  <button
                    onClick={() => downloadImage(img)}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                  >
                    💾 Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {images.length === 0 && !isProcessing && (
        <div className="bg-white rounded-2xl p-12 border-2 border-dashed border-gray-300 text-center">
          <div className="text-6xl mb-4">🗜️</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Images Yet</h3>
          <p className="text-gray-600">Upload images to start compressing</p>
        </div>
      )}

      {/* Features */}
      <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-6 border-2 border-green-200">
        <h3 className="text-lg font-bold text-green-900 mb-4">✨ Features</h3>
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-green-800">
          <li className="flex items-start space-x-2">
            <span className="text-green-600 font-bold">✓</span>
            <span>Batch compression</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-green-600 font-bold">✓</span>
            <span>Adjustable quality</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-green-600 font-bold">✓</span>
            <span>Instant preview</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-green-600 font-bold">✓</span>
            <span>No file size limits</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-green-600 font-bold">✓</span>
            <span>100% client-side</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-green-600 font-bold">✓</span>
            <span>Privacy protected</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
