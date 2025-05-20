import React from 'react';

function SessionCounter({ count, title }) { // Recibe un título ahora
  return (
    <div className="session-counter-container">
      <h3>{title}</h3> {/* Usa el título pasado */}
      <div className="session-count-display">{count}</div>
    </div>
  );
}

export default SessionCounter;