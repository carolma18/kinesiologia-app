import React, { useState, useEffect } from 'react';
import CalendarComponent from './components/CalendarComponent';
import SessionList from './components/SessionList';
import SessionCounter from './components/SessionCounter';
import ThemeToggle from './components/ThemeToggle';
import WhoRegisteredSelect from './components/WhoRegisteredSelect';
import './styles/App.css';

function App() {
  const [sessions, setSessions] = useState(() => {
    // Cargar sesiones desde localStorage al iniciar
    const savedSessions = localStorage.getItem('kinesiologiaSessions');
    return savedSessions ? JSON.parse(savedSessions) : [];
  });
  const [whoRegistered, setWhoRegistered] = useState('Yudimar'); // Estado para quién registra
  const [theme, setTheme] = useState(() => {
    // Cargar tema desde localStorage al iniciar
    const savedTheme = localStorage.getItem('kinesiologiaTheme');
    return savedTheme || 'light';
  });

  // Guardar sesiones en localStorage cada vez que cambian
  useEffect(() => {
    localStorage.setItem('kinesiologiaSessions', JSON.stringify(sessions));
  }, [sessions]);

  // Aplicar la clase del tema al body
  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const addSession = (date) => {
    const newSession = {
      id: Date.now(), // Un ID único para cada sesión
      date: date.toISOString().split('T')[0], // Formato YYYY-MM-DD
      registeredBy: whoRegistered,
    };
    setSessions((prevSessions) => [...prevSessions, newSession]);
  };

  const deleteSession = (id) => {
    setSessions((prevSessions) => prevSessions.filter((session) => session.id !== id));
  };

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className={`App ${theme}`}>
      <header className="app-header">
        <h1 className="app-title">
          <span>Control de Sesiones de Kinesiología</span>
        </h1>
        <p className="app-subtitle">
          <span>Gestiona tus fechas de rehabilitación</span>
        </p>
        <ThemeToggle toggleTheme={toggleTheme} theme={theme} />
      </header>

      <main className="app-main">
        <div className="input-section">
          <WhoRegisteredSelect whoRegistered={whoRegistered} setWhoRegistered={setWhoRegistered} />
          <p className="instruction">Haz click en una fecha del calendario para registrar una sesión con {whoRegistered}.</p>
        </div>

        <div className="content-grid">
          <div className="calendar-container">
            <CalendarComponent addSession={addSession} />
          </div>

          <div className="session-info-container">
            <SessionCounter count={sessions.length} />
            <SessionList sessions={sessions} onDeleteSession={deleteSession} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
