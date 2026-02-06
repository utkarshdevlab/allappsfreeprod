'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

type AspectRatio = '1:1' | '4:3' | '16:9' | '9:16' | '3:4';

const aspectRatios: { value: AspectRatio; label: string }[] = [
  { value: '1:1', label: 'Square (1:1)' },
  { value: '4:3', label: 'Standard (4:3)' },
  { value: '16:9', label: 'Widescreen (16:9)' },
  { value: '9:16', label: 'Portrait (9:16)' },
  { value: '3:4', label: 'Classic (3:4)' },
];

const categories = [
  'nature', 'animals', 'architecture', 'people', 'technology',
  'business', 'fashion', 'food', 'sports', 'travel'
];

export default function RandomImageGenerator() {
  const [width, setWidth] = useState<number>(800);
  const [height, setHeight] = useState<number>(600);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
  const [lockAspectRatio, setLockAspectRatio] = useState<boolean>(true);
  const [category, setCategory] = useState<string>('');
  const [grayscale, setGrayscale] = useState<boolean>(false);
  const [blur, setBlur] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [imageId, setImageId] = useState<string>('');

  // Update height when width or aspect ratio changes (if locked)
  useEffect(() => {
    if (lockAspectRatio) {
      const [w, h] = aspectRatio.split(':').map(Number);
      const newHeight = Math.round((width * h) / w);
      setHeight(newHeight);
    }
  }, [width, aspectRatio, lockAspectRatio]);

  const generateImage = async () => {
    if (width < 100 || width > 2000 || height < 100 || height > 2000) {
      alert('Width and height must be between 100 and 2000 pixels');
      return;
    }

    setIsLoading(true);
    
    try {
      const params = new URLSearchParams({
        width: width.toString(),
        height: height.toString(),
        category: category,
        grayscale: grayscale.toString(),
        blur: blur.toString()
      });

      const response = await fetch(`/api/generate-image?${params.toString()}`);
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to generate image');
      }

      setImageUrl(data.url);
      setImageId(data.imageId);

    } catch (error) {
      console.error('Error generating image:', error);
      alert('Failed to generate image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadImage = async () => {
    if (!imageUrl) return;
    
    try {
      // Convert the image to a blob first to handle CORS
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `random-image-${imageId}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the blob URL
      URL.revokeObjectURL(blobUrl);
      
      alert('Image downloaded successfully!');
    } catch (error) {
      console.error('Error downloading image:', error);
      alert('Failed to download image. Please try again.');
    }
  };

  const copyImageUrl = () => {
    if (!imageUrl) return;
    
    navigator.clipboard.writeText(imageUrl);
    // Simple alert since we don't have toast
    alert('Image URL copied to clipboard!');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Controls */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Image Generator</h2>
              <p className="text-gray-600">Customize and generate random stock images</p>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="width" className="block text-sm font-medium text-gray-700">
                  Width: {width}px
                </label>
                <input
                  type="range"
                  id="width"
                  min="100"
                  max="2000"
                  step="10"
                  value={width}
                  onChange={(e) => setWidth(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="height" className="block text-sm font-medium text-gray-700">
                  Height: {height}px
                </label>
                <input
                  type="range"
                  id="height"
                  min="100"
                  max="2000"
                  step="10"
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  disabled={lockAspectRatio}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer disabled:opacity-50"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="aspect-ratio" className="block text-sm font-medium text-gray-700">
                    Aspect Ratio
                  </label>
                  <div className="flex items-center space-x-2">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        id="lock-ratio"
                        className="sr-only peer"
                        checked={lockAspectRatio}
                        onChange={(e) => setLockAspectRatio(e.target.checked)}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      <span className="ml-2 text-sm font-medium text-gray-700">Lock</span>
                    </label>
                  </div>
                </div>
                <select
                  value={aspectRatio}
                  onChange={(e) => setAspectRatio(e.target.value as AspectRatio)}
                  disabled={!lockAspectRatio}
                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                >
                  <option value="">Select aspect ratio</option>
                  {aspectRatios.map((ratio) => (
                    <option key={ratio.value} value={ratio.value}>
                      {ratio.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                  Category (Optional)
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Any category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="grayscale" className="text-sm font-medium text-gray-700">
                    Grayscale
                  </label>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      id="grayscale"
                      className="sr-only peer"
                      checked={grayscale}
                      onChange={(e) => setGrayscale(e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label htmlFor="blur" className="block text-sm font-medium text-gray-700">
                      Blur: {blur}
                    </label>
                  </div>
                  <input
                    type="range"
                    id="blur"
                    min="0"
                    max="10"
                    step="1"
                    value={blur}
                    onChange={(e) => setBlur(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>

              <button 
                onClick={generateImage} 
                className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Generate Image
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md h-full">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-2">Preview</h2>
              <p className="text-gray-600 mb-6">
                Your generated image will appear here
              </p>
              <div className="flex flex-col items-center justify-center p-4 space-y-4">
                {imageUrl ? (
                  <>
                    <div className="relative w-full max-w-2xl overflow-hidden rounded-lg border border-gray-200">
                      <div className="relative w-full" style={{ aspectRatio: `${width}/${height}` }}>
                        <Image
                          src={imageUrl}
                          alt="Generated content"
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 w-full justify-center">
                      <button 
                        onClick={downloadImage} 
                        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Download
                      </button>
                      <button 
                        onClick={copyImageUrl} 
                        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                        </svg>
                        Copy URL
                      </button>
                      <button 
                        onClick={generateImage} 
                        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Generate Another
                      </button>
                    </div>
                    <div className="text-sm text-gray-500 mt-2 text-center">
                      <p>Image ID: {imageId || 'N/A'}</p>
                      <p>Dimensions: {width} × {height}px</p>
                      <p>Powered by Picsum Photos</p>
                    </div>
                  </>
                ) : (
                  <div 
                    className="flex items-center justify-center bg-gray-100 rounded-lg p-8"
                    style={{
                      width: '100%',
                      aspectRatio: `${width}/${Math.max(1, height)}`,
                    }}
                  >
                    <p className="text-gray-500 text-center">
                      Click &quot;Generate Image&quot; to create your first image
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
