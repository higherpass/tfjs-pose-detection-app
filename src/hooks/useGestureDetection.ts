import { useState, useEffect } from 'react';
import { Keypoint } from '@tensorflow-models/pose-detection';
import { detectGestures, DetectedGesture } from '../utils/gestureDetection';

export const useGestureDetection = (keypoints: Keypoint[] | null) => {
  const [gestures, setGestures] = useState<DetectedGesture[]>([]);
  
  useEffect(() => {
    if (keypoints) {
      // Detect gestures based on the latest keypoints
      const detectedGestures = detectGestures(keypoints);
      setGestures(detectedGestures);
    } else {
      setGestures([]);
    }
  }, [keypoints]);
  
  return { gestures };
};