import React, { useState } from 'react';
import '../ComponentsCSS/QuizStyles.css';

const QuizForm = ({ questions, nameQuiz, nameUser }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState({});
    const [correctAnswers, setCorrectAnswers] = useState(null);

    const handleCheckboxChange = (option) => {
        setUserAnswers(prevState => {
            const questionKey = questions[currentQuestionIndex].key;
            const updatedAnswers = { ...prevState };
            if (prevState[questionKey]) {
                
                updatedAnswers[questionKey] = prevState[questionKey].includes(option)
                    ? prevState[questionKey].filter(answer => answer !== option)
                    : [...prevState[questionKey], option];
            } else {
                
                updatedAnswers[questionKey] = [option];
            }
            return updatedAnswers;
        });
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            
            saveUserResult();
            setCurrentQuestionIndex(null)
        }
    };

    const saveUserResult = async () => {
        const userResult = {
            userName: nameUser,
            quizName: nameQuiz,
            answers: userAnswers
        };
        
        const token = localStorage.getItem('token');
        fetch('api/testing/result', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(userResult),
        })
            .then(response => {
                if (response.ok) {                    
                    return response.json();
                } else {                   
                    throw new Error('Ошибка при сохранении результатов пользователя: ' + response.statusText);
                }
            })
            .then(data => {   

                setCorrectAnswers(data);
            })
            .catch(error => {                
                console.error('Ошибка при отправке запроса:', error);
            });
    };

    if (currentQuestionIndex !== null) {
        const question = questions[currentQuestionIndex];

        return (
            <div className='quiz-container'>
                <h3>Вопрос:</h3>
                <p>{question.key}</p>
                <ul>
                    {question.options.map((option, index) => (
                        <li key={index}>
                            <label>
                                <input
                                    type="checkbox"
                                    value={option}
                                    checked={userAnswers[question.key] && userAnswers[question.key].includes(option)}
                                    onChange={() => handleCheckboxChange(option)}
                                />
                                {option}
                            </label>
                        </li>
                    ))}
                </ul>
                <button onClick={handleNextQuestion}>Следующий вопрос</button>
            </div>
        );
    } else {
        return (
            <div className='quiz-result'>
                <p>Количество правильных ответов: {correctAnswers}</p>
            </div>
        );
    }
};

export default QuizForm;