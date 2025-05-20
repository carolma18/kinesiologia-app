import { useState, useEffect, useCallback } from 'react';
import CalendarComponent from './components/CalendarComponent';
import SessionCounter from './components/SessionCounter';
import SessionList from './components/SessionList';
import ThemeToggle from './components/ThemeToggle';
import WhoRegisteredSelect from './components/WhoRegisteredSelect';
import KineProgressReport from './components/KineProgressReport';
import './styles/App.css';
import { getSessions, addSession, deleteSession } from './api/sheets';
import { format, parseISO } from 'date-fns';

function App() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [sessions, setSessions] = useState([]);
  const [whoRegistered, setWhoRegistered] = useState('Yudimar');
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark' ? 'dark' : 'light';
  });

  const loadAllSessions = useCallback(async () => {
    console.log("[App.jsx] Cargando todas las sesiones...");
    try {
      const fetchedSessions = await getSessions();
      // Ordenar sesiones por fecha descendente
      fetchedSessions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setSessions(fetchedSessions);
      console.log("[App.jsx] Sesiones cargadas exitosamente:", fetchedSessions.length, "sesiones.");
    } catch (error) {
      console.error("[App.jsx] Error al cargar sesiones:", error);
    }
  }, []);

  useEffect(() => {
    loadAllSessions();
  }, [loadAllSessions]);

  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleRegisterSession = async () => {
    if (selectedDate && whoRegistered) {
      const formattedDateForSheet = format(selectedDate, 'yyyy-MM-dd');
      
      console.log(`[App.jsx] Intentando registrar sesión para: ${formattedDateForSheet} por ${whoRegistered}`);
      const newSession = await addSession(formattedDateForSheet, whoRegistered);

      if (newSession) {
        // Asegúrate de que el alert muestre la fecha que quieres
        alert(`Sesión registrada para ${formattedDateForSheet} por ${whoRegistered}`);
        await loadAllSessions();
      } else {
        alert('Error al registrar la sesión.');
      }
    } else {
      alert('Por favor, selecciona una fecha y especifica quién registra.');
    }
  };

  const handleDeleteSession = async (sessionIdToDelete, rowIndex) => {
    console.log("[App.jsx] Intentando eliminar sesión con ID:", sessionIdToDelete, "y rowIndex:", rowIndex);
    const isDeleted = await deleteSession(rowIndex);

    if (isDeleted) {
      alert('Sesión eliminada correctamente.');
      await loadAllSessions();
    } else {
      alert('Error al eliminar la sesión.');
    }
  };

  const sessionsForSelectedDate = selectedDate
    ? sessions.filter(session => {
        try {
            const sessionDateFormatted = format(parseISO(session.date), 'yyyy-MM-dd');
            const selectedDateFormatted = format(selectedDate, 'yyyy-MM-dd');
            return sessionDateFormatted === selectedDateFormatted;
        } catch (error) {
            console.error(`[App.jsx] Error al parsear fecha de sesión '${session.date}':`, error);
            return false;
        }
      })
    : [];

  return (
    <div className={`App ${theme}`}>
      <header className="app-header">
        <h1 className="app-title">
          <span>Control de Sesiones de Kinesiología</span>
        </h1>
        <p className="app-subtitle">
          <span>Pinche Page - Gestionemos tus fechas de rehabilitación</span>
        </p>
        <ThemeToggle theme={theme} toggleTheme={() => setTheme(theme === 'light' ? 'dark' : 'light')} />
      </header>

      <section className="input-section">
        <WhoRegisteredSelect whoRegistered={whoRegistered} setWhoRegistered={setWhoRegistered} />
        <p className="instruction">
          Haz click en una fecha del calendario para registrar una sesión con {whoRegistered}.
        </p>
      </section>

      <div className="content-grid">
        <div className="calendar-wrapper">
          <CalendarComponent
            selectedDate={selectedDate}
            handleDateChange={handleDateChange}
            handleRegisterSession={handleRegisterSession}
            sessions={sessions}
          />
        </div>

        <div className="session-info-container">
          <SessionCounter count={sessions.length} title="Total de Sesiones" />
          <SessionCounter count={sessionsForSelectedDate.length} title="Sesiones para el día seleccionado" />

          <SessionList sessions={sessionsForSelectedDate} />
          <KineProgressReport sessions={sessions} /> 
        </div>
      </div>
    </div>
  );
}

export default App;