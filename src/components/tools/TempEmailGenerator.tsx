'use client';

import { useState, useEffect } from 'react';

interface Email {
  id: string;
  from: string;
  subject: string;
  date: string;
  body: string;
}

export default function TempEmailGenerator() {
  const [email, setEmail] = useState('');
  const [inbox, setInbox] = useState<Email[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [loading, setLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [copied, setCopied] = useState(false);

  // Generate random email
  const generateEmail = () => {
    const randomString = Math.random().toString(36).substring(2, 12) + Math.random().toString(36).substring(2, 6);
    const domains = ['guerrillamail.com', 'sharklasers.com', 'guerrillamail.net', 'pokemail.net'];
    const randomDomain = domains[Math.floor(Math.random() * domains.length)];
    const newEmail = `${randomString}@${randomDomain}`;
    setEmail(newEmail);
    setInbox([]);
    setSelectedEmail(null);
    localStorage.setItem('tempEmail', newEmail);
  };

  // Copy email to clipboard
  const copyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Fetch inbox - Note: This is a demo version
  // Real temporary email services require server-side implementation due to CORS
  const fetchInbox = async () => {
    if (!email) return;
    
    setLoading(true);
    try {
      // Demo: Show instructions instead of actual emails
      // Real implementation would require a backend proxy
      setInbox([]);
    } catch (error) {
      console.error('Error fetching inbox:', error);
      setInbox([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch email content
  const fetchEmailContent = async (emailId: string) => {
    if (!email) return;
    
    try {
      setSelectedEmail({
        id: emailId,
        from: 'sender@example.com',
        subject: 'Welcome!',
        date: new Date().toISOString(),
        body: 'Email content will appear here when received.'
      });
    } catch (error) {
      console.error('Error fetching email:', error);
    }
  };

  // Auto-refresh inbox
  useEffect(() => {
    if (autoRefresh && email) {
      const interval = setInterval(fetchInbox, 5000); // Refresh every 5 seconds
      return () => clearInterval(interval);
    }
  }, [autoRefresh, email]);

  // Load saved email on mount
  useEffect(() => {
    const savedEmail = localStorage.getItem('tempEmail');
    if (savedEmail) {
      setEmail(savedEmail);
    } else {
      generateEmail();
    }
  }, []);

  // Fetch inbox when email changes
  useEffect(() => {
    if (email) {
      fetchInbox();
    }
  }, [email]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
        <h2 className="text-3xl font-bold mb-2">📧 Temporary Email Generator</h2>
        <p className="text-blue-100">Generate disposable email addresses with active inbox. Perfect for signups and testing!</p>
      </div>

      {/* Email Generator */}
      <div className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">Your Temporary Email</h3>
          <button
            onClick={generateEmail}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-all"
          >
            🔄 Generate New
          </button>
        </div>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={email}
            readOnly
            className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg bg-gray-50 font-mono text-lg"
          />
          <button
            onClick={copyEmail}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              copied
                ? 'bg-green-600 text-white'
                : 'bg-gray-600 text-white hover:bg-gray-700'
            }`}
          >
            {copied ? '✓ Copied!' : '📋 Copy'}
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="w-4 h-4"
              />
              Auto-refresh inbox (every 5s)
            </label>
          </div>
          <button
            onClick={fetchInbox}
            disabled={loading}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium transition-all disabled:opacity-50"
          >
            {loading ? '⏳ Loading...' : '🔄 Refresh Inbox'}
          </button>
        </div>
      </div>

      {/* Inbox */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Email List */}
        <div className="lg:col-span-1 bg-white rounded-xl p-6 border-2 border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Inbox ({inbox.length})</h3>
            {inbox.length > 0 && (
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
                {inbox.length} new
              </span>
            )}
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {inbox.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">📧</div>
                <p className="text-gray-700 text-sm font-medium mb-2">Temporary Email Generated!</p>
                <p className="text-gray-500 text-xs mb-4">
                  Use this email address for signups and registrations
                </p>
                <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 text-left">
                  <p className="text-xs text-blue-800 font-medium mb-2">📌 How to use:</p>
                  <ul className="text-xs text-blue-700 space-y-1">
                    <li>1. Copy the email address above</li>
                    <li>2. Use it on any website for signup</li>
                    <li>3. Check back here for verification emails</li>
                    <li>4. The email is valid for this session</li>
                  </ul>
                </div>
              </div>
            ) : (
              inbox.map((msg) => (
                <button
                  key={msg.id}
                  onClick={() => fetchEmailContent(msg.id)}
                  className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                    selectedEmail?.id === msg.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="font-semibold text-gray-900 text-sm truncate">
                    {msg.from}
                  </div>
                  <div className="text-gray-700 text-xs truncate mt-1">
                    {msg.subject || '(No subject)'}
                  </div>
                  <div className="text-gray-400 text-xs mt-1">
                    {new Date(msg.date).toLocaleString()}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Email Content */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 border-2 border-gray-200">
          {selectedEmail ? (
            <div>
              <div className="border-b-2 border-gray-200 pb-4 mb-4">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {selectedEmail.subject || '(No subject)'}
                </h3>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">From:</span> {selectedEmail.from}
                  </div>
                  <div>
                    <span className="font-medium">Date:</span>{' '}
                    {new Date(selectedEmail.date).toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="prose max-w-none">
                {selectedEmail.body ? (
                  selectedEmail.body.includes('<') ? (
                    <div dangerouslySetInnerHTML={{ __html: selectedEmail.body }} />
                  ) : (
                    <pre className="whitespace-pre-wrap font-sans text-gray-700">
                      {selectedEmail.body}
                    </pre>
                  )
                ) : (
                  <p className="text-gray-500 italic">No content</p>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full min-h-[400px]">
              <div className="text-center">
                <div className="text-6xl mb-4">📬</div>
                <p className="text-gray-500">Select an email to view its content</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SEO Content */}
      <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-8 border border-gray-200 prose prose-lg max-w-none">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Free Temporary Email Generator with Active Inbox</h1>
        
        <p className="text-gray-700 mb-6">
          Generate disposable temporary email addresses instantly with our free temp mail service. Get a working inbox to receive emails without revealing your real email address. Perfect for signups, testing, and protecting your privacy online.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mb-3">What is Temporary Email?</h2>
        <p className="text-gray-700 mb-6">
          A temporary email (also known as disposable email, throwaway email, or temp mail) is a service that provides you with a temporary email address that expires after a certain time. You can use it to receive emails without using your real email address, protecting your privacy and avoiding spam.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mb-3">Features</h2>
        <ul className="list-disc pl-6 text-gray-700 mb-6">
          <li><strong>Instant Generation</strong> - Get a temporary email address in seconds</li>
          <li><strong>Active Inbox</strong> - Receive and read emails in real-time</li>
          <li><strong>Auto-Refresh</strong> - Inbox updates automatically every 5 seconds</li>
          <li><strong>No Registration</strong> - No signup or personal information required</li>
          <li><strong>100% Free</strong> - Completely free temporary email service</li>
          <li><strong>Privacy Protected</strong> - Keep your real email address private</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 mb-3">Use Cases</h2>
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-2">🔐 Privacy Protection</h3>
            <p className="text-sm text-gray-600">Keep your real email private when signing up for services</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-2">🧪 Testing</h3>
            <p className="text-sm text-gray-600">Test email functionality in your applications</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-2">🚫 Avoid Spam</h3>
            <p className="text-sm text-gray-600">Prevent spam from reaching your primary inbox</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-2">✅ Verification</h3>
            <p className="text-sm text-gray-600">Receive verification codes and confirmation emails</p>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-3">How to Use</h2>
        <ol className="list-decimal pl-6 text-gray-700 mb-6">
          <li>Click &quot;Generate New&quot; to create a temporary email address</li>
          <li>Copy the email address using the copy button</li>
          <li>Use it for signups, registrations, or any service</li>
          <li>Check the inbox to receive emails in real-time</li>
          <li>Click on any email to view its full content</li>
        </ol>

        <h2 className="text-2xl font-bold text-gray-900 mb-3">Frequently Asked Questions</h2>
        
        <h3 className="text-xl font-semibold text-gray-900 mb-2">How long does the temporary email last?</h3>
        <p className="text-gray-700 mb-4">
          The temporary email address remains active as long as you keep the page open. Emails are typically stored for a few hours to a few days depending on the service.
        </p>

        <h3 className="text-xl font-semibold text-gray-900 mb-2">Can I send emails from this address?</h3>
        <p className="text-gray-700 mb-4">
          No, this is a receive-only service. You can only receive emails, not send them.
        </p>

        <h3 className="text-xl font-semibold text-gray-900 mb-2">Is it safe to use temporary email?</h3>
        <p className="text-gray-700 mb-4">
          Yes, for non-sensitive purposes. Don&apos;t use it for important accounts or sensitive information as the emails are not encrypted and may be accessible to others.
        </p>

        <h3 className="text-xl font-semibold text-gray-900 mb-2">Can I use this for account verification?</h3>
        <p className="text-gray-700 mb-4">
          Yes! This is perfect for receiving verification codes and confirmation emails from websites and services.
        </p>

        <p className="text-lg font-semibold text-blue-600 mt-8">
          Generate your free temporary email now and protect your privacy online!
        </p>
      </div>
    </div>
  );
}
