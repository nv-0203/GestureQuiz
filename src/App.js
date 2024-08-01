import axios from "axios";
import { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";
import Home from "./Pages/Home/Home";
import Quiz from "./Pages/Quiz/Quiz";
import Result from "./Pages/Result/Result";

import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';
import * as handpose from '@tensorflow-models/handpose';
import { GestureEstimator } from 'fingerpose';
import { One, Two, Three, Four } from './utilities/gestures';
import { SampleImage } from './utilities/SampleImage';

function App() {
  const [questions, setQuestions] = useState();
  const [name, setName] = useState();
  const [score, setScore] = useState(0);
  const [modelReady, setModelReady] = useState(false);
  const [handposeModel, setHandposeModel] = useState(null);
  const [gestureEstimator, setGestureEstimator] = useState(null);

  const fetchQuestions = async (category = "", difficulty = "", numQuestions = "") => {
    const { data } = await axios.get(
      `https://opentdb.com/api.php?${numQuestions && `amount=${numQuestions}`
      }${category && `&category=${category}`
      }${difficulty && `&difficulty=${difficulty}`}&type=multiple`
    );

    setQuestions(data.results);
  };

  useEffect(() => {
    const loadModel = async () => {
      // Set the backend to WebGL and wait for it to be ready
      await tf.setBackend('webgl');
      await tf.ready();
      console.log('WebGL backend set successfully');

      // Initialize finger gesture recognizer with known gestures
      const knownGestures = [One, Two, Three, Four];
      const estimator = new GestureEstimator(knownGestures);
      setGestureEstimator(estimator);
      console.log('Initialized FingerPose with ' + knownGestures.length + ' gestures');

      // Load handpose model
      console.log('Loading handpose model...');
      const model = await handpose.load();
      setHandposeModel(model);
      console.log('Model loaded');

      // Make one prediction on a sample image to warm up the model
      console.log('Warming up model');
      const sample = await SampleImage.create();
      await model.estimateHands(sample, false);
      console.log('Model is hot!');

      // Set model ready state
      setModelReady(true);
    };

    loadModel();
  }, []);

  return (
    <BrowserRouter>
      <div className="app">
        <Header />
        <Routes>
          <Route path="/" element={<Home name={name} setName={setName} fetchQuestions={fetchQuestions} setScore={setScore} />} />
          <Route path="/quiz" element={<Quiz name={name} questions={questions} score={score} setScore={setScore} setQuestions={setQuestions} modelReady={modelReady} handposeModel={handposeModel} gestureEstimator={gestureEstimator} />} />
          <Route path="/result" element={<Result name={name} score={score} />} />
        </Routes>
      </div>
      <Footer />
    </BrowserRouter>
  );
}

export default App;

