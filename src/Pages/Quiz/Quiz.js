import { CircularProgress, Box } from '@mui/material';
import { useEffect, useState } from 'react';
import Question from '../../components/Question/Question';
import './Quiz.css';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';
import * as handpose from '@tensorflow-models/handpose';
import { GestureEstimator } from 'fingerpose';
import { One, Two, Three, Four } from '../../utilities/gestures';
import { SampleImage } from '../../utilities/SampleImage';

const Quiz = ({ name, questions, score, setScore, setQuestions }) => {
    const [options, setOptions] = useState([]);
    const [currQues, setCurrQues] = useState(1);
    const [modelReady, setModelReady] = useState(false);
    const [handposeModel, setHandposeModel] = useState(null);
    const [gestureEstimator, setGestureEstimator] = useState(null);

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

    useEffect(() => {
        if (questions && questions.length > 0) {
            const shuffledOptions = handleShuffle([
                questions[currQues - 1]?.correct_answer,
                ...questions[currQues - 1]?.incorrect_answers,
            ]);
            setOptions(shuffledOptions);
        } else {
            console.log('Questions not properly initialized yet.');
        }
    }, [currQues, questions]);

    const handleShuffle = (options) => {
        return options.sort(() => Math.random() - 0.5);
    };

    return (
        <div className="quiz">
            <span className="subtitle">Welcome, {name}</span>

            {questions && modelReady ? (
                <>
                    <div className="quizInfo">
                        <span>Category: {questions[currQues - 1].category}</span>
                        <span>Difficulty: {questions[currQues - 1].difficulty}</span>
                        <span>Number of Questions : {questions.length}</span>
                        <span>Score : {score}</span>
                    </div>
                    <Question
                        currQues={currQues}
                        setCurrQues={setCurrQues}
                        questions={questions}
                        options={options}
                        correct={questions[currQues - 1]?.correct_answer}
                        score={score}
                        setScore={setScore}
                        setQuestions={setQuestions}
                        handposeModel={handposeModel}
                        gestureEstimator={gestureEstimator}
                    />
                </>
            ) : (
                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    marginTop={20}
                >
                    <div className="loadingSpinner">
                        <CircularProgress color="inherit" size={150} thickness={1} />
                    </div>
                    <div className="loadingMessage">
                        <h3> HandPose Model is Loading...</h3>
                        <h4> This will take a few moments, thank you for your patience. </h4>
                    </div>
                </Box>
            )}
        </div>
    );
};

export default Quiz;
