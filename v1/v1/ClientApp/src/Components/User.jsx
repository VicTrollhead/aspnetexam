import React, { useState } from 'react';
import '../ComponentsCSS/UserStyle.css';
import '../ComponentsCSS/AuthButtons.css';
import '../ComponentsCSS/QuizStyles.css';
import QuizForm from './QuizForm';

const User = ({ user, onLogout }) => {
    const [showChangePasswordForm, setShowChangePasswordForm] = useState(false);
    const [showChangeDateForm, setShowChangeDateForm] = useState(false);
    const [showStartQuiz, setShowStartQuiz] = useState(false);
    const [showQuiz, setShowQuiz] = useState(false);
    const [showTop10Memu, setShowTop10Memu] = useState(false);
    const [showSelectedRezQuizTop10, setShowSelectedRezQuizTop10] = useState(false);
    const [showRezQuiz, setShowRezQuiz] = useState(false);
    const [showSelectedRezQuiz, setShowSelectedRezQuiz] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [newDate, setNewDate] = useState('');
    const [currentPassword, setCurrentPassword] = useState(user.password);
    const [currentDate, setCurrentDate] = useState(user.dob);
    const [quizQuestions, setQuizQuestions] = useState([]); 
    const [nameQuiz, setNameQuiz] = useState('');  
    
    const [existingResults, setExistingResults] = useState([]);

    const date = new Date(currentDate);
    const formattedDate = date.toLocaleDateString();

    const fetchQuizQuestions = async (nameQuiz) => {
        try {
            const form = {
                title: nameQuiz
            };
            const token = localStorage.getItem('token');
            const response = await fetch('/api/testing/selectTest', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(form)
            });

            if (!response.ok) {
                throw new Error('Ошибка при регистрации.');
            }

            const responseData = await response.json();

            console.log(responseData);

            setQuizQuestions(responseData);
            setShowQuiz(true);
        } catch (error) {
            console.error('Ошибка при запросе данных:', error);
        }
    };

    const fetchTop = async (nameQuiz) => {
        try {
            const form = {
                title: nameQuiz
            };
            const token = localStorage.getItem('token');
            const response = await fetch('/api/testing/top10statistic', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(form)
            });

            if (!response.ok) {
                throw new Error('Ошибка.');
            }

            const responseData = await response.json();

            console.log(responseData);

            setExistingResults(responseData);

        } catch (error) {
            console.error('Ошибка при запросе данных:', error);
        }
    };

    const fetchQuizResults = async (userName, quizName) => {
        try {
            const form = {
                userName: userName,
                quizName: quizName
            };
            const token = localStorage.getItem('token');
            
            const response = await fetch('/api/testing/mystatistic', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(form)
            });

            if (!response.ok) {
                throw new Error('Ошибка при получении результатов викторин.');
            }

            const responseData = await response.json();

            console.log(responseData);  

            setExistingResults(responseData);
            
        } catch (error) {
            console.error('Ошибка при запросе данных:', error);
            throw error; 
        }
    };

    const shuffleArray = (array) => {
        const shuffledArray = [...array];
        for (let i = shuffledArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
        }
        return shuffledArray;
    };
    
    const handleItemClick = async (item) => {
        if (item === 'changePassword') {
            setShowChangePasswordForm(true);
            setShowChangeDateForm(false);
            setShowStartQuiz(false); 
            setShowTop10Memu(false);
        } else if (item === 'changeDate') {
            setShowChangeDateForm(true);
            setShowChangePasswordForm(false);
            setShowStartQuiz(false); 
            setShowTop10Memu(false);
        } else if (item === 'startQuiz') {
            setShowChangeDateForm(false);
            setShowChangePasswordForm(false);
            setShowStartQuiz(true); 
            setShowTop10Memu(false);
        } else if (item === 'top10') {
            setShowChangeDateForm(false);
            setShowChangePasswordForm(false);
            setShowStartQuiz(false);
            setShowTop10Memu(true);
        } else if (item === 'simpleQuestions') {
            
            setShowQuiz(false);
            setNameQuiz(item);
            await fetchQuizQuestions(item);

        } else if (item === 'binarySystem') {
            setShowQuiz(false);
            setNameQuiz(item);
            await fetchQuizQuestions(item);

        } else if (item === 'chemistry') {
            setShowQuiz(false);
            setNameQuiz(item);
            await fetchQuizQuestions(item);

        } else if (item === 'myQuizResults') {
            setShowRezQuiz(true);           
        } else if (item === 'mySimpleQuestionsRez') {
            setShowSelectedRezQuiz(true);
            setNameQuiz('SimpleQuestions');
            fetchQuizResults(user.login , 'SimpleQuestions');            

        } else if (item === 'myBinarySystemRez') {
            setShowSelectedRezQuiz(true);
            setNameQuiz('BinarySystem');
            fetchQuizResults(user.login, 'BinarySystem');

        } else if (item === 'myChemistryRez') {
            setShowSelectedRezQuiz(true);
            setNameQuiz('Chemistry');
            fetchQuizResults(user.login, 'Chemistry');

        } else if (item === 'top10SimpleQuestionsRez') {
            setShowSelectedRezQuizTop10(true);
            setNameQuiz('SimpleQuestions');
            fetchTop('SimpleQuestions');
        } else if (item === 'top10BinarySystemRez') {
            setShowSelectedRezQuizTop10(true);
            setNameQuiz('BinarySystem');
            fetchTop('BinarySystem');
        } else if (item === 'top10ChemistryRez') {
            setShowSelectedRezQuizTop10(true);
            setNameQuiz('Chemistry');
            fetchTop('Chemistry');
        } else if (item === 'back') { 
            setShowSelectedRezQuiz(false);          
            setShowStartQuiz(false);
            setShowRezQuiz(false);
            setShowQuiz(false);
            setShowSelectedRezQuizTop10(false);
            setShowTop10Memu(false);
        } else {            
        }
    };

    const handlePasswordFormSubmit = async (event) => {
        event.preventDefault();

        if (newPassword.trim() === '') {           
            console.error('Новый пароль не может быть пустым.');
            return;
        }
        if (currentPassword.trim() === '') {
            console.error('Текущий пароль не может быть пустым.');
            return;
        }

        const token = localStorage.getItem('token');

        const response = await fetch('/api/changingdata/password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                login: user.login,
                currentPassword: currentPassword,
                newPassword: newPassword
            })
        });

        if (!response.ok) {
            throw new Error('Ошибка при изменении пароля');
        }

        const responseData = await response.json();
        console.log(responseData);

        setCurrentPassword(newPassword);
        setNewPassword('');
        setShowChangePasswordForm(false);
    };

    const handleDateFormSubmit = async (event) => {
        event.preventDefault();

        if (newDate.trim() === '') {            
            console.error('Новая дата не может быть пустой.');
            return;
        }

        const token = localStorage.getItem('token');

        const response = await fetch('/api/changingdata/dob', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                login: user.login,
                Dob: newDate
            })
        });

        if (!response.ok) {
            throw new Error('Ошибка при изменении пароля');
        }

        setCurrentDate(newDate);
        setNewDate('');
        setShowChangeDateForm(false);
    };

    return (
        <div className="ColorWhite">

            <div className="user-info">
                <h2>User: {user.login} | Date: {formattedDate}</h2>                
            </div>

            <div className="side-menu">
                <h2>User: {user.login}</h2>
                <button onClick={() => handleItemClick('startQuiz')}>Старт викторины</button>

                {showStartQuiz && (
                    <div className="side-menu">
                        <h2>Категории:</h2>
                        <button onClick={() => handleItemClick('simpleQuestions')}>Общие вопросы</button>
                        <button onClick={() => handleItemClick('chemistry')}>Химия</button>
                        <button onClick={() => handleItemClick('binarySystem')}>Бинарная система</button>                     
                        <button onClick={() => handleItemClick('back')}>Назад</button>
                    </div>
                )}

                <button onClick={() => handleItemClick('myQuizResults')}>Результаты моих викторин</button>

                {showRezQuiz && (
                    <div className="side-menu">
                        <h2>Мои Результаты:</h2>
                        <button onClick={() => handleItemClick('mySimpleQuestionsRez')}>Общие вопросы</button>
                        <button onClick={() => handleItemClick('myChemistryRez')}>Химия</button>
                        <button onClick={() => handleItemClick('myBinarySystemRez')}>Бинарная система</button>                       
                        <button onClick={() => handleItemClick('back')}>Назад</button>
                    </div>
                )}

                <button onClick={() => handleItemClick('top10')}>Топ-10 по викторине</button>
                
                {showTop10Memu && (
                    <div className="side-menu">
                        <h2>Топ 10:</h2>
                        <button onClick={() => handleItemClick('top10SimpleQuestionsRez')}>Общие вопросы</button>
                        <button onClick={() => handleItemClick('top10ChemistryRez')}>Химия</button>
                        <button onClick={() => handleItemClick('top10BinarySystemRez')}>Бинарная система</button>                     
                        <button onClick={() => handleItemClick('back')}>Назад</button>
                    </div>
                )}

                <button onClick={() => handleItemClick('changePassword')}>Изменить пароль</button>
                <button onClick={() => handleItemClick('changeDate')}>Изменить дату</button>
                <button onClick={onLogout}>Выход</button>
            </div>            

            {showChangePasswordForm && (
                <form className="container p-4" onSubmit={handlePasswordFormSubmit}>
                    <div className="mb-4 d-flex flex-column align-items-center">
                        <label htmlFor="newPassword" className="form-label">Новый пароль:</label>
                        <input
                            type="password"
                            className="form-control w-100"
                            id="newPassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                    </div>
                    <div className="mb-4 d-flex flex-column align-items-center">
                        <label htmlFor="currentPassword" className="form-label">Текущий пароль:</label>
                        <input
                            type="password"
                            className="form-control w-100"
                            id="currentPassword"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Сохранить пароль</button>
                </form>
            )}

            {showChangeDateForm && (
                <form className="container p-4" onSubmit={handleDateFormSubmit}>
                    <div className="mb-4 d-flex flex-column align-items-center">
                        <label htmlFor="newDate" className="form-label">Новая дата:</label>
                        <input
                            type="date"
                            className="form-control w-100"
                            id="newDate"
                            value={newDate}
                            onChange={(e) => setNewDate(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Сохранить дату</button>
                </form>
            )}

            {showQuiz && (
                <>                    
                    <QuizForm questions={quizQuestions} nameQuiz={nameQuiz} nameUser = {user.login}/>
                </>
            )}

            {showSelectedRezQuiz && (
                <div className="quiz-container">
                    <h2>Результаты викторины "{nameQuiz}"</h2>
                    <ul>
                        {existingResults.map((result, index) => (
                            
                                <li key={index}>                                
                                    <p>Пользователь: {result.userName}</p>
                                    <p>Название теста: {result.testTitle}</p>                               
                                    <p>Количество правильных ответов: {result.countCorrectAnswers}</p>   
                                    <p>Дата: {result.dateTime}</p>                                 
                                </li>                            
                        ))}
                    </ul>                    
                </div>
            )}

            {showSelectedRezQuizTop10 && (
                <div className="quiz-container">
                    <h2>Топ 10 викторины "{nameQuiz}"</h2>
                    <ul>
                        {existingResults.map((result, index) => (

                            <li key={index}>
                                <p>Пользователь: {result.userName}</p>
                                <p>Название теста: {result.testTitle}</p>
                                <p>Количество правильных ответов: {result.countCorrectAnswers}</p>
                                <p>Дата: {result.dateTime}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default User;