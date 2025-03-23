import { Keypoint } from '@tensorflow-models/pose-detection';

// Color constants for drawing
const color = 'aqua';
const lineWidth = 2;
const pointRadius = 4;

// MoveNet connects keypoints in this specific pattern to form a skeleton
const connectedKeypoints = [
  ['nose', 'left_eye'], ['nose', 'right_eye'],
  ['left_eye', 'left_ear'], ['right_eye', 'right_ear'],
  ['left_shoulder', 'right_shoulder'], ['left_shoulder', 'left_elbow'],
  ['right_shoulder', 'right_elbow'], ['left_elbow', 'left_wrist'],
  ['right_elbow', 'right_wrist'], ['left_shoulder', 'left_hip'],
  ['right_shoulder', 'right_hip'], ['left_hip', 'right_hip'],
  ['left_hip', 'left_knee'], ['right_hip', 'right_knee'],
  ['left_knee', 'left_ankle'], ['right_knee', 'right_ankle']
];

// Draw the detected keypoints
export const drawKeypoints = (ctx: CanvasRenderingContext2D, keypoints: Keypoint[]): void => {
  keypoints.forEach(keypoint => {
    // Only draw keypoints with a confidence greater than 0.3
    if (keypoint.score && keypoint.score > 0.3) {
      const { x, y } = keypoint;
      
      ctx.beginPath();
      ctx.arc(x, y, pointRadius, 0, 2 * Math.PI);
      ctx.fillStyle = color;
      ctx.fill();
    }
  });
};

// Draw the skeleton connecting keypoints
export const drawSkeleton = (ctx: CanvasRenderingContext2D, keypoints: Keypoint[]): void => {
  // Create a map of keypoints by name for easier lookup
  const keypointMap: Record<string, Keypoint> = {};
  keypoints.forEach(keypoint => {
    if (keypoint.name) {
      keypointMap[keypoint.name] = keypoint;
    }
  });

  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  
  connectedKeypoints.forEach(([name1, name2]) => {
    const keypoint1 = keypointMap[name1];
    const keypoint2 = keypointMap[name2];
    
    // Only draw if both keypoints exist and have good confidence
    if (
      keypoint1?.score && keypoint1.score > 0.3 && 
      keypoint2?.score && keypoint2.score > 0.3
    ) {
      ctx.beginPath();
      ctx.moveTo(keypoint1.x, keypoint1.y);
      ctx.lineTo(keypoint2.x, keypoint2.y);
      ctx.stroke();
    }
  });
};

