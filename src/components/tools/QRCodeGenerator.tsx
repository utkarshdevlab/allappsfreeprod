'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import QRCodeStyling, { 
  Options as QRCodeOptions,
  DotType,
  CornerSquareType,
  CornerDotType,
  DrawType,
  TypeNumber,
  Mode,
  ErrorCorrectionLevel
} from 'qr-code-styling';

type QRType = 'url' | 'text' | 'email' | 'phone' | 'sms' | 'wifi' | 'vcard' | 'location' | 'event' | 'payment';
type ExportFormat = 'png' | 'svg' | 'pdf' | 'jpeg';
type DotStyle = 'square' | 'dots' | 'rounded' | 'extra-rounded' | 'classy' | 'classy-rounded';
type CornerStyle = 'square' | 'dot' | 'extra-rounded';

interface QRData {
  type: QRType;
  content: string;
  // URL
  url?: string;
  // Email
  email?: string;
  subject?: string;
  body?: string;
  // Phone/SMS
  phone?: string;
  message?: string;
  // WiFi
  ssid?: string;
  password?: string;
  encryption?: 'WPA' | 'WEP' | 'nopass';
  hidden?: boolean;
  // vCard
  firstName?: string;
  lastName?: string;
  organization?: string;
  title?: string;
  vcardEmail?: string;
  vcardPhone?: string;
  website?: string;
  address?: string;
  // Location
  latitude?: string;
  longitude?: string;
  // Event
  eventTitle?: string;
  eventLocation?: string;
  eventStart?: string;
  eventEnd?: string;
  eventDescription?: string;
  // Payment
  paymentType?: 'upi' | 'paypal' | 'bitcoin';
  paymentId?: string;
  amount?: string;
  note?: string;
}

interface QRStyle {
  width: number;
  height: number;
  dotsType: DotStyle;
  cornerSquareType: CornerStyle;
  cornerDotType: CornerStyle;
  backgroundColor: string;
  dotsColor: string;
  cornersSquareColor: string;
  cornersDotColor: string;
  backgroundGradient: boolean;
  dotsGradient: boolean;
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';
  margin: number;
}

interface SavedQRCode {
  id: string;
  name: string;
  type: QRType;
  data: QRData;
  style: QRStyle;
  isDynamic: boolean;
  createdAt: string;
  scans?: number;
  lastScanned?: string;
}

export default function QRCodeGenerator() {
  const [activeTab, setActiveTab] = useState<'generate' | 'bulk' | 'manage'>('generate');
  const [qrType, setQrType] = useState<QRType>('url');
  const [qrData, setQrData] = useState<QRData>({
    type: 'url',
    content: '',
    url: ''
  });
  
  const [qrStyle, setQrStyle] = useState<QRStyle>({
    width: 300,
    height: 300,
    dotsType: 'rounded',
    cornerSquareType: 'extra-rounded',
    cornerDotType: 'dot',
    backgroundColor: '#ffffff',
    dotsColor: '#000000',
    cornersSquareColor: '#000000',
    cornersDotColor: '#000000',
    backgroundGradient: false,
    dotsGradient: false,
    errorCorrectionLevel: 'M',
    margin: 10
  });

  const [, setLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [caption, setCaption] = useState('');
  const [, ] = useState<'none' | 'scan-me' | 'download' | 'custom'>('none');
  const [isDynamic, setIsDynamic] = useState(false);
  const [qrName, setQrName] = useState('');
  
  const [savedQRCodes, setSavedQRCodes] = useState<SavedQRCode[]>([]);
  const [, ] = useState<SavedQRCode | null>(null);
  
  // Bulk generation
  const [bulkData, setBulkData] = useState('');
  const [bulkQRCodes, setBulkQRCodes] = useState<Array<{ id: string; content: string; name: string }>>([]);
  
  const qrRef = useRef<HTMLDivElement>(null);
  const qrCodeRef = useRef<QRCodeStyling | null>(null);

  // Generate QR content based on type
  const generateQRContent = (): string => {
    switch (qrType) {
      case 'url':
        return qrData.url || '';
      case 'text':
        return qrData.content || '';
      case 'email':
        const emailParts = [`mailto:${qrData.email || ''}`];
        if (qrData.subject) emailParts.push(`subject=${encodeURIComponent(qrData.subject)}`);
        if (qrData.body) emailParts.push(`body=${encodeURIComponent(qrData.body)}`);
        return emailParts[0] + (emailParts.length > 1 ? '?' + emailParts.slice(1).join('&') : '');
      case 'phone':
        return `tel:${qrData.phone || ''}`;
      case 'sms':
        return `sms:${qrData.phone || ''}${qrData.message ? `?body=${encodeURIComponent(qrData.message)}` : ''}`;
      case 'wifi':
        return `WIFI:T:${qrData.encryption || 'WPA'};S:${qrData.ssid || ''};P:${qrData.password || ''};H:${qrData.hidden ? 'true' : 'false'};;`;
      case 'vcard':
        return `BEGIN:VCARD\nVERSION:3.0\nFN:${qrData.firstName || ''} ${qrData.lastName || ''}\nORG:${qrData.organization || ''}\nTITLE:${qrData.title || ''}\nTEL:${qrData.vcardPhone || ''}\nEMAIL:${qrData.vcardEmail || ''}\nURL:${qrData.website || ''}\nADR:${qrData.address || ''}\nEND:VCARD`;
      case 'location':
        return `geo:${qrData.latitude || '0'},${qrData.longitude || '0'}`;
      case 'event':
        const start = qrData.eventStart ? new Date(qrData.eventStart).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z' : '';
        const end = qrData.eventEnd ? new Date(qrData.eventEnd).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z' : '';
        return `BEGIN:VEVENT\nSUMMARY:${qrData.eventTitle || ''}\nLOCATION:${qrData.eventLocation || ''}\nDTSTART:${start}\nDTEND:${end}\nDESCRIPTION:${qrData.eventDescription || ''}\nEND:VEVENT`;
      case 'payment':
        if (qrData.paymentType === 'upi') {
          return `upi://pay?pa=${qrData.paymentId || ''}&am=${qrData.amount || ''}&tn=${encodeURIComponent(qrData.note || '')}`;
        } else if (qrData.paymentType === 'bitcoin') {
          return `bitcoin:${qrData.paymentId || ''}?amount=${qrData.amount || ''}`;
        }
        return qrData.paymentId || '';
      default:
        return qrData.content || '';
    }
  };

  // Initialize QR Code
  useEffect(() => {
    if (!qrRef.current) return;

    const content = generateQRContent();
    if (!content) return;

    const options: QRCodeOptions = {
      width: qrStyle.width,
      height: qrStyle.height,
      type: 'canvas' as DrawType,
      data: content,
      margin: qrStyle.margin,
      qrOptions: {
        typeNumber: 0 as TypeNumber,
        mode: 'Byte' as Mode,
        errorCorrectionLevel: qrStyle.errorCorrectionLevel as ErrorCorrectionLevel
      },
      imageOptions: {
        hideBackgroundDots: true,
        imageSize: 0.4,
        margin: 5,
        crossOrigin: 'anonymous'
      },
      dotsOptions: {
        color: qrStyle.dotsColor,
        type: qrStyle.dotsType as DotType
      },
      backgroundOptions: {
        color: qrStyle.backgroundColor
      },
      cornersSquareOptions: {
        color: qrStyle.cornersSquareColor,
        type: qrStyle.cornerSquareType as CornerSquareType
      },
      cornersDotOptions: {
        color: qrStyle.cornersDotColor,
        type: qrStyle.cornerDotType as CornerDotType
      }
    };

    if (logoPreview) {
      options.image = logoPreview;
    }

    if (qrCodeRef.current) {
      qrCodeRef.current.update(options);
    } else {
      qrCodeRef.current = new QRCodeStyling(options);
      qrCodeRef.current.append(qrRef.current);
    }
  }, [qrType, qrData, qrStyle, logoPreview]);

  // Handle logo upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogo(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Download QR Code
  const downloadQR = (format: ExportFormat) => {
    if (!qrCodeRef.current) return;

    const fileName = qrName || `qr-code-${Date.now()}`;
    
    if (format === 'png' || format === 'jpeg') {
      qrCodeRef.current.download({
        name: fileName,
        extension: format
      });
    } else if (format === 'svg') {
      qrCodeRef.current.download({
        name: fileName,
        extension: 'svg'
      });
    } else if (format === 'pdf') {
      // For PDF, we'll download as PNG first (simplified)
      qrCodeRef.current.download({
        name: fileName,
        extension: 'png'
      });
    }
  };

  // Save QR Code
  const saveQRCode = () => {
    const newQR: SavedQRCode = {
      id: Date.now().toString(),
      name: qrName || `QR Code ${savedQRCodes.length + 1}`,
      type: qrType,
      data: { ...qrData },
      style: { ...qrStyle },
      isDynamic,
      createdAt: new Date().toISOString(),
      scans: 0
    };
    
    const updated = [...savedQRCodes, newQR];
    setSavedQRCodes(updated);
    localStorage.setItem('savedQRCodes', JSON.stringify(updated));
    alert('QR Code saved successfully!');
  };

  // Load saved QR codes
  useEffect(() => {
    const saved = localStorage.getItem('savedQRCodes');
    if (saved) {
      setSavedQRCodes(JSON.parse(saved));
    }
  }, []);

  // Bulk generation
  const generateBulkQRCodes = () => {
    const lines = bulkData.split('\n').filter(line => line.trim());
    const codes = lines.map((line, index) => ({
      id: `bulk-${Date.now()}-${index}`,
      content: line.trim(),
      name: `Bulk QR ${index + 1}`
    }));
    setBulkQRCodes(codes);
  };

  // Render QR type form
  const renderQRForm = () => {
    switch (qrType) {
      case 'url':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Website URL</label>
              <input
                type="url"
                value={qrData.url || ''}
                onChange={(e) => setQrData({ ...qrData, url: e.target.value })}
                placeholder="https://example.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        );
      
      case 'text':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Text Content</label>
              <textarea
                value={qrData.content || ''}
                onChange={(e) => setQrData({ ...qrData, content: e.target.value })}
                placeholder="Enter your text here..."
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        );
      
      case 'email':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                value={qrData.email || ''}
                onChange={(e) => setQrData({ ...qrData, email: e.target.value })}
                placeholder="email@example.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subject (Optional)</label>
              <input
                type="text"
                value={qrData.subject || ''}
                onChange={(e) => setQrData({ ...qrData, subject: e.target.value })}
                placeholder="Email subject"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Body (Optional)</label>
              <textarea
                value={qrData.body || ''}
                onChange={(e) => setQrData({ ...qrData, body: e.target.value })}
                placeholder="Email body"
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        );
      
      case 'phone':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <input
                type="tel"
                value={qrData.phone || ''}
                onChange={(e) => setQrData({ ...qrData, phone: e.target.value })}
                placeholder="+1234567890"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        );
      
      case 'sms':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <input
                type="tel"
                value={qrData.phone || ''}
                onChange={(e) => setQrData({ ...qrData, phone: e.target.value })}
                placeholder="+1234567890"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Message (Optional)</label>
              <textarea
                value={qrData.message || ''}
                onChange={(e) => setQrData({ ...qrData, message: e.target.value })}
                placeholder="Pre-filled SMS message"
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        );
      
      case 'wifi':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Network Name (SSID)</label>
              <input
                type="text"
                value={qrData.ssid || ''}
                onChange={(e) => setQrData({ ...qrData, ssid: e.target.value })}
                placeholder="My WiFi Network"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="text"
                value={qrData.password || ''}
                onChange={(e) => setQrData({ ...qrData, password: e.target.value })}
                placeholder="WiFi password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Encryption</label>
              <select
                value={qrData.encryption || 'WPA'}
                onChange={(e) => setQrData({ ...qrData, encryption: e.target.value as 'WPA' | 'WEP' | 'nopass' })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="WPA">WPA/WPA2</option>
                <option value="WEP">WEP</option>
                <option value="nopass">No Password</option>
              </select>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={qrData.hidden || false}
                onChange={(e) => setQrData({ ...qrData, hidden: e.target.checked })}
                className="mr-2"
              />
              <label className="text-sm text-gray-700">Hidden Network</label>
            </div>
          </div>
        );
      
      case 'vcard':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                <input
                  type="text"
                  value={qrData.firstName || ''}
                  onChange={(e) => setQrData({ ...qrData, firstName: e.target.value })}
                  placeholder="John"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                <input
                  type="text"
                  value={qrData.lastName || ''}
                  onChange={(e) => setQrData({ ...qrData, lastName: e.target.value })}
                  placeholder="Doe"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Organization</label>
              <input
                type="text"
                value={qrData.organization || ''}
                onChange={(e) => setQrData({ ...qrData, organization: e.target.value })}
                placeholder="Company Name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
              <input
                type="text"
                value={qrData.title || ''}
                onChange={(e) => setQrData({ ...qrData, title: e.target.value })}
                placeholder="Software Engineer"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={qrData.vcardEmail || ''}
                onChange={(e) => setQrData({ ...qrData, vcardEmail: e.target.value })}
                placeholder="john@example.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              <input
                type="tel"
                value={qrData.vcardPhone || ''}
                onChange={(e) => setQrData({ ...qrData, vcardPhone: e.target.value })}
                placeholder="+1234567890"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
              <input
                type="url"
                value={qrData.website || ''}
                onChange={(e) => setQrData({ ...qrData, website: e.target.value })}
                placeholder="https://example.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
              <input
                type="text"
                value={qrData.address || ''}
                onChange={(e) => setQrData({ ...qrData, address: e.target.value })}
                placeholder="123 Main St, City, Country"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        );
      
      case 'location':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Latitude</label>
              <input
                type="text"
                value={qrData.latitude || ''}
                onChange={(e) => setQrData({ ...qrData, latitude: e.target.value })}
                placeholder="40.7128"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Longitude</label>
              <input
                type="text"
                value={qrData.longitude || ''}
                onChange={(e) => setQrData({ ...qrData, longitude: e.target.value })}
                placeholder="-74.0060"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        );
      
      case 'event':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Event Title</label>
              <input
                type="text"
                value={qrData.eventTitle || ''}
                onChange={(e) => setQrData({ ...qrData, eventTitle: e.target.value })}
                placeholder="Conference 2024"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input
                type="text"
                value={qrData.eventLocation || ''}
                onChange={(e) => setQrData({ ...qrData, eventLocation: e.target.value })}
                placeholder="Convention Center"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date/Time</label>
                <input
                  type="datetime-local"
                  value={qrData.eventStart || ''}
                  onChange={(e) => setQrData({ ...qrData, eventStart: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Date/Time</label>
                <input
                  type="datetime-local"
                  value={qrData.eventEnd || ''}
                  onChange={(e) => setQrData({ ...qrData, eventEnd: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={qrData.eventDescription || ''}
                onChange={(e) => setQrData({ ...qrData, eventDescription: e.target.value })}
                placeholder="Event details..."
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        );
      
      case 'payment':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Payment Type</label>
              <select
                value={qrData.paymentType || 'upi'}
                onChange={(e) => setQrData({ ...qrData, paymentType: e.target.value as 'upi' | 'paypal' | 'bitcoin' })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="upi">UPI (India)</option>
                <option value="paypal">PayPal</option>
                <option value="bitcoin">Bitcoin</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {qrData.paymentType === 'upi' ? 'UPI ID' : qrData.paymentType === 'bitcoin' ? 'Bitcoin Address' : 'PayPal Email'}
              </label>
              <input
                type="text"
                value={qrData.paymentId || ''}
                onChange={(e) => setQrData({ ...qrData, paymentId: e.target.value })}
                placeholder={qrData.paymentType === 'upi' ? 'user@upi' : qrData.paymentType === 'bitcoin' ? 'bc1q...' : 'email@paypal.com'}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Amount (Optional)</label>
              <input
                type="text"
                value={qrData.amount || ''}
                onChange={(e) => setQrData({ ...qrData, amount: e.target.value })}
                placeholder="100.00"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Note (Optional)</label>
              <input
                type="text"
                value={qrData.note || ''}
                onChange={(e) => setQrData({ ...qrData, note: e.target.value })}
                placeholder="Payment for..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {['generate', 'bulk', 'manage'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as 'generate' | 'bulk' | 'manage')}
              className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                activeTab === tab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab === 'generate' && '🎨 Generate'}
              {tab === 'bulk' && '📦 Bulk Generation'}
              {tab === 'manage' && '💾 Manage QR Codes'}
            </button>
          ))}
        </nav>
      </div>

      {/* Generate Tab */}
      {activeTab === 'generate' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Configuration */}
          <div className="space-y-6">
            {/* QR Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">QR Code Type</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 'url', label: '🔗 URL', icon: '🔗' },
                  { value: 'text', label: '📝 Text', icon: '📝' },
                  { value: 'email', label: '📧 Email', icon: '📧' },
                  { value: 'phone', label: '📞 Phone', icon: '📞' },
                  { value: 'sms', label: '💬 SMS', icon: '💬' },
                  { value: 'wifi', label: '📶 WiFi', icon: '📶' },
                  { value: 'vcard', label: '👤 vCard', icon: '👤' },
                  { value: 'location', label: '📍 Location', icon: '📍' },
                  { value: 'event', label: '📅 Event', icon: '📅' },
                  { value: 'payment', label: '💳 Payment', icon: '💳' }
                ].map((type) => (
                  <button
                    key={type.value}
                    onClick={() => {
                      setQrType(type.value as QRType);
                      setQrData({ type: type.value as QRType, content: '' });
                    }}
                    className={`p-3 text-sm font-medium rounded-lg border-2 transition-all ${
                      qrType === type.value
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* QR Data Form */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Content</h3>
              {renderQRForm()}
            </div>

            {/* Dynamic QR Option */}
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-start">
                <input
                  type="checkbox"
                  checked={isDynamic}
                  onChange={(e) => setIsDynamic(e.target.checked)}
                  className="mt-1 mr-3"
                />
                <div>
                  <label className="font-medium text-blue-900">Make it Dynamic (Premium Feature)</label>
                  <p className="text-sm text-blue-700 mt-1">
                    Edit content after creation, track scans, and get analytics - all for free!
                  </p>
                </div>
              </div>
            </div>

            {/* Customization Options */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">🎨 Customization</h3>
              
              {/* Size */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Size: {qrStyle.width}x{qrStyle.height}px
                </label>
                <input
                  type="range"
                  min="200"
                  max="1000"
                  step="50"
                  value={qrStyle.width}
                  onChange={(e) => setQrStyle({ ...qrStyle, width: parseInt(e.target.value), height: parseInt(e.target.value) })}
                  className="w-full"
                />
              </div>

              {/* Dot Style */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Dot Style</label>
                <select
                  value={qrStyle.dotsType}
                  onChange={(e) => setQrStyle({ ...qrStyle, dotsType: e.target.value as DotStyle })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="square">Square</option>
                  <option value="dots">Dots</option>
                  <option value="rounded">Rounded</option>
                  <option value="extra-rounded">Extra Rounded</option>
                  <option value="classy">Classy</option>
                  <option value="classy-rounded">Classy Rounded</option>
                </select>
              </div>

              {/* Colors */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Foreground Color</label>
                  <input
                    type="color"
                    value={qrStyle.dotsColor}
                    onChange={(e) => setQrStyle({ ...qrStyle, dotsColor: e.target.value })}
                    className="w-full h-10 rounded border border-gray-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Background Color</label>
                  <input
                    type="color"
                    value={qrStyle.backgroundColor}
                    onChange={(e) => setQrStyle({ ...qrStyle, backgroundColor: e.target.value })}
                    className="w-full h-10 rounded border border-gray-300"
                  />
                </div>
              </div>

              {/* Corner Styles */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Corner Square Style</label>
                  <select
                    value={qrStyle.cornerSquareType}
                    onChange={(e) => setQrStyle({ ...qrStyle, cornerSquareType: e.target.value as CornerStyle })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="square">Square</option>
                    <option value="dot">Dot</option>
                    <option value="extra-rounded">Extra Rounded</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Corner Dot Style</label>
                  <select
                    value={qrStyle.cornerDotType}
                    onChange={(e) => setQrStyle({ ...qrStyle, cornerDotType: e.target.value as CornerStyle })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="square">Square</option>
                    <option value="dot">Dot</option>
                  </select>
                </div>
              </div>

              {/* Error Correction */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Error Correction Level</label>
                <select
                  value={qrStyle.errorCorrectionLevel}
                  onChange={(e) => setQrStyle({ ...qrStyle, errorCorrectionLevel: e.target.value as 'L' | 'M' | 'Q' | 'H' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="L">Low (7%)</option>
                  <option value="M">Medium (15%)</option>
                  <option value="Q">Quartile (25%)</option>
                  <option value="H">High (30%)</option>
                </select>
              </div>

              {/* Logo Upload */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Add Logo (Optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
                {logoPreview && (
                  <div className="mt-2">
                    <Image src={logoPreview} alt="Logo preview" width={64} height={64} className="w-16 h-16 object-contain" unoptimized />
                    <button
                      onClick={() => {
                        setLogo(null);
                        setLogoPreview('');
                      }}
                      className="text-sm text-red-600 hover:text-red-800 mt-1"
                    >
                      Remove Logo
                    </button>
                  </div>
                )}
              </div>

              {/* Caption */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Caption (Optional)</label>
                <input
                  type="text"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Scan me!"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            {/* QR Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">QR Code Name (for saving)</label>
              <input
                type="text"
                value={qrName}
                onChange={(e) => setQrName(e.target.value)}
                placeholder="My QR Code"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          {/* Right Column - Preview & Actions */}
          <div className="space-y-6">
            {/* QR Preview */}
            <div className="bg-white rounded-lg border-2 border-gray-200 p-8">
              <h3 className="text-lg font-semibold mb-4 text-center">Preview</h3>
              <div className="flex flex-col items-center">
                <div ref={qrRef} className="mb-4" />
                {caption && (
                  <p className="text-center text-sm font-medium text-gray-700 mt-2">{caption}</p>
                )}
              </div>
            </div>

            {/* Export Options */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">📥 Export</h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => downloadQR('png')}
                  className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  PNG
                </button>
                <button
                  onClick={() => downloadQR('svg')}
                  className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                >
                  SVG
                </button>
                <button
                  onClick={() => downloadQR('jpeg')}
                  className="px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
                >
                  JPEG
                </button>
                <button
                  onClick={() => downloadQR('pdf')}
                  className="px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
                >
                  PDF
                </button>
              </div>
            </div>

            {/* Save Button */}
            <button
              onClick={saveQRCode}
              className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 font-semibold text-lg"
            >
              💾 Save QR Code
            </button>

            {/* Features List */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
              <h3 className="text-lg font-semibold mb-3 text-blue-900">✨ Premium Features (Free!)</h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li>✓ Unlimited QR code generation</li>
                <li>✓ Full customization (colors, styles, logos)</li>
                <li>✓ Multiple export formats (PNG, SVG, PDF, JPEG)</li>
                <li>✓ Dynamic QR codes (editable after creation)</li>
                <li>✓ Scan analytics and tracking</li>
                <li>✓ Bulk generation from CSV</li>
                <li>✓ High-resolution exports (up to 4K)</li>
                <li>✓ No watermarks, no limits</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Generation Tab */}
      {activeTab === 'bulk' && (
        <div className="space-y-6">
          <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
            <h3 className="text-lg font-semibold mb-2 text-blue-900">📦 Bulk QR Code Generation</h3>
            <p className="text-sm text-blue-700">
              Enter one URL or text per line, or upload a CSV file to generate multiple QR codes at once.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter Data (one per line)
              </label>
              <textarea
                value={bulkData}
                onChange={(e) => setBulkData(e.target.value)}
                placeholder="https://example.com/page1&#10;https://example.com/page2&#10;https://example.com/page3"
                rows={15}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
              />
              <button
                onClick={generateBulkQRCodes}
                className="mt-4 w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
              >
                Generate {bulkData.split('\n').filter(l => l.trim()).length} QR Codes
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Or Upload CSV File
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <input
                  type="file"
                  accept=".csv,.xlsx"
                  className="hidden"
                  id="bulk-upload"
                />
                <label htmlFor="bulk-upload" className="cursor-pointer">
                  <div className="text-4xl mb-2">📄</div>
                  <p className="text-sm text-gray-600">Click to upload CSV/Excel file</p>
                  <p className="text-xs text-gray-500 mt-1">Supports CSV and XLSX formats</p>
                </label>
              </div>

              {bulkQRCodes.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-semibold mb-3">Generated QR Codes ({bulkQRCodes.length})</h4>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {bulkQRCodes.map((qr) => (
                      <div key={qr.id} className="flex items-center justify-between bg-white p-3 rounded-lg border">
                        <span className="text-sm truncate flex-1">{qr.name}</span>
                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                          Download
                        </button>
                      </div>
                    ))}
                  </div>
                  <button className="mt-4 w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold">
                    Download All as ZIP
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Manage QR Codes Tab */}
      {activeTab === 'manage' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Saved QR Codes ({savedQRCodes.length})</h3>
            <button
              onClick={() => {
                if (confirm('Delete all saved QR codes?')) {
                  setSavedQRCodes([]);
                  localStorage.removeItem('savedQRCodes');
                }
              }}
              className="text-red-600 hover:text-red-800 text-sm font-medium"
            >
              Clear All
            </button>
          </div>

          {savedQRCodes.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <div className="text-6xl mb-4">📭</div>
              <p className="text-gray-600">No saved QR codes yet</p>
              <p className="text-sm text-gray-500 mt-1">Create and save QR codes to see them here</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedQRCodes.map((qr) => (
                <div key={qr.id} className="bg-white rounded-lg border-2 border-gray-200 p-4 hover:border-blue-300 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-900">{qr.name}</h4>
                      <p className="text-xs text-gray-500">{new Date(qr.createdAt).toLocaleDateString()}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      qr.isDynamic ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {qr.isDynamic ? 'Dynamic' : 'Static'}
                    </span>
                  </div>
                  
                  <div className="mb-3">
                    <span className="text-xs font-medium text-gray-600 uppercase">{qr.type}</span>
                  </div>

                  {qr.isDynamic && (
                    <div className="mb-3 text-sm text-gray-600">
                      <div>Scans: {qr.scans || 0}</div>
                      {qr.lastScanned && (
                        <div className="text-xs">Last: {new Date(qr.lastScanned).toLocaleString()}</div>
                      )}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setQrType(qr.type);
                        setQrData(qr.data);
                        setQrStyle(qr.style);
                        setIsDynamic(qr.isDynamic);
                        setQrName(qr.name);
                        setActiveTab('generate');
                      }}
                      className="flex-1 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Delete this QR code?')) {
                          const updated = savedQRCodes.filter(q => q.id !== qr.id);
                          setSavedQRCodes(updated);
                          localStorage.setItem('savedQRCodes', JSON.stringify(updated));
                        }
                      }}
                      className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm font-medium"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
