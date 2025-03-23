import { useEffect, useRef, useState } from 'react';

interface WebcamComponentProps {
  onVideoReady: (video: HTMLVideoElement) => void;
  width?: number;
  height?: number;
}

export const WebcamComponent = ({ onVideoReady, width = 640, height = 480 }: WebcamComponentProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (isInitialized) return;
    const enableWebcam = async () => {
      if (videoRef.current) {
        const video = videoRef.current;
        
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { width, height }
          });
          
          video.srcObject = stream;
          video.addEventListener('loadeddata', () => {
            if (video.readyState === 4) {
              // Video is ready to be processed
              onVideoReady(video);
            }
          });
        } catch (error) {
          console.error('Error accessing webcam:', error);
        }
      }
    };

    enableWebcam();
    setIsInitialized(true);
    
    return () => {
      // Cleanup: stop all video tracks when component unmounts
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => {
          track.stop();
          stream.removeTrack(track);
        });
        videoRef.current.srcObject = null;
      }
    };
  }, []);  // Empty dependency array since we manage initialization with state

  return (
    <video 
      ref={videoRef}
      autoPlay
      playsInline
      muted
      width={width}
      height={height}
      style={{ transform: 'scaleX(-1)' }} // Mirror the webcam
    />
  );
};

