# Gesture Quiz

Gesture Quiz is an interactive web application that allows users to participate in quizzes using hand gestures for input. This project leverages TensorFlow.js and Google's Mediapipe to recognize and interpret hand gestures, making the quiz experience both fun and engaging.

## Demo

Check out the live demo: [Gesture Quiz](https://gesturequiz.netlify.app/)

## Features

- **Hand Gesture Recognition**: Utilizes TensorFlow.js to import the HandPose model, powered by Google's Mediapipe, for accurate hand tracking and gesture recognition.
- **Gesture Estimation**: Integrated with Fingerpose to recognize specific hand gestures with over 90% confidence.
- **WebGL Backend**: Ensures efficient and high-performance model inference for a smooth user experience.
- **Responsive UI**: Built with ReactJS and styled using Material UI for a modern and responsive interface.
- **Trivia API Integration**: Fetches quiz questions from the Trivia API to keep the content fresh and varied.

## Technologies Used

- **TensorFlow.js**: For importing and running the HandPose model in the browser.
- **Mediapipe**: Google's open-source solution for high-fidelity hand tracking.
- **Fingerpose**: A library for gesture estimation based on detected hand landmarks.
- **ReactJS**: For building the user interface.
- **Material UI**: For UI components and styling.
- **WebGL**: For optimized model inference.
- **Trivia API**: For fetching quiz questions.

