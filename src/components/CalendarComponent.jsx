import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { format, parseISO } from 'date-fns';

function CalendarComponent({ selectedDate, handleDateChange, handleRegisterSession, sessions }) {
  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const formattedDate = format(date, 'yyyy-MM-dd');
      const hasSession = sessions.some(session => {
        try {
          // Asegúrate de que session.date se convierta a Date antes de formatear
          return format(parseISO(session.date), 'yyyy-MM-dd') === formattedDate;
        } catch (error) {
          console.warn(`[CalendarComponent] Fecha inválida encontrada en sesión: '${session.date}'. Ignorando para resaltar calendario.`, error);
          return false;
        }
      });
      if (hasSession) {
        return 'has-session';
      }
    }
    return null;
  };

  return (
    <div className="calendar-container">
      <Calendar
        onChange={handleDateChange}
        value={selectedDate}
        locale="es-ES"
        tileClassName={tileClassName}
      />
      <button 
        onClick={handleRegisterSession} 
        style={{ marginTop: '20px', padding: '10px 20px', fontSize: '1em', cursor: 'pointer', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px' }} 
      >
        Registrar Sesión
      </button>
    </div>
  );
}

export default CalendarComponent;