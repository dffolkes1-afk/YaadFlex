import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload } from 'lucide-react';

export default function UploadTest() {
  const [status, setStatus] = useState<string>('Ready to test upload');
  const [isUploading, setIsUploading] = useState(false);

  const testUpload = async (file: File) => {
    try {
      setIsUploading(true);
      setStatus('Getting upload URL...');

      // Step 1: Get upload URL
      const response = await fetch('/api/objects/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ fileName: file.name })
      });

      if (!response.ok) {
        throw new Error(`Failed to get upload URL: ${response.status}`);
      }

      const { uploadURL } = await response.json();
      setStatus('Got upload URL! Uploading file...');

      // Step 2: Upload file
      const uploadResponse = await fetch(uploadURL, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type
        }
      });

      if (!uploadResponse.ok) {
        throw new Error(`Upload failed: ${uploadResponse.status}`);
      }

      setStatus(`✅ SUCCESS! File "${file.name}" uploaded successfully!`);
      
    } catch (error) {
      console.error('Upload error:', error);
      setStatus(`❌ ERROR: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      testUpload(files[0]);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Upload Test - Simple Version</h1>
      
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <Upload className="h-12 w-12 mx-auto text-gray-400" />
            <div>
              <h3 className="font-semibold mb-2">Simple File Upload Test</h3>
              <p className="text-sm text-gray-600 mb-4">
                This is a basic test to see if uploads work without any fancy features
              </p>
              
              <input
                type="file"
                onChange={handleFileSelect}
                disabled={isUploading}
                accept="image/*,video/*,audio/*"
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <h4 className="font-medium mb-2">Status:</h4>
          <p className={`text-sm ${
            status.includes('ERROR') ? 'text-red-600' : 
            status.includes('SUCCESS') ? 'text-green-600' : 
            'text-gray-600'
          }`}>
            {status}
          </p>
          
          {isUploading && (
            <div className="mt-3">
              <div className="animate-pulse flex space-x-4">
                <div className="rounded-full bg-blue-400 h-2 w-2"></div>
                <div className="rounded-full bg-blue-400 h-2 w-2"></div>
                <div className="rounded-full bg-blue-400 h-2 w-2"></div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}