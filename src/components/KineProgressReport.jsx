import React, { useState, useEffect } from 'react';
import { format, startOfWeek, endOfWeek, addWeeks, isWithinInterval, startOfMonth, endOfMonth, addMonths, parseISO, getISOWeek, getMonth, getYear } from 'date-fns';
import { es } from 'date-fns/locale'; // Para nombres de días/meses en español

function KineProgressReport({ sessions }) {
  const [weeklyReport, setWeeklyReport] = useState({});
  const [monthlyReport, setMonthlyReport] = useState({});

  useEffect(() => {
    if (sessions.length > 0) {
      calculateReports(sessions);
    }
  }, [sessions]); // Recalcular cuando las sesiones cambian

  const calculateReports = (allSessions) => {
    const weeklyCounts = {};
    const monthlyCounts = {};
    const currentYear = new Date().getFullYear();

    allSessions.forEach(session => {
      try {
        const sessionDate = parseISO(session.date);

        // -- Reporte Semanal --
        const weekStart = startOfWeek(sessionDate, { locale: es, weekStartsOn: 1 }); // Lunes como inicio de semana
        const weekKey = format(weekStart, 'yyyy-MM-dd'); // Clave única para la semana
        const weekLabel = `Semana ${getISOWeek(sessionDate)} (${format(weekStart, 'MMM d', { locale: es })})`;

        if (!weeklyCounts[weekKey]) {
          weeklyCounts[weekKey] = { label: weekLabel, count: 0, startDate: weekStart };
        }
        weeklyCounts[weekKey].count += 1;

        // -- Reporte Mensual --
        const monthStart = startOfMonth(sessionDate);
        const monthKey = format(monthStart, 'yyyy-MM'); // Clave única para el mes
        const monthLabel = format(monthStart, 'MMMM yyyy', { locale: es });

        if (!monthlyCounts[monthKey]) {
          monthlyCounts[monthKey] = { label: monthLabel, count: 0, startDate: monthStart };
        }
        monthlyCounts[monthKey].count += 1;

      } catch (error) {
        console.error(`Error procesando fecha de sesión '${session.date}' para reportes:`, error);
      }
    });

    // Convertir a array y ordenar (más reciente primero)
    const sortedWeekly = Object.values(weeklyCounts).sort((a, b) => b.startDate.getTime() - a.startDate.getTime());
    const sortedMonthly = Object.values(monthlyCounts).sort((a, b) => b.startDate.getTime() - a.startDate.getTime());

    setWeeklyReport(sortedWeekly);
    setMonthlyReport(sortedMonthly);
  };

  return (
    <div className="kine-report-container">
      <h2>📈 Reporte de Sesiones</h2>

      <div className="report-section">
        <h3>Por Semana</h3>
        {weeklyReport.length > 0 ? (
          <ul className="report-list">
            {weeklyReport.map((weekData, index) => (
              <li key={index} className="report-item">
                <span className="report-label">{weekData.label}:</span> 
                <span className="report-count">{weekData.count} sesiones</span>
                {/* Visualización básica con CSS */}
                <div className="report-bar-container">
                  <div className="report-bar" style={{ width: `${weekData.count * 10}px` }}></div> 
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No hay datos de sesiones semanales.</p>
        )}
      </div>

      <div className="report-section">
        <h3>Por Mes</h3>
        {monthlyReport.length > 0 ? (
          <ul className="report-list">
            {monthlyReport.map((monthData, index) => (
              <li key={index} className="report-item">
                <span className="report-label">{monthData.label}:</span> 
                <span className="report-count">{monthData.count} sesiones</span>
                {/* Visualización básica con CSS */}
                <div className="report-bar-container">
                  <div className="report-bar" style={{ width: `${monthData.count * 5}px` }}></div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No hay datos de sesiones mensuales.</p>
        )}
      </div>

      {/* Puedes añadir aquí un recuadro de "Avance General" si lo deseas */}
      <div className="kine-advance-box">
        <h3>✨ Tu Avance General en Kines.</h3>
        <p>¡Has completado un total de **{sessions.length}** sesiones hasta ahora!</p>
        <p>¡Sigue así, la constancia es clave para tu recuperación!</p>
      </div>

    </div>
  );
}

export default KineProgressReport;