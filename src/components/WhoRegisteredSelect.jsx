import React from 'react';

function WhoRegisteredSelect({ whoRegistered, setWhoRegistered }) {
  const handleChange = (e) => {
    setWhoRegistered(e.target.value);
  };

  return (
    <div className="who-registered-select-container">
      <label htmlFor="whoRegistered">¿Quién registra la sesión?</label>
      <select id="whoRegistered" value={whoRegistered} onChange={handleChange}>
        <option value="Yudimar">Yudimar</option>
        <option value="Alexis">Alexis</option>
      </select>
    </div>
  );
}

export default WhoRegisteredSelect;
