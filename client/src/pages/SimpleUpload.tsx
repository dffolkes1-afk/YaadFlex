import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function SimpleUpload() {
  const [status, setStatus] = useState<string>('Ready');
  const [isLoading, setIsLoading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Prevent large files that crash browser
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setStatus('❌ File too large (max 5MB)');
      return;
    }

    try {
      setIsLoading(true);
      setStatus('Uploading...');

      // Get upload URL
      const response = await fetch('/api/objects/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName: file.name })
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const { uploadURL } = await response.json();

      // Upload file
      const uploadResponse = await fetch(uploadURL, {
        method: 'PUT',
        body: file
      });

      if (!uploadResponse.ok) {
        throw new Error(`Upload failed: ${uploadResponse.status}`);
      }

      setStatus(`✅ Success! ${file.name} uploaded`);
    } catch (error: any) {
      setStatus(`❌ Error: ${error?.message || 'Upload failed'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Simple Upload Test</h1>
      
      <div className="space-y-4">
        <input
          type="file"
          onChange={handleUpload}
          disabled={isLoading}
          accept="image/*,video/*,audio/*"
          className="w-full"
          data-testid="file-input"
        />
        
        <div className="p-3 bg-gray-100 rounded text-sm">
          Status: {status}
        </div>
        
        {isLoading && (
          <div className="text-center">
            <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
          </div>
        )}
      </div>
    </div>
  );
}