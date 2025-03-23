import { useState } from 'react';
import { WebcamComponent } from './WebcamComponent';
import { Canvas } from './Canvas';
import { GestureControlledElement } from './GestureControlledElement';
import { usePoseDetection } from '../hooks/usePoseDetection';
import { useGestureDetection } from '../hooks/useGestureDetection';

interface PoseDetectorProps {
  onStop: () => void;
}

export const PoseDetector = ({ onStop }: PoseDetectorProps) => {
  const [dimensions] = useState({ width: 640, height: 480 });
  const { loading, error, keypoints, registerVideo, stopDetection } = usePoseDetection();
  const { gestures } = useGestureDetection(keypoints);

  const handleStop = () => {
    stopDetection();
    onStop();
  };

  return (
    <div className="pose-detector">
      {loading && <div className="loading">Loading pose detection model...</div>}
      {error && <div className="error">{error}</div>}
      
      <div className="webcam-container" style={{ position: 'relative', width: dimensions.width, height: dimensions.height }}>
        <WebcamComponent 
          onVideoReady={registerVideo}
          width={dimensions.width}
          height={dimensions.height}
        />
        
        {keypoints && (
          <Canvas 
            keypoints={keypoints}
            width={dimensions.width}
            height={dimensions.height}
          />
        )}
      </div>
      
      <div className="controls">
        <button onClick={handleStop} className="stop-button">
          Stop Detection
        </button>
      </div>
      
      {keypoints && (
        <GestureControlledElement gestures={gestures} />
      )}
      
      <div className="detection-info">
        <div className="gesture-list">
          <h3>Detected Gestures</h3>
          {gestures.length > 0 ? (
            <ul>
              {gestures.map((gesture, index) => (
                <li key={index}>
                  {gesture.name.replace('_', ' ')} 
                  (confidence: {gesture.confidence.toFixed(2)})
                </li>
              ))}
            </ul>
          ) : (
            <p>No gestures detected</p>
          )}
        </div>
        
        <div className="pose-data">
          <h3>Detected Pose Keypoints</h3>
          <pre>{JSON.stringify(keypoints?.slice(0, 3), null, 2)}...</pre>
        </div>
      </div>
    </div>
  );
};
