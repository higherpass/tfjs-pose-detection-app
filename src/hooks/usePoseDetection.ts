import { useState, useEffect, useRef } from 'react';
import * as poseDetection from '@tensorflow-models/pose-detection';
import * as tf from '@tensorflow/tfjs';

export const usePoseDetection = () => {
  const [detector, setDetector] = useState<poseDetection.PoseDetector | null>(null);
  const [keypoints, setKeypoints] = useState<poseDetection.Keypoint[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const requestRef = useRef<number | null>(null);

  // Initialize the pose detector
  useEffect(() => {
    const initializeDetector = async () => {
      try {
        console.log('Initializing TensorFlow...');
        await tf.ready();
        console.log('TensorFlow ready');
        
        // Create detector using MoveNet model
        const detectorConfig = {
          modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
          enableSmoothing: true
        };
        
        console.log('Creating pose detector...');
        const detector = await poseDetection.createDetector(
          poseDetection.SupportedModels.MoveNet, 
          detectorConfig
        );
        console.log('Pose detector created, setting state');
        
        setDetector(detector);
        setLoading(false);
      } catch (e) {
        console.error('Error initializing detector:', e);
        setError(`Failed to initialize pose detector: ${e instanceof Error ? e.message : String(e)}`);
        setLoading(false);
      }
    };

    initializeDetector();
    
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

  // Function to register video element
  const registerVideo = (video: HTMLVideoElement) => {
    console.log('Registering video element');
    videoRef.current = video;
    setIsActive(true);
  };

  // Function to stop detection and camera
  const stopDetection = () => {
    console.log('Stopping detection and camera');
    setIsActive(false);
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
      requestRef.current = null;
    }
    setKeypoints(null);

    // Stop the camera stream
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => {
        track.stop();
      });
      videoRef.current.srcObject = null;
    }
    videoRef.current = null;
  };

  // Start detection when both detector and video are available
  useEffect(() => {
    console.log('Checking detection prerequisites:', {
      hasDetector: !!detector,
      hasVideo: !!videoRef.current,
      isActive
    });

    if (detector && videoRef.current && isActive) {
      console.log('Both detector and video ready, starting detection');
      detectPose();
    }
  }, [detector, isActive]);

  // Main pose detection function using requestAnimationFrame for smooth updates
  const detectPose = async () => {
    if (!isActive) {
      console.log('Detection stopped');
      return;
    }

    if (detector && videoRef.current && videoRef.current.readyState === 4) {
      try {
        const poses = await detector.estimatePoses(
          videoRef.current, 
          { flipHorizontal: false }
        );
        
        if (poses.length > 0) {
          console.log('Pose detected:', {
            numKeypoints: poses[0].keypoints.length,
            sampleKeypoint: poses[0].keypoints[0]
          });
          setKeypoints(poses[0].keypoints);
        }
      } catch (e) {
        console.error('Error during pose detection:', e);
      }
    }
    
    if (isActive) {
      requestRef.current = requestAnimationFrame(detectPose);
    }
  };

  return {
    loading,
    error,
    keypoints,
    registerVideo,
    stopDetection
  };
};

