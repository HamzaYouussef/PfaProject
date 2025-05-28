import React, { useState, useRef } from 'react';
import { Camera, Upload, Image as ImageIcon } from 'lucide-react';
import Button from '../ui/Button';

interface ImageUploaderProps {
  onImageSelected: (file: File) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelected }) => {
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  
  const handleFileChange = (files: FileList | null) => {
    if (files && files.length > 0) {
      const file = files[0];
      
      // Check if it's an image
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      // Create a preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      
      // Call the callback
      onImageSelected(file);
    }
  };
  
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files);
    }
  };

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      
      setShowCamera(true);
    } catch (err) {
      console.error('Error accessing camera:', err);
      alert('Unable to access camera. Please check permissions.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setShowCamera(false);
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
            const url = URL.createObjectURL(blob);
            setPreviewUrl(url);
            onImageSelected(file);
            stopCamera();
          }
        }, 'image/jpeg');
      }
    }
  };

  return (
    <div className="mb-6">
  {/* Zone d’upload */}
  {!previewUrl && !showCamera && (
    <div
      className={`
        border-2 border-dashed rounded-lg p-6 text-center
        ${dragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'}
        transition-colors
      `}
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
    >
      <div className="space-y-2 sm:space-y-3">
        <ImageIcon className="mx-auto h-10 w-10 text-gray-400 sm:h-12 sm:w-12" />
        <div className="flex flex-col sm:flex-row justify-center text-sm text-gray-600 space-y-1 sm:space-y-0 sm:space-x-1">
          <label
            htmlFor="file-upload"
            className="relative cursor-pointer font-medium text-indigo-600 hover:text-indigo-500"
          >
            <span>Upload a file</span>
            <input
              id="file-upload"
              name="file-upload"
              type="file"
              className="sr-only"
              accept="image/*"
              ref={fileInputRef}
              onChange={(e) => handleFileChange(e.target.files)}
            />
          </label>
          <p className="text-center sm:text-left">or drag and drop</p>
        </div>
        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
      </div>

      <div className="mt-4 flex flex-col sm:flex-row justify-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          icon={<Camera className="h-4 w-4" />}
          onClick={startCamera}
        >
          Take Photo
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          icon={<Upload className="h-4 w-4" />}
          onClick={() => fileInputRef.current?.click()}
        >
          Select File
        </Button>
      </div>
    </div>
  )}

  {/* Caméra */}
  {showCamera && (
    <div className="relative w-full aspect-video sm:aspect-[4/3] overflow-hidden rounded-lg">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full h-full object-cover"
      />
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 px-2">
        <Button
          onClick={capturePhoto}
          variant="primary"
          icon={<Camera className="h-4 w-4" />}
        >
          Capture
        </Button>
        <Button
          onClick={stopCamera}
          variant="outline"
        >
          Cancel
        </Button>
      </div>
    </div>
  )}

  {/* Aperçu de l'image */}
  {previewUrl && (
    <div className="mt-4">
      <img
        src={previewUrl}
        alt="Preview"
        className="max-h-96 max-w-full mx-auto rounded-lg object-contain"
      />
      <div className="mt-4 flex justify-center">
        <Button
          variant="outline"
          onClick={() => {
            setPreviewUrl(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
          }}
        >
          Remove
        </Button>
      </div>
    </div>
  )}
</div>

  );
};

export default ImageUploader;