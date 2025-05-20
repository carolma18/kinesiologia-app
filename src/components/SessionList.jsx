import React from 'react';

function SessionList({ sessions, onDeleteSession }) {
  // Ordenar sesiones de la más reciente a la más antigua
  const sortedSessions = [...sessions].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="session-list-container">
      <h2>Sesiones Registradas</h2>
      {sortedSessions.length === 0 ? (
        <p>No hay sesiones registradas aún.</p>
      ) : (
        <ul className="session-list">
          {sortedSessions.map((session) => (
            <li key={session.id} className="session-item">
              <span>{session.date}</span>
              <span className="registered-by">Registrado por: {session.registeredBy}</span>
              <button onClick={() => onDeleteSession(session.id)} className="delete-button">
                &times;
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SessionList;
