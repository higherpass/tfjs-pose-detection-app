import { Keypoint } from '@tensorflow-models/pose-detection';

// Interface for a detected gesture
export interface DetectedGesture {
  name: string;
  confidence: number;
}

// Helper function to calculate the angle between three points
export const calculateAngle = (
  firstPoint: Keypoint,
  midPoint: Keypoint,
  lastPoint: Keypoint
): number => {
  if (!firstPoint || !midPoint || !lastPoint) return 0;
  
  // Calculate vectors from midpoint to first and last points
  const v1 = {
    x: firstPoint.x - midPoint.x,
    y: firstPoint.y - midPoint.y
  };
  
  const v2 = {
    x: lastPoint.x - midPoint.x,
    y: lastPoint.y - midPoint.y
  };
  
  // Calculate dot product
  const dotProduct = v1.x * v2.x + v1.y * v2.y;
  
  // Calculate magnitudes
  const v1Magnitude = Math.sqrt(v1.x * v1.x + v1.y * v1.y);
  const v2Magnitude = Math.sqrt(v2.x * v2.x + v2.y * v2.y);
  
  // Calculate angle in radians
  const angleRad = Math.acos(dotProduct / (v1Magnitude * v2Magnitude));
  
  // Convert to degrees
  return (angleRad * 180) / Math.PI;
};

// Helper to get keypoints by name from the keypoints array
export const getKeypointByName = (
  keypoints: Keypoint[],
  name: string
): Keypoint | undefined => {
  return keypoints.find(keypoint => keypoint.name === name);
};

// Function to check if a point is above another point
export const isAbove = (point1: Keypoint, point2: Keypoint): boolean => {
  return point1.y < point2.y;
};

// Function to check if a point is to the left of another point
export const isLeftOf = (point1: Keypoint, point2: Keypoint): boolean => {
  return point1.x < point2.x;
};

// Check if a keypoint has sufficient confidence score
export const hasConfidence = (keypoint: Keypoint | undefined, threshold = 0.3): boolean => {
  return !!keypoint && !!keypoint.score && keypoint.score > threshold;
};

// Function to check multiple keypoints have sufficient confidence
export const allHaveConfidence = (keypoints: (Keypoint | undefined)[], threshold = 0.3): boolean => {
  return keypoints.every(keypoint => hasConfidence(keypoint, threshold));
};

