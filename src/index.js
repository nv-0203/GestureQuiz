import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';

// Set the backend to WebGL and wait for it to be ready
tf.setBackend('webgl').then(() => {
  console.log('WebGL backend set successfully');
  
  // Get the root element
  const container = document.getElementById("root");
  const root = createRoot(container);

  // Render the application
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});
