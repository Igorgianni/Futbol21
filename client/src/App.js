import React, { useState, useEffect } from 'react';
import styles from './App.module.css';

function App() {
  const [players, setPlayers] = useState([]);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [teams, setTeams] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/players')
      .then(response => response.json())
      .then(data => setPlayers(data));
  }, []);

  const handlePlayerSelect = (player) => {
    if (selectedPlayers.includes(player)) {
      setSelectedPlayers(selectedPlayers.filter(p => p !== player));
    } else if (selectedPlayers.length < 10) {
      setSelectedPlayers([...selectedPlayers, player]);
    }
  };

  const handleCreateTeams = () => {
    if (selectedPlayers.length !== 10) {
      alert('Por favor, selecciona exactamente 10 jugadores.');
      return;
    }

    fetch('http://localhost:5000/create-teams', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ players: selectedPlayers.map(p => p.name) }),
    })
      .then(response => response.json())
      .then(data => setTeams(data));
  };

  return (
    <div className={styles.app}>
      <h1 className={styles.title}>Armador de Equipos de Fútbol</h1>
      <div className={styles.playerSelection}>
        <h2>Selecciona 10 Jugadores</h2>
        <div className={styles.playerGrid}>
          {players.map(player => (
            <div
              key={player.name}
              className={`${styles.playerCard} ${selectedPlayers.includes(player) ? styles.selected : ''}`}
              onClick={() => handlePlayerSelect(player)}
            >
              <h3>{player.name}</h3>
              <p>Condición Física: {player.physicalCondition}</p>
              <p>Tiro: {player.shooting}</p>
              <p>Pase: {player.passing}</p>
              <p>Arquero: {player.goalkeeping}</p>
              <p>Defensa: {player.defense}</p>
              <p>Regate: {player.dribbling}</p>
              <p>Velocidad: {player.speed}</p>
              <p>Competitividad: {player.competitiveness}</p>
            </div>
          ))}
        </div>
      </div>
      <button className={styles.createTeamsButton} onClick={handleCreateTeams}>Armar Equipos</button>
      {teams && (
        <div className={styles.teamsContainer}>
          <div className={styles.team}>
            <h2>Equipo 1</h2>
            {teams.team1.map(player => (
              <p key={player.name}>{player.name}</p>
            ))}
          </div>
          <div className={styles.team}>
            <h2>Equipo 2</h2>
            {teams.team2.map(player => (
              <p key={player.name}>{player.name}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

