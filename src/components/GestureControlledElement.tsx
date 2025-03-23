import { useState, useEffect } from 'react';
import { DetectedGesture } from '../utils/poseUtils';

interface GestureControlledElementProps {
  gestures: DetectedGesture[];
}

export const GestureControlledElement = ({ gestures }: GestureControlledElementProps) => {
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [color, setColor] = useState('#3f51b5');
  
  // Get the first detected gesture with highest confidence
  const primaryGesture = gestures.length > 0 
    ? gestures.reduce((prev, current) => 
        (current.confidence > prev.confidence) ? current : prev)
    : null;
  
  useEffect(() => {
    // Update position or appearance based on detected gesture
    if (primaryGesture) {
      switch (primaryGesture.name) {
        case 'pointing_right':
          setPosition(prev => ({ ...prev, x: Math.min(90, prev.x + 5) }));
          setColor('#4caf50'); // Green
          break;
        case 'pointing_left':
          setPosition(prev => ({ ...prev, x: Math.max(10, prev.x - 5) }));
          setColor('#2196f3'); // Blue
          break;
        case 'raised_hands':
          setPosition(prev => ({ ...prev, y: Math.max(10, prev.y - 5) }));
          setColor('#ff9800'); // Orange
          break;
        case 't_pose':
          setPosition(prev => ({ ...prev, y: Math.min(90, prev.y + 5) }));
          setColor('#e91e63'); // Pink
          break;
        default:
          // No recognized gesture
          setColor('#3f51b5'); // Default purple
      }
    }
  }, [primaryGesture]);
  
  return (
    <div className="gesture-controlled-container">
      <div className="gesture-indicator">
        {primaryGesture ? (
          <p>Detected: <strong>{primaryGesture.name.replace('_', ' ')}</strong></p>
        ) : (
          <p>No gesture detected</p>
        )}
      </div>
      
      <div className="gesture-playground">
        <div 
          className="controlled-element"
          style={{
            left: `${position.x}%`,
            top: `${position.y}%`,
            backgroundColor: color,
            transition: 'all 0.2s ease-out'
          }}
        />
      </div>
    </div>
  );
};