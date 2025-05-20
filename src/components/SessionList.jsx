import React from 'react';

function SessionList({ sessions, handleDeleteSession }) {
  // Ahora la lista solo muestra las sesiones filtradas por fecha,
  // y el contador en App.jsx muestra el total.
  if (!sessions || sessions.length === 0) {
    return <p style={{ textAlign: 'center', color: 'var(--secondary-color)' }}>No hay sesiones registradas para esta fecha.</p>;
  }

  return (
    <div className="session-list-container">
      <h3>Sesiones para el día seleccionado</h3> {/* Título ajustado */}
      <ul className="session-list">
        {sessions.map((session) => (
          <li key={session.id} className="session-item">
            <span>{session.date} - {session.registeredBy}</span>
            <button 
              onClick={() => handleDeleteSession(session.id, session.rowIndex)} 
              className="delete-button"
            >
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SessionList;