import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  Upload, Music, Video, Image, FileAudio, X, 
  Play, Pause, Volume2, Camera
} from 'lucide-react';

interface MediaFile {
  id: string;
  file: File;
  type: 'image' | 'video' | 'audio';
  url: string;
  localUrl?: string;
  thumbnail?: string;
  duration?: number;
  uploadError?: boolean;
}

interface MediaUploaderProps {
  onMediaSelect: (media: MediaFile[]) => void;
  maxFiles?: number;
  acceptedTypes?: string[];
  showPreview?: boolean;
}

export function MediaUploader({ 
  onMediaSelect, 
  maxFiles = 5, 
  acceptedTypes = ['image/*', 'video/*', 'audio/*'],
  showPreview = true 
}: MediaUploaderProps) {
  const [selectedMedia, setSelectedMedia] = useState<MediaFile[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const getFileType = (file: File): 'image' | 'video' | 'audio' => {
    if (file.type.startsWith('image/')) return 'image';
    if (file.type.startsWith('video/')) return 'video';
    if (file.type.startsWith('audio/')) return 'audio';
    return 'image'; // fallback
  };

  const uploadFileToStorage = async (file: File): Promise<string> => {
    try {
      // Memory optimization: limit concurrent uploads
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        throw new Error('File too large for current memory allocation');
      }

      // Get upload URL from backend
      const response = await fetch('/api/objects/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ fileName: file.name })
      });

      if (!response.ok) {
        throw new Error('Failed to get upload URL');
      }

      const { uploadURL } = await response.json();

      // Upload with streaming to reduce memory usage
      const uploadResponse = await fetch(uploadURL, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type
        }
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload file');
      }

      // Return the object storage URL
      return uploadURL.split('?')[0]; // Remove query params
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  };

  const handleFileSelect = async (files: FileList) => {
    setIsUploading(true);
    setUploadProgress(0);
    
    const newMedia: MediaFile[] = [];
    const totalFiles = Math.min(files.length, maxFiles - selectedMedia.length);
    
    for (let i = 0; i < totalFiles; i++) {
      const file = files[i];
      const type = getFileType(file);
      const localUrl = URL.createObjectURL(file);
      
      // Check file size to prevent crashes (max 50MB)
      if (file.size > 50 * 1024 * 1024) {
        console.warn(`File ${file.name} too large (${(file.size / 1024 / 1024).toFixed(1)}MB), skipping`);
        continue;
      }
      
      try {
        // Upload file to object storage
        const storageUrl = await uploadFileToStorage(file);
        
        const mediaFile: MediaFile = {
          id: `${Date.now()}-${i}`,
          file,
          type,
          url: storageUrl, // Use storage URL instead of local URL
          localUrl // Keep local URL for preview
        };

        // Skip heavy processing for performance - only basic metadata
        newMedia.push(mediaFile);
        
        // Update progress
        const progress = ((i + 1) / totalFiles) * 100;
        setUploadProgress(progress);
        
      } catch (error) {
        console.error(`Failed to upload ${file.name}:`, error);
        // Still add to newMedia with local URL as fallback
        newMedia.push({
          id: `${Date.now()}-${i}`,
          file,
          type,
          url: localUrl,
          localUrl,
          uploadError: true
        });
      }
    }

    setIsUploading(false);
    setUploadProgress(100);
    
    const updatedMedia = [...selectedMedia, ...newMedia];
    setSelectedMedia(updatedMedia);
    onMediaSelect(updatedMedia);
  };

  const getMediaDuration = (file: File): Promise<number> => {
    return new Promise((resolve, reject) => {
      const element = file.type.startsWith('video/') 
        ? document.createElement('video')
        : document.createElement('audio');
      
      element.preload = 'metadata';
      element.onloadedmetadata = () => {
        URL.revokeObjectURL(element.src);
        resolve(element.duration);
      };
      element.onerror = () => reject(new Error('Failed to load media'));
      element.src = URL.createObjectURL(file);
    });
  };

  const generateVideoThumbnail = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      video.onloadedmetadata = () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        video.currentTime = Math.min(2, video.duration / 2); // Capture at 2s or halfway
      };
      
      video.onseeked = () => {
        if (ctx) {
          ctx.drawImage(video, 0, 0);
          const thumbnail = canvas.toDataURL('image/jpeg', 0.8);
          URL.revokeObjectURL(video.src);
          resolve(thumbnail);
        } else {
          reject(new Error('Could not create canvas context'));
        }
      };
      
      video.onerror = () => reject(new Error('Failed to load video'));
      video.src = URL.createObjectURL(file);
    });
  };

  const removeMedia = (id: string) => {
    const updatedMedia = selectedMedia.filter(media => media.id !== id);
    setSelectedMedia(updatedMedia);
    onMediaSelect(updatedMedia);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getMediaIcon = (type: string) => {
    switch (type) {
      case 'image': return <Image className="h-5 w-5" />;
      case 'video': return <Video className="h-5 w-5" />;
      case 'audio': return <Music className="h-5 w-5" />;
      default: return <Upload className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <Card 
        className={`border-2 border-dashed transition-colors cursor-pointer ${
          isDragging 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => {
          if (fileInputRef.current) {
            fileInputRef.current.click();
          }
        }}
      >
        <CardContent className="p-8 text-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Upload className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">Upload Media Like TikTok!</h3>
              <p className="text-gray-500 text-sm mb-2">
                Drag & drop images, videos, or music files
              </p>
              <p className="text-xs text-gray-400">
                Supports: Images, Videos (MP4, MOV), Audio (MP3, WAV, M4A)
              </p>
            </div>
          </div>
          
          <div className="flex justify-center gap-2 mt-4">
            <Button variant="outline" size="sm" className="gap-2">
              <Camera className="h-4 w-4" />
              Camera
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Video className="h-4 w-4" />
              Record Video
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <FileAudio className="h-4 w-4" />
              Record Audio
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={acceptedTypes.join(',')}
        onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
        className="hidden"
      />

      {/* Upload Progress */}
      {isUploading && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Uploading...</span>
              <span className="text-sm text-gray-500">{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} />
          </CardContent>
        </Card>
      )}

      {/* Media Preview */}
      {showPreview && selectedMedia.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium">Selected Media ({selectedMedia.length})</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {selectedMedia.map((media) => (
              <Card key={media.id} className="overflow-hidden">
                <CardContent className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                      {media.type === 'image' && (
                        <img 
                          src={media.localUrl || media.url} 
                          alt="Preview" 
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      )}
                      {media.type === 'video' && (
                        <div className="relative">
                          {media.thumbnail ? (
                            <img 
                              src={media.thumbnail} 
                              alt="Video thumbnail" 
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                          ) : (
                            <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                              <Video className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Play className="h-4 w-4 text-white drop-shadow-lg" />
                          </div>
                        </div>
                      )}
                      {media.type === 'audio' && (
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                          <Music className="h-6 w-6 text-white" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {getMediaIcon(media.type)}
                        <span className="text-sm font-medium truncate">
                          {media.file.name}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 space-y-1">
                        <div>
                          {(media.file.size / (1024 * 1024)).toFixed(1)} MB
                        </div>
                        {media.duration && (
                          <div>{formatDuration(media.duration)}</div>
                        )}
                      </div>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeMedia(media.id)}
                      className="text-red-500 hover:text-red-700 h-8 w-8 p-0"
                      data-testid={`remove-media-${media.id}`}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}