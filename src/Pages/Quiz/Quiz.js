import { CircularProgress, Box } from '@mui/material';
import { useEffect, useState } from 'react';
import Question from '../../components/Question/Question';
import './Quiz.css';

const Quiz = ({ name, questions, score, setScore, setQuestions, modelReady, handposeModel, gestureEstimator }) => {
    const [options, setOptions] = useState([]);
    const [currQues, setCurrQues] = useState(1);

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
