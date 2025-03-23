import { useEffect, useRef } from 'react';
import { Keypoint } from '@tensorflow-models/pose-detection';
import { drawKeypoints, drawSkeleton } from '../utils/drawUtils';

interface CanvasProps {
  keypoints: Keypoint[] | null;
  width: number;
  height: number;
}

export const Canvas = ({ keypoints, width, height }: CanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current && keypoints) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, width, height);
        // Canvas is mirrored like the video
        ctx.save();
        ctx.scale(-1, 1);
        ctx.translate(-width, 0);
        
        // Draw the detected keypoints and skeleton
        drawKeypoints(ctx, keypoints);
        drawSkeleton(ctx, keypoints);
        
        ctx.restore();
      }
    }
  }, [keypoints, width, height]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{
        position: 'absolute',
        top: 0,
        left: 0
      }}
    />
  );
};

