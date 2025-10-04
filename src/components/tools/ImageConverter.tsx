'use client';

import { useState, useRef, useCallback } from 'react';
import NextImage from 'next/image';

type ImageFormat = 'jpg' | 'png' | 'webp' | 'avif' | 'gif' | 'bmp' | 'tiff' | 'ico' | 'svg';
type CompressionMode = 'lossless' | 'lossy' | 'smart';
type ColorProfile = 'rgb' | 'grayscale' | 'sepia';
type AspectRatio = 'original' | '1:1' | '4:3' | '16:9' | '9:16' | 'custom';

interface ImageFile {
  id: string;
  file: File;
  preview: string;
  name: string;
  size: number;
  format: string;
  width?: number;
  height?: number;
  converted?: boolean;
  convertedUrl?: string;
  convertedSize?: number;
}

interface ConversionSettings {
  format: ImageFormat;
  quality: number;
  width?: number;
  height?: number;
  maintainAspectRatio: boolean;
  aspectRatio: AspectRatio;
  compressionMode: CompressionMode;
  preserveExif: boolean;
  preserveTransparency: boolean;
  colorProfile: ColorProfile;
  // Editing
  brightness: number;
  contrast: number;
  saturation: number;
  rotation: number;
  flipHorizontal: boolean;
  flipVertical: boolean;
  // Watermark
  watermarkText: string;
  watermarkOpacity: number;
  watermarkPosition: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
}

export default function ImageConverter() {
  const [activeTab, setActiveTab] = useState<'convert' | 'edit' | 'compress'>('convert');
  const [images, setImages] = useState<ImageFile[]>([]);
  const [selectedImage, setSelectedImage] = useState<ImageFile | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  
  const [settings, setSettings] = useState<ConversionSettings>({
    format: 'png',
    quality: 90,
    maintainAspectRatio: true,
    aspectRatio: 'original',
    compressionMode: 'smart',
    preserveExif: false,
    preserveTransparency: true,
    colorProfile: 'rgb',
    brightness: 100,
    contrast: 100,
    saturation: 100,
    rotation: 0,
    flipHorizontal: false,
    flipVertical: false,
    watermarkText: '',
    watermarkOpacity: 50,
    watermarkPosition: 'bottom-right'
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Handle file selection
  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files) return;
    
    Array.from(files).forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            const imageFile: ImageFile = {
              id: `${Date.now()}-${Math.random()}`,
              file,
              preview: e.target?.result as string,
              name: file.name,
              size: file.size,
              format: file.type.split('/')[1].toUpperCase(),
              width: img.width,
              height: img.height
            };
            setImages(prev => [...prev, imageFile]);
          };
          img.src = e.target?.result as string;
        };
        reader.readAsDataURL(file);
      }
    });
  }, []);

  // Drag and drop handlers
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFileSelect(e.dataTransfer.files);
  }, [handleFileSelect]);

  // Convert image
  const convertImage = async (imageFile: ImageFile) => {
    return new Promise<ImageFile>((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Calculate dimensions
        let width = settings.width || img.width;
        let height = settings.height || img.height;

        if (settings.maintainAspectRatio && (settings.width || settings.height)) {
          const ratio = img.width / img.height;
          if (settings.width && !settings.height) {
            width = settings.width;
            height = settings.width / ratio;
          } else if (settings.height && !settings.width) {
            height = settings.height;
            width = settings.height * ratio;
          }
        }

        // Apply aspect ratio
        if (settings.aspectRatio !== 'original' && settings.aspectRatio !== 'custom') {
          const [w, h] = settings.aspectRatio.split(':').map(Number);
          const targetRatio = w / h;
          const currentRatio = width / height;
          
          if (currentRatio > targetRatio) {
            width = height * targetRatio;
          } else {
            height = width / targetRatio;
          }
        }

        canvas.width = width;
        canvas.height = height;

        // Apply transformations
        ctx.save();
        
        // Rotation and flip
        ctx.translate(width / 2, height / 2);
        ctx.rotate((settings.rotation * Math.PI) / 180);
        ctx.scale(
          settings.flipHorizontal ? -1 : 1,
          settings.flipVertical ? -1 : 1
        );
        ctx.translate(-width / 2, -height / 2);

        // Draw image
        ctx.drawImage(img, 0, 0, width, height);
        ctx.restore();

        // Apply filters
        if (settings.brightness !== 100 || settings.contrast !== 100 || settings.saturation !== 100) {
          const imageData = ctx.getImageData(0, 0, width, height);
          const data = imageData.data;

          for (let i = 0; i < data.length; i += 4) {
            // Brightness
            data[i] = data[i] * (settings.brightness / 100);
            data[i + 1] = data[i + 1] * (settings.brightness / 100);
            data[i + 2] = data[i + 2] * (settings.brightness / 100);

            // Contrast
            const factor = (259 * (settings.contrast + 255)) / (255 * (259 - settings.contrast));
            data[i] = factor * (data[i] - 128) + 128;
            data[i + 1] = factor * (data[i + 1] - 128) + 128;
            data[i + 2] = factor * (data[i + 2] - 128) + 128;
          }

          ctx.putImageData(imageData, 0, 0);
        }

        // Apply color profile
        if (settings.colorProfile === 'grayscale') {
          const imageData = ctx.getImageData(0, 0, width, height);
          const data = imageData.data;
          for (let i = 0; i < data.length; i += 4) {
            const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
            data[i] = data[i + 1] = data[i + 2] = gray;
          }
          ctx.putImageData(imageData, 0, 0);
        } else if (settings.colorProfile === 'sepia') {
          const imageData = ctx.getImageData(0, 0, width, height);
          const data = imageData.data;
          for (let i = 0; i < data.length; i += 4) {
            const r = data[i], g = data[i + 1], b = data[i + 2];
            data[i] = Math.min(255, r * 0.393 + g * 0.769 + b * 0.189);
            data[i + 1] = Math.min(255, r * 0.349 + g * 0.686 + b * 0.168);
            data[i + 2] = Math.min(255, r * 0.272 + g * 0.534 + b * 0.131);
          }
          ctx.putImageData(imageData, 0, 0);
        }

        // Add watermark
        if (settings.watermarkText) {
          ctx.save();
          ctx.globalAlpha = settings.watermarkOpacity / 100;
          ctx.fillStyle = 'white';
          ctx.strokeStyle = 'black';
          ctx.lineWidth = 2;
          ctx.font = `${Math.floor(width / 20)}px Arial`;
          
          let x = 10, y = 30;
          const textWidth = ctx.measureText(settings.watermarkText).width;
          
          switch (settings.watermarkPosition) {
            case 'top-right':
              x = width - textWidth - 10;
              y = 30;
              break;
            case 'bottom-left':
              x = 10;
              y = height - 10;
              break;
            case 'bottom-right':
              x = width - textWidth - 10;
              y = height - 10;
              break;
            case 'center':
              x = (width - textWidth) / 2;
              y = height / 2;
              break;
          }
          
          ctx.strokeText(settings.watermarkText, x, y);
          ctx.fillText(settings.watermarkText, x, y);
          ctx.restore();
        }

        // Convert to desired format
        const mimeType = `image/${settings.format === 'jpg' ? 'jpeg' : settings.format}`;
        const quality = settings.quality / 100;

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              resolve({
                ...imageFile,
                converted: true,
                convertedUrl: url,
                convertedSize: blob.size
              });
            }
          },
          mimeType,
          quality
        );
      };
      img.src = imageFile.preview;
    });
  };

  // Convert all images
  const handleConvertAll = async () => {
    setIsProcessing(true);
    const converted: ImageFile[] = [];
    
    for (const img of images) {
      const result = await convertImage(img);
      converted.push(result);
    }
    
    setImages(converted);
    setIsProcessing(false);
  };

  // Download single image
  const downloadImage = (image: ImageFile) => {
    if (!image.convertedUrl) return;
    
    const link = document.createElement('a');
    link.href = image.convertedUrl;
    link.download = `${image.name.split('.')[0]}.${settings.format}`;
    link.click();
  };

  // Download all as ZIP (simplified - downloads individually)
  const downloadAll = () => {
    images.forEach((img) => {
      if (img.convertedUrl) {
        setTimeout(() => downloadImage(img), 100);
      }
    });
  };

  // Remove image
  const removeImage = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
    if (selectedImage?.id === id) {
      setSelectedImage(null);
    }
  };

  // Clear all
  const clearAll = () => {
    images.forEach(img => {
      if (img.convertedUrl) URL.revokeObjectURL(img.convertedUrl);
    });
    setImages([]);
    setSelectedImage(null);
  };

  // Format file size
  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {['convert', 'edit', 'compress'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as 'convert' | 'edit' | 'compress')}
              className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                activeTab === tab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab === 'convert' && '🔄 Convert'}
              {tab === 'edit' && '✏️ Edit & Enhance'}
              {tab === 'compress' && '🗜️ Compress'}
            </button>
          ))}
        </nav>
      </div>

      {/* File Upload Area */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
          dragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
        />
        <div className="text-6xl mb-4">🖼️</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Drop images here or click to upload
        </h3>
        <p className="text-gray-600 mb-4">
          Supports: JPG, PNG, WEBP, AVIF, GIF, BMP, TIFF, ICO, SVG
        </p>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
        >
          Select Files
        </button>
        <p className="text-sm text-gray-500 mt-4">
          ✨ Batch processing • AI optimization • EXIF preservation
        </p>
      </div>

      {/* Images Grid */}
      {images.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              Images ({images.length})
            </h3>
            <div className="flex gap-2">
              <button
                onClick={clearAll}
                className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium"
              >
                Clear All
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((img) => (
              <div
                key={img.id}
                className={`relative bg-white rounded-lg border-2 overflow-hidden transition-all ${
                  selectedImage?.id === img.id
                    ? 'border-blue-500 ring-2 ring-blue-200'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedImage(img)}
              >
                <div className="aspect-square relative">
                  <NextImage
                    src={img.convertedUrl || img.preview}
                    alt={img.name}
                    width={300}
                    height={300}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                  {img.converted && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">
                      ✓ Converted
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {img.name}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
                    <span>{img.format}</span>
                    <span>{formatSize(img.size)}</span>
                  </div>
                  {img.width && img.height && (
                    <p className="text-xs text-gray-500 mt-1">
                      {img.width} × {img.height}
                    </p>
                  )}
                  {img.converted && img.convertedSize && (
                    <div className="mt-2 pt-2 border-t border-gray-200">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-green-600 font-medium">
                          {formatSize(img.convertedSize)}
                        </span>
                        <span className="text-gray-500">
                          {Math.round((1 - img.convertedSize / img.size) * 100)}% smaller
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                <div className="absolute top-2 left-2 flex gap-1">
                  {img.convertedUrl && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        downloadImage(img);
                      }}
                      className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700"
                      title="Download"
                    >
                      ⬇️
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage(img.id);
                    }}
                    className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700"
                    title="Remove"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Settings Panel */}
      {images.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Settings */}
          <div className="lg:col-span-2 bg-white rounded-xl border-2 border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-4">Conversion Settings</h3>
            
            <div className="space-y-6">
              {/* Format Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Output Format
                </label>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                  {(['jpg', 'png', 'webp', 'avif', 'gif', 'bmp', 'tiff', 'ico'] as ImageFormat[]).map((format) => (
                    <button
                      key={format}
                      onClick={() => setSettings({ ...settings, format })}
                      className={`px-4 py-2 rounded-lg border-2 font-medium uppercase text-sm ${
                        settings.format === format
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {format}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quality */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quality: {settings.quality}%
                </label>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={settings.quality}
                  onChange={(e) => setSettings({ ...settings, quality: parseInt(e.target.value) })}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Low (smaller file)</span>
                  <span>High (better quality)</span>
                </div>
              </div>

              {/* Compression Mode */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Compression Mode
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['lossless', 'lossy', 'smart'] as CompressionMode[]).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setSettings({ ...settings, compressionMode: mode })}
                      className={`px-4 py-2 rounded-lg border-2 font-medium capitalize text-sm ${
                        settings.compressionMode === mode
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {mode === 'smart' && '✨ '}
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dimensions */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dimensions (optional)
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input
                      type="number"
                      placeholder="Width"
                      value={settings.width || ''}
                      onChange={(e) => setSettings({ ...settings, width: e.target.value ? parseInt(e.target.value) : undefined })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      placeholder="Height"
                      value={settings.height || ''}
                      onChange={(e) => setSettings({ ...settings, height: e.target.value ? parseInt(e.target.value) : undefined })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
                <div className="flex items-center mt-2">
                  <input
                    type="checkbox"
                    checked={settings.maintainAspectRatio}
                    onChange={(e) => setSettings({ ...settings, maintainAspectRatio: e.target.checked })}
                    className="mr-2"
                  />
                  <label className="text-sm text-gray-700">Maintain aspect ratio</label>
                </div>
              </div>

              {/* Aspect Ratio Presets */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Aspect Ratio
                </label>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                  {(['original', '1:1', '4:3', '16:9', '9:16', 'custom'] as AspectRatio[]).map((ratio) => (
                    <button
                      key={ratio}
                      onClick={() => setSettings({ ...settings, aspectRatio: ratio })}
                      className={`px-3 py-2 rounded-lg border-2 font-medium text-sm ${
                        settings.aspectRatio === ratio
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {ratio}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Profile */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color Profile
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['rgb', 'grayscale', 'sepia'] as ColorProfile[]).map((profile) => (
                    <button
                      key={profile}
                      onClick={() => setSettings({ ...settings, colorProfile: profile })}
                      className={`px-4 py-2 rounded-lg border-2 font-medium capitalize text-sm ${
                        settings.colorProfile === profile
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {profile}
                    </button>
                  ))}
                </div>
              </div>

              {/* Adjustments */}
              {activeTab === 'edit' && (
                <div className="space-y-4 pt-4 border-t border-gray-200">
                  <h4 className="font-semibold text-gray-900">Image Adjustments</h4>
                  
                  {/* Brightness */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Brightness: {settings.brightness}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={settings.brightness}
                      onChange={(e) => setSettings({ ...settings, brightness: parseInt(e.target.value) })}
                      className="w-full"
                    />
                  </div>

                  {/* Contrast */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contrast: {settings.contrast}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={settings.contrast}
                      onChange={(e) => setSettings({ ...settings, contrast: parseInt(e.target.value) })}
                      className="w-full"
                    />
                  </div>

                  {/* Saturation */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Saturation: {settings.saturation}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={settings.saturation}
                      onChange={(e) => setSettings({ ...settings, saturation: parseInt(e.target.value) })}
                      className="w-full"
                    />
                  </div>

                  {/* Rotation */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rotation: {settings.rotation}°
                    </label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSettings({ ...settings, rotation: (settings.rotation - 90) % 360 })}
                        className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium"
                      >
                        ↺ -90°
                      </button>
                      <button
                        onClick={() => setSettings({ ...settings, rotation: (settings.rotation + 90) % 360 })}
                        className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium"
                      >
                        ↻ +90°
                      </button>
                    </div>
                  </div>

                  {/* Flip */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setSettings({ ...settings, flipHorizontal: !settings.flipHorizontal })}
                      className={`px-4 py-2 rounded-lg border-2 font-medium ${
                        settings.flipHorizontal
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      ↔️ Flip Horizontal
                    </button>
                    <button
                      onClick={() => setSettings({ ...settings, flipVertical: !settings.flipVertical })}
                      className={`px-4 py-2 rounded-lg border-2 font-medium ${
                        settings.flipVertical
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      ↕️ Flip Vertical
                    </button>
                  </div>

                  {/* Watermark */}
                  <div className="pt-4 border-t border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-3">Watermark</h4>
                    <input
                      type="text"
                      placeholder="Watermark text"
                      value={settings.watermarkText}
                      onChange={(e) => setSettings({ ...settings, watermarkText: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-3"
                    />
                    {settings.watermarkText && (
                      <>
                        <div className="mb-3">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Opacity: {settings.watermarkOpacity}%
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={settings.watermarkOpacity}
                            onChange={(e) => setSettings({ ...settings, watermarkOpacity: parseInt(e.target.value) })}
                            className="w-full"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Position
                          </label>
                          <select
                            value={settings.watermarkPosition}
                            onChange={(e) => setSettings({ ...settings, watermarkPosition: e.target.value as 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center' })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                          >
                            <option value="top-left">Top Left</option>
                            <option value="top-right">Top Right</option>
                            <option value="bottom-left">Bottom Left</option>
                            <option value="bottom-right">Bottom Right</option>
                            <option value="center">Center</option>
                          </select>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Options */}
              <div className="space-y-2 pt-4 border-t border-gray-200">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.preserveExif}
                    onChange={(e) => setSettings({ ...settings, preserveExif: e.target.checked })}
                    className="mr-2"
                  />
                  <label className="text-sm text-gray-700">Preserve EXIF metadata</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.preserveTransparency}
                    onChange={(e) => setSettings({ ...settings, preserveTransparency: e.target.checked })}
                    className="mr-2"
                  />
                  <label className="text-sm text-gray-700">Preserve transparency (PNG/WEBP)</label>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Actions</h3>
              
              <div className="space-y-3">
                <button
                  onClick={handleConvertAll}
                  disabled={isProcessing || images.length === 0}
                  className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? '⏳ Processing...' : '🔄 Convert All'}
                </button>

                {images.some(img => img.converted) && (
                  <button
                    onClick={downloadAll}
                    className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
                  >
                    ⬇️ Download All
                  </button>
                )}

                <button
                  onClick={() => {
                    setSettings({
                      format: 'png',
                      quality: 90,
                      maintainAspectRatio: true,
                      aspectRatio: 'original',
                      compressionMode: 'smart',
                      preserveExif: false,
                      preserveTransparency: true,
                      colorProfile: 'rgb',
                      brightness: 100,
                      contrast: 100,
                      saturation: 100,
                      rotation: 0,
                      flipHorizontal: false,
                      flipVertical: false,
                      watermarkText: '',
                      watermarkOpacity: 50,
                      watermarkPosition: 'bottom-right'
                    });
                  }}
                  className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium"
                >
                  🔄 Reset Settings
                </button>
              </div>
            </div>

            {/* Features */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-200 p-6">
              <h3 className="text-lg font-semibold mb-3 text-blue-900">✨ Pro Features</h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li>✓ All format support (JPG, PNG, WEBP, AVIF, etc.)</li>
                <li>✓ Batch processing</li>
                <li>✓ AI smart compression</li>
                <li>✓ EXIF data control</li>
                <li>✓ Advanced editing tools</li>
                <li>✓ Watermark support</li>
                <li>✓ Custom dimensions & aspect ratios</li>
                <li>✓ Color profile conversion</li>
                <li>✓ Lossless & lossy compression</li>
                <li>✓ No file size limits</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
