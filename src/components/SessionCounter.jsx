import React from 'react';

function SessionCounter({ count }) {
  return (
    <div className="session-counter-container">
      <h3>Total de Sesiones:</h3>
      <p className="session-count-display">{count}</p>
    </div>
  );
}

export default SessionCounter;
