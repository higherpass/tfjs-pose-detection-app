

import { Keypoint } from '@tensorflow-models/pose-detection';
import { 
  calculateAngle, 
  getKeypointByName, 
  isAbove, 
  isLeftOf, 
  hasConfidence,
  allHaveConfidence,
  DetectedGesture
} from './poseUtils';

// Detect if arms are raised (both hands above shoulders)
export const detectRaisedHands = (keypoints: Keypoint[]): DetectedGesture | null => {
  const leftShoulder = getKeypointByName(keypoints, 'left_shoulder');
  const rightShoulder = getKeypointByName(keypoints, 'right_shoulder');
  const leftWrist = getKeypointByName(keypoints, 'left_wrist');
  const rightWrist = getKeypointByName(keypoints, 'right_wrist');
  
  if (
    allHaveConfidence([leftShoulder, rightShoulder, leftWrist, rightWrist])
  ) {
    const leftHandRaised = isAbove(leftWrist!, leftShoulder!);
    const rightHandRaised = isAbove(rightWrist!, rightShoulder!);
    
    if (leftHandRaised && rightHandRaised) {
      // Calculate confidence as average of relevant keypoint scores
      const confidence = [leftShoulder, rightShoulder, leftWrist, rightWrist]
        .reduce((sum, keypoint) => sum + (keypoint?.score || 0), 0) / 4;
      
      return {
        name: 'raised_hands',
        confidence
      };
    }
  }
  
  return null;
};

// Detect T-pose (arms extended horizontally)
export const detectTPose = (keypoints: Keypoint[]): DetectedGesture | null => {
  const leftShoulder = getKeypointByName(keypoints, 'left_shoulder');
  const rightShoulder = getKeypointByName(keypoints, 'right_shoulder');
  const leftElbow = getKeypointByName(keypoints, 'left_elbow');
  const rightElbow = getKeypointByName(keypoints, 'right_elbow');
  const leftWrist = getKeypointByName(keypoints, 'left_wrist');
  const rightWrist = getKeypointByName(keypoints, 'right_wrist');
  
  if (!allHaveConfidence([leftShoulder, rightShoulder, leftElbow, rightElbow, leftWrist, rightWrist], 0.2)) {
    return null;
  }
  
  // Check if arms are extended horizontally
  const leftArmAngle = calculateAngle(leftShoulder!, leftElbow!, leftWrist!);
  const rightArmAngle = calculateAngle(rightShoulder!, rightElbow!, rightWrist!);
  
  // Arms should be relatively straight (angle close to 180 degrees)
  const armsExtended = leftArmAngle > 160 && rightArmAngle > 160;
  
  // Check if wrists are roughly at shoulder height
  const leftWristAtShoulderHeight = Math.abs(leftWrist!.y - leftShoulder!.y) < 30;
  const rightWristAtShoulderHeight = Math.abs(rightWrist!.y - rightShoulder!.y) < 30;
  
  if (armsExtended && leftWristAtShoulderHeight && rightWristAtShoulderHeight) {
    const confidence = [leftShoulder, rightShoulder, leftElbow, rightElbow, leftWrist, rightWrist]
      .reduce((sum, keypoint) => sum + (keypoint?.score || 0), 0) / 6;
    
    return {
      name: 't_pose',
      confidence
    };
  }
  
  return null;
};

// Detect pointing right (right arm extended to the right)
export const detectPointingRight = (keypoints: Keypoint[]): DetectedGesture | null => {
  const leftShoulder = getKeypointByName(keypoints, 'left_shoulder');
  const rightShoulder = getKeypointByName(keypoints, 'right_shoulder');
  const leftElbow = getKeypointByName(keypoints, 'left_elbow');
  const rightElbow = getKeypointByName(keypoints, 'right_elbow');
  const leftWrist = getKeypointByName(keypoints, 'left_wrist');
  const rightWrist = getKeypointByName(keypoints, 'right_wrist');
  
  if (!allHaveConfidence([rightShoulder, rightElbow, rightWrist], 0.25)) {
    return null;
  }
  
  const rightArmAngle = calculateAngle(rightShoulder!, rightElbow!, rightWrist!);
  const isRightArmExtended = rightArmAngle > 150;
  // Since webcam is mirrored, "pointing right" means wrist is to the left of elbow
  const isPointingRight = isLeftOf(rightWrist!, rightElbow!);
  
  // Check that left arm is not extended
  const leftArmAngle = calculateAngle(leftShoulder!, leftElbow!, leftWrist!);
  const isLeftArmRelaxed = leftArmAngle < 120;
  
  console.log('Right pointing detection (mirrored):', {
    rightArmAngle,
    isRightArmExtended,
    isPointingRight,
    isLeftArmRelaxed,
    rightElbowX: rightElbow!.x,
    rightWristX: rightWrist!.x
  });
  
  if (isRightArmExtended && isPointingRight && isLeftArmRelaxed) {
    const confidence = [rightShoulder, rightElbow, rightWrist]
      .reduce((sum, keypoint) => sum + (keypoint?.score || 0), 0) / 3;
    
    return {
      name: 'pointing_right',
      confidence
    };
  }
  
  return null;
};

// Detect pointing left (left arm extended to the left)
export const detectPointingLeft = (keypoints: Keypoint[]): DetectedGesture | null => {
  const leftShoulder = getKeypointByName(keypoints, 'left_shoulder');
  const rightShoulder = getKeypointByName(keypoints, 'right_shoulder');
  const leftElbow = getKeypointByName(keypoints, 'left_elbow');
  const rightElbow = getKeypointByName(keypoints, 'right_elbow');
  const leftWrist = getKeypointByName(keypoints, 'left_wrist');
  const rightWrist = getKeypointByName(keypoints, 'right_wrist');
  
  if (!allHaveConfidence([leftShoulder, leftElbow, leftWrist], 0.25)) {
    return null;
  }
  
  const leftArmAngle = calculateAngle(leftShoulder!, leftElbow!, leftWrist!);
  const isLeftArmExtended = leftArmAngle > 150;
  // Since webcam is mirrored, "pointing left" means wrist is to the right of elbow
  const isPointingLeft = isLeftOf(leftElbow!, leftWrist!);
  
  // Check that right arm is not extended
  const rightArmAngle = calculateAngle(rightShoulder!, rightElbow!, rightWrist!);
  const isRightArmRelaxed = rightArmAngle < 120;
  
  console.log('Left pointing detection (mirrored):', {
    leftArmAngle,
    isLeftArmExtended,
    isPointingLeft,
    isRightArmRelaxed,
    leftElbowX: leftElbow!.x,
    leftWristX: leftWrist!.x
  });
  
  if (isLeftArmExtended && isPointingLeft && isRightArmRelaxed) {
    const confidence = [leftShoulder, leftElbow, leftWrist]
      .reduce((sum, keypoint) => sum + (keypoint?.score || 0), 0) / 3;
    
    return {
      name: 'pointing_left',
      confidence
    };
  }
  
  return null;
};

// Main function to detect all gestures
export const detectGestures = (keypoints: Keypoint[] | null): DetectedGesture[] => {
  if (!keypoints || keypoints.length === 0) {
    return [];
  }
  
  const gestureDetectors = [
    detectRaisedHands,
    detectTPose,
    detectPointingRight,
    detectPointingLeft
  ];
  
  const detectedGestures = gestureDetectors
    .map(detector => detector(keypoints))
    .filter((gesture): gesture is DetectedGesture => gesture !== null);
  
  return detectedGestures;
};
