import { Thumbnail, VideoDetails } from '../types';

export const extractVideoId = (url: string): string | null => {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
  const match = url.match(regex);
  return match ? match[1] : null;
};

export const getVideoDetails = (videoId: string): VideoDetails => {
  const thumbnails: Thumbnail[] = [
    {
      quality: 'maxres',
      url: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      width: 1280,
      height: 720,
      label: 'Maximum Resolution (HD)'
    },
    {
      quality: 'high',
      url: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      width: 480,
      height: 360,
      label: 'High Quality'
    },
    {
      quality: 'medium',
      url: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
      width: 320,
      height: 180,
      label: 'Medium Quality'
    },
    {
      quality: 'standard',
      url: `https://img.youtube.com/vi/${videoId}/sddefault.jpg`,
      width: 640,
      height: 480,
      label: 'Standard Quality'
    }
  ];

  return {
    id: videoId,
    thumbnails
  };
};

export const downloadImage = async (url: string, filename: string) => {
  try {
    const response = await fetch(url, { mode: 'cors' });
    if (!response.ok) throw new Error('Network response was not ok');
    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = objectUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(objectUrl);
  } catch (error) {
    console.error('Download failed:', error);
    // Fallback: open in new tab if CORS fails (rare for img.youtube.com but possible)
    window.open(url, '_blank');
  }
};

export const cropImage = async (url: string, aspectRatio: number): Promise<string> => {
    try {
        const response = await fetch(url, { mode: 'cors', credentials: 'omit' });
        const blob = await response.blob();
        const imageBitmap = await createImageBitmap(blob);
        
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) throw new Error('Could not get canvas context');

        const srcWidth = imageBitmap.width;
        const srcHeight = imageBitmap.height;
        const srcRatio = srcWidth / srcHeight;

        let drawWidth = srcWidth;
        let drawHeight = srcHeight;
        let startX = 0;
        let startY = 0;

        // Calculate Crop
        if (srcRatio > aspectRatio) {
            // Source is wider than target: Crop width
            drawWidth = srcHeight * aspectRatio;
            startX = (srcWidth - drawWidth) / 2;
        } else {
            // Source is taller than target: Crop height
            drawHeight = srcWidth / aspectRatio;
            startY = (srcHeight - drawHeight) / 2;
        }

        canvas.width = drawWidth;
        canvas.height = drawHeight;

        ctx.drawImage(
            imageBitmap, 
            startX, startY, drawWidth, drawHeight, // Source crop
            0, 0, drawWidth, drawHeight // Destination
        );

        return new Promise((resolve, reject) => {
            canvas.toBlob((blob) => {
                if (blob) {
                    resolve(URL.createObjectURL(blob));
                } else {
                    reject(new Error('Canvas to Blob failed'));
                }
            }, 'image/jpeg', 0.95);
        });

    } catch (error) {
        console.error("Cropping failed", error);
        throw error;
    }
};
