import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Estilos por defecto de react-calendar
import '../styles/App.css'; // Para integrar estilos personalizados

function CalendarComponent({ addSession }) {
  const handleDateClick = (date) => {
    addSession(date);
  };

  return (
    <div className="calendar-wrapper">
      <Calendar onClickDay={handleDateClick} />
    </div>
  );
}

export default CalendarComponent;
