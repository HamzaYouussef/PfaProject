import React, { useState } from 'react';
import AppLayout from '../components/layout/AppLayout';
import ScanResultDisplay from '../components/scan/ScanResult';
import { useScan } from '../context/ScanContext';
import { ScanResult } from '../types';
import { Cloudinary } from '@cloudinary/url-gen';
import { AdvancedImage } from '@cloudinary/react';
import { fill } from '@cloudinary/url-gen/actions/resize';
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';

// Si besoin, plugins FilePond à enregistrer
// import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
// import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
// registerPlugin(FilePondPluginImagePreview);

const cld = new Cloudinary({
  cloud: {
    cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dxc5curxy',
  },
});

const ScanPage: React.FC = () => {
  const { processImage, isProcessing } = useScan();

  const [files, setFiles] = useState<any[]>([]);
  const [currentResult, setCurrentResult] = useState<ScanResult | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const serverOptions = {
    process: (
      fieldName: string,
      file: File,
      metadata: any,
      load: (fileUrl: string) => void,
      error: (errorText: string) => void,
      progress: (progress: number) => void,
      abort: () => void
    ) => {
      const data = new FormData();
      data.append('file', file);
      data.append('upload_preset', 'pfa_preset');
      data.append('cloud_name', 'dxc5curxy');

      fetch('https://api.cloudinary.com/v1_1/dxc5curxy/image/upload', {
        method: 'POST',
        body: data,
      })
        .then(async (res) => {
          if (!res.ok) throw new Error("Échec de l'upload");

          const result = await res.json();
          if (result && result.secure_url) {
            setImageUrl(result.secure_url);
            setError(null);
            load(result.secure_url);
          } else {
            throw new Error('Réponse Cloudinary invalide');
          }
        })
        .catch((err) => {
          console.error("Erreur lors du téléchargement de l'image:", err);
          setError("Erreur lors du téléchargement de l'image, veuillez réessayer.");
          error("Échec du téléchargement");
          abort();
        });

      return {
        abort: () => {
          abort();
        },
      };
    },
  };

  const handleProcessImage = async () => {
    if (!imageUrl) {
      setError('Veuillez uploader une image avant de la traiter.');
      return;
    }

    try {
      setError(null);
      console.log('Début traitement image avec URL:', imageUrl);
      const result = await processImage(imageUrl);
      console.log('Résultat du traitement:', result);
      setCurrentResult(result);
    } catch (err: any) {
      console.error('Erreur lors du traitement de l\'image:', err);
      setError(err.message || 'Erreur lors du traitement de l\'image.');
    }
  };

  const getPublicIdFromUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      const pathSegments = urlObj.pathname.split('/');
      // le dernier segment est "nomImage.jpg"
      const filename = pathSegments[pathSegments.length - 1];
      // on enlève l'extension
      return filename.split('.')[0];
    } catch {
      return null;
    }
  };

  const publicId = imageUrl ? getPublicIdFromUrl(imageUrl) : null;
  const displayImage = publicId ? cld.image(publicId) : null;

  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">New Scan</h1>
        <p className="mt-1 text-sm text-gray-500">
          Upload a handwritten image to extract text
        </p>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Upload Image</h2>

        <FilePond
          files={files}
          onupdatefiles={setFiles}
          allowMultiple={false}
          server={serverOptions}
          name="file"
          labelIdle='Glissez et déposez vos fichiers ou <span class="filepond--label-action">Parcourir</span>'
        />

        {error && (
          <div className="mt-4 p-4 bg-red-50 rounded-md">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {imageUrl && displayImage && (
          <div className="mt-4 flex justify-center">
            <AdvancedImage
              cldImg={displayImage.resize(fill().width(300).height(300))}
              className="rounded-lg"
            />
          </div>
        )}

        {imageUrl && !currentResult && !isProcessing && (
          <div className="mt-4 flex justify-center">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={handleProcessImage}
            >
              Process Image
            </button>
          </div>
        )}
      </div>

      {(isProcessing || currentResult) && (
        <div className="mt-6">
          {currentResult && (
            <ScanResultDisplay
              result={currentResult}
              isProcessing={isProcessing}
              imageUrl={imageUrl}
            />
          )}

          {isProcessing && !currentResult && (
            <div className="bg-white shadow rounded-lg p-6 flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              <p className="mt-4 text-gray-600">Processing your image...</p>
            </div>
          )}
        </div>
      )}
    </AppLayout>
  );
};

export default ScanPage;
