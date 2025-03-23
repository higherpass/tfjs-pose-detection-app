import { useState } from 'react';
import { PoseDetector } from './components/PoseDetector';
import './App.css';

function App() {
  const [showDetector, setShowDetector] = useState(false);

  const handleStart = () => {
    setShowDetector(true);
  };

  const handleStop = () => {
    setShowDetector(false);
  };

  return (
    <div className="app">
      <header>
        <h1>TensorFlow.js Pose Detection</h1>
        <p>Real-time gesture control using TensorFlow.js and MoveNet</p>
      </header>

      <main>
        {!showDetector ? (
          <div className="start-section">
            <p>
              This application uses your webcam to detect body poses and gestures in real-time.
              All processing happens directly in your browser - no data is sent to any server.
            </p>
            
            <div className="instructions">
              <h2>Supported Gestures:</h2>
              <ul>
                <li>
                  <strong>Raise both hands</strong> - Move the ball upward
                </li>
                <li>
                  <strong>T-pose</strong> (arms extended horizontally) - Move the ball downward
                </li>
                <li>
                  <strong>Point right</strong> (right arm extended) - Move the ball to the right
                </li>
                <li>
                  <strong>Point left</strong> (left arm extended) - Move the ball to the left
                </li>
              </ul>
            </div>
            
            <button onClick={handleStart}>
              Start Pose Detection
            </button>
          </div>
        ) : (
          <div>
            <PoseDetector onStop={handleStop} />
          </div>
        )}
      </main>

      <footer>
        <p>
          Built with React, TypeScript, and TensorFlow.js
        </p>
      </footer>
    </div>
  );
}

export default App;
