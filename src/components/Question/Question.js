import { Button } from '@mui/material';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Question.css';
import Webcam from 'react-webcam';

const Question = ({
    currQues,
    setCurrQues,
    questions,
    options,
    correct,
    setScore,
    score,
    setQuestions,
    handposeModel,
    gestureEstimator,
}) => {
    const [selected, setSelected] = useState();
    const [isWebcamReady, setIsWebcamReady] = useState(false);
    const [timeLeft, setTimeLeft] = useState(15);
    const navigate = useNavigate();
    const webcamRef = useRef(null);
    const timerRef = useRef(null);
    const gestureDetectionRef = useRef(null);

    const handleSelect = (idx) => {
        const correct_idx = options.indexOf(correct);

        if (selected === idx && selected === correct_idx) return 'select';
        else if (selected === idx && selected !== correct_idx) return 'wrong';
        else if (idx === correct_idx) return 'select';
    };

    const handleCheck = (i) => {
        setSelected(i);

        const correct_idx = options.indexOf(correct);

        if (i === correct_idx) setScore(score + 1);
    };

    const handleNext = () => {
        clearInterval(timerRef.current);

        if (currQues === questions.length) {
            navigate('/result');
        } else {
            setTimeLeft(15);
            setCurrQues(currQues + 1);
            setSelected(undefined);
        }
    };

    const handleQuit = () => {
        clearInterval(timerRef.current);
        if (gestureDetectionRef.current) {
            clearTimeout(gestureDetectionRef.current);
        }
        setScore(0);
        setCurrQues(1);
        setQuestions();
        navigate('/');
    };

    async function predictGesture(sourceElement, minimumScore) {
        try {
            const predictions = await handposeModel.estimateHands(sourceElement, false);
            if (predictions.length > 0) {
                const gestureEstimations = gestureEstimator.estimate(predictions[0].landmarks, minimumScore);
                if (gestureEstimations.gestures.length > 0) {
                    const gestureResult = gestureEstimations.gestures.reduce((p, c) => (p.confidence > c.confidence ? p : c));
                    return gestureResult.name;
                }
            }
        } catch (error) {
            console.error('Error in predictGesture:', error);
        }
        return '';
    }

    function detectPlayerGesture(requiredDuration) {
        let lastGesture = '';
        let gestureDuration = 0;
        let lastTimestamp = Date.now();

        const predictNonblocking = () => {
            if (!isWebcamReady) return;

            gestureDetectionRef.current = setTimeout(() => {
                const currentTimestamp = Date.now();
                const deltaTime = currentTimestamp - lastTimestamp;
                lastTimestamp = currentTimestamp;

                if (webcamRef.current && webcamRef.current.video) {
                    predictGesture(webcamRef.current.video, 9).then((playerGesture) => {
                        if (playerGesture !== '') {
                            if (playerGesture === lastGesture) {
                                gestureDuration += deltaTime;
                            } else {
                                lastGesture = playerGesture;
                                gestureDuration = 0;
                            }
                        } else {
                            lastGesture = '';
                            gestureDuration = 0;
                        }

                        console.log(playerGesture);

                        if (gestureDuration >= requiredDuration) {
                            const idx = getIndex(playerGesture);
                            handleCheck(idx);
                            if (gestureDetectionRef.current) {
                                clearTimeout(gestureDetectionRef.current);
                            }
                            setTimeout(() => {
                                handleNext();
                            }, 2000);
                        } else {
                            predictNonblocking();
                        }
                    });
                } else {
                    predictNonblocking();
                }
            }, 100);
        };

        predictNonblocking();
    }

    function getIndex(gesture) {
        switch (gesture) {
            case 'one':
                return 0;
            case 'two':
                return 1;
            case 'three':
                return 2;
            case 'four':
                return 3;
            default:
                return -1;
        }
    }

    useEffect(() => {
        if (isWebcamReady) {
            detectPlayerGesture(1000);
        }

        return () => {
            if (gestureDetectionRef.current) {
                clearTimeout(gestureDetectionRef.current);
            }
        };
    }, [options, isWebcamReady]);

    useEffect(() => {
        timerRef.current = setInterval(() => {
            setTimeLeft((prevTime) => {
                if (prevTime <= 1) {
                    clearInterval(timerRef.current);
                    if (gestureDetectionRef.current) {
                        clearTimeout(gestureDetectionRef.current);
                    }
                    setSelected(-1);
                    setTimeout(() => {
                        handleNext();
                    }, 2000);
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);

        return () => {
            clearInterval(timerRef.current);
            if (gestureDetectionRef.current) {
                clearTimeout(gestureDetectionRef.current);
            }
        };
    }, [currQues]);

    return (
        <div className="main-container">
            <div className="question">
                <h1>Question {currQues} :</h1>
                <div className="timer">Time left: {timeLeft} seconds</div>
                <div className="singleQuestion">
                    <h2>{questions[currQues - 1].question}</h2>
                    <div className="options">
                        {options &&
                            options.map((option, index) => (
                                <div
                                    className={`singleOption  ${selected !== undefined ? handleSelect(index) : ''}`}
                                    key={index}
                                >
                                    {`${index + 1}) ${option}`}
                                </div>
                            ))}
                    </div>
                    <div className="controls">
                        <Button
                            variant="contained"
                            size="large"
                            style={{ width: 185, backgroundColor: 'red', color: 'white' }}
                            onClick={() => handleQuit()}
                        >
                            Quit
                        </Button>
                    </div>
                </div>
            </div>
            <div className="webcam-section">
                <Webcam ref={webcamRef} onUserMedia={() => setIsWebcamReady(true)} />
            </div>
        </div>
    );
};

export default Question;
