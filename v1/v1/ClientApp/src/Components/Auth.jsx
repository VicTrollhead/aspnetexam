import React, { useState } from 'react';
import '../ComponentsCSS/AuthButtons.css';
import User from './User';

const AuthButtons = () => {
    const [showRegistrationForm, setShowRegistrationForm] = useState(false);
    const [showLoginForm, setShowLoginForm] = useState(false);
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [dob, setDob] = useState('');  
    const [registrationMessage, setRegistrationMessage] = useState('');
    const [loggedInUser, setLoggedInUser] = useState(null);    

    const handleLogout = () => {
        setLoggedInUser(null);
    };

    const handleRegisterClick = () => {
        setShowRegistrationForm(true);
        setShowLoginForm(false);
    };

    const handleLoginClick = () => {
        setShowLoginForm(true);
        setShowRegistrationForm(false);
    };

    const handleCancelClick = () => {
        setShowRegistrationForm(false);
        setShowLoginForm(false);
        setRegistrationMessage('');
    };

    const handleRegisterFormSubmit = async (event) => {
        event.preventDefault();

        const form = {
            login: login,
            password: password,
            dateOfBirth: dob
        };

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(form)
            });

            if (!response.ok) {
                throw new Error('Ошибка при регистрации.');
            }

            const responseData = await response.json();
            setRegistrationMessage(responseData.respon);
            setLogin('');
            setPassword('');
            setDob('');

        } catch (error) {
            console.error('Ошибка при обработке запроса:', error);
            setRegistrationMessage('Ошибка при регистрации.');
        }
    };    

    const handleLoginFormSubmit = async (event) => {
        event.preventDefault();

        if (!login || !password) {
            setRegistrationMessage('Ошибка: Поля логина и пароля обязательны для заполнения.');            
            return;
        }

        const formLogin = {
            login: login,
            password: password
        };
        console.log(formLogin);
      
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formLogin)
            });

            if (!response.ok) {
                throw new Error('Ошибка при входе.');
            }

            const responseData = await response.json();            

            if (responseData.token) {

                localStorage.setItem('token', responseData.token);

                let user = {
                    login: responseData.username,                    
                    dob: responseData.dateOfBirth,
                    token: responseData.token
                };
                               
                setLoggedInUser(user);
                setShowLoginForm(false);
                setLogin('');
                setPassword('');
                setRegistrationMessage('');
            }
            else{
                setRegistrationMessage(responseData.message);
            }          

        } catch (error) {
            console.error('Ошибка при обработке запроса:', error);
            setRegistrationMessage('Ошибка при регистрации.');
        }        
    }; 
    
    const handleQuest = async (event) => {
        
        try {
            const response = await fetch('api/testing/load', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({})
            });          

        } catch (error) {
            console.error('Ошибка при обработке запроса:', error);            
        }
    }; 

    return (
        <div className="auth-buttons-container">
            {!showRegistrationForm && !showLoginForm && !loggedInUser &&(
                <>
                    <h1>ВИКТОРИНА!!!</h1>

                    <button className="auth-button" onClick={handleRegisterClick}>
                        Зарегистрироваться
                    </button>
                    <button className="auth-button" onClick={handleLoginClick}>
                        Войти
                    </button>    

                    {/* <button className="auth-button" onClick={handleQuest}>
                        Вопросы
                    </button>                    */}
                </>
            )}

            {showRegistrationForm && (
                <form className="container p-4" onSubmit={handleRegisterFormSubmit}>
                    <div className="mb-4 d-flex flex-column align-items-center">
                        <label htmlFor="login" className="form-label text-white">Логин:</label>
                        <input
                            type="text"
                            className="form-control w-100"
                            id="login"
                            value={login}
                            onChange={(e) => setLogin(e.target.value)}
                        />
                    </div>
                    <div className="mb-4 d-flex flex-column align-items-center">
                        <label htmlFor="password" className="form-label text-white">Пароль:</label>
                        <input
                            type="password"
                            className="form-control w-100"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="mb-4 d-flex flex-column align-items-center">
                        <label htmlFor="dob" className="form-label text-white">Дата рождения:</label>
                        <input
                            type="date"
                            className="form-control w-100"
                            id="dob"
                            value={dob}
                            onChange={(e) => setDob(e.target.value)}
                        />
                    </div>
                    <div className="d-flex justify-content-between">
                        <button type="submit" className="btn btn-primary">Зарегистрироваться</button>
                        <button className="btn btn-secondary" type="button" onClick={handleCancelClick}>Отмена</button>
                    </div>
                    {registrationMessage && <p>{registrationMessage}</p>}
                </form>
            )}

            {showLoginForm && (
                <form className="container p-4" onSubmit={handleLoginFormSubmit}>
                    <div className="mb-4 d-flex flex-column align-items-center">
                        <label htmlFor="login" className="form-label text-white">Логин:</label>
                        <input
                            type="text"
                            className="form-control w-100"
                            id="login"
                            value={login}
                            onChange={(e) => setLogin(e.target.value)}
                        />
                    </div>
                    <div className="mb-4 d-flex flex-column align-items-center">
                        <label htmlFor="password" className="form-label text-white">Пароль:</label>
                        <input
                            type="password"
                            className="form-control w-100"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="mb-4 d-flex justify-content-between">
                        <button type="submit" className="btn btn-primary">Войти</button>
                        <button className="btn btn-secondary" type="button" onClick={handleCancelClick}>Отмена</button>
                    </div>
                    {registrationMessage && <p>{registrationMessage}</p>}
                </form>
            )} 

            {loggedInUser && (
                <>
                    <User user={loggedInUser} onLogout={handleLogout} />                    
                </>
            )}         
        </div>
    );
};

export default AuthButtons;