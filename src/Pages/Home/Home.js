import { Button, MenuItem, TextField } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import Categories from '../../Data/Categories';
import './Home.css';

const Home = ({ name, setName, fetchQuestions, setScore }) => {
    const [category, setCategory] = useState("");
    const [difficulty, setDifficulty] = useState("");
    const [numQuestions, setNumQuestions] = useState("");
    const [error, setError] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = () => {
        if (!category || !difficulty || !name || !numQuestions) {
            setError(true);
            return;
        } else {
            setScore(0);
            setError(false);
            fetchQuestions(category, difficulty, numQuestions);
            navigate('/quiz');
        }
    };

    const handleNumQuestionsChange = (e) => {
        const value = e.target.value;
        if (value === '' || (value >= 1 && value <= 50)) {
            setNumQuestions(value);
        }
    };

    return (
        <div className="content">
            <div className="settings">
                <span style={{ fontSize: 30 }}>Quiz Settings</span>
                <div className="settings__select">
                    {error && <ErrorMessage>Please Fill all the feilds</ErrorMessage>}
                    <TextField
                        style={{ marginBottom: 25 }}
                        label="Enter Your Name"
                        variant="outlined"
                        onChange={(e) => setName(e.target.value)}
                    />
                    <TextField
                        select
                        label="Select Category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        variant="outlined"
                        style={{ marginBottom: 20 }}
                    >
                        {Categories.map((cat) => (
                            <MenuItem key={cat.category} value={cat.value}>
                                {cat.category}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        label="Number of Questions"
                        type="number"
                        inputProps={{ min: 1, max: 50 }}
                        value={numQuestions}
                        onChange={handleNumQuestionsChange}
                        variant="outlined"
                        style={{ marginBottom: 20 }}
                    />
                    <TextField
                        select
                        label="Select Difficulty"
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value)}
                        variant="outlined"
                        style={{ marginBottom: 20 }}
                    >
                        <MenuItem key="Easy" value="easy">
                            Easy
                        </MenuItem>
                        <MenuItem key="Medium" value="medium">
                            Medium
                        </MenuItem>
                        <MenuItem key="Hard" value="hard">
                            Hard
                        </MenuItem>
                    </TextField>
                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        onClick={handleSubmit}
                    >
                        Start Quiz
                    </Button>
                </div>
            </div>
            <div className="instructions">
                <h1>Welcome to the Gesture Quiz!</h1>

                <h2>How to Use:</h2>
                <ul>
                    <li><strong>Start the Quiz:</strong>
                        <ul>
                            <li>Fill in the relevant details</li>
                            <li>Click on the "Start Quiz" button to begin the quiz.</li>
                        </ul>
                    </li>
                    <li><strong>Answering Questions:</strong>
                        <ul>
                            <li>For each question, you will see four options displayed on the screen.</li>
                            <li>Use your webcam to show your answer by making one of the following gestures:</li>
                            <ul>
                                <li><strong>1 finger (index only)</strong>: Selects option 1.</li>
                                <li><strong>2 fingers (index and middle)</strong>: Selects option 2.</li>
                                <li><strong>3 fingers (index, middle, and ring)</strong>: Selects option 3.</li>
                                <li><strong>4 fingers (all except thumb)</strong>: Selects option 4.</li>
                            </ul>
                            <li>Hold the gesture steady for <strong>1 second</strong> to register your answer.</li>
                        </ul>
                    </li>
                    <li><strong>Navigating the Quiz:</strong>
                        <ul>
                            <li>After selecting your answer, the system will automatically move to the next question.</li>
                            <li>If you wish to quit the quiz at any time, click the "Quit" button.</li>
                            <li>At the end of the quiz, you will be taken to the results page to see your score.</li>
                        </ul>
                    </li>
                </ul>

                <p>Enjoy the quiz and good luck!</p>
            </div>
        </div>
    );
};

export default Home;
