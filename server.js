const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const players = [
  {
    name: "Lucho Z.",
    physicalCondition: 9,
    shooting: 8,
    passing: 10,
    goalkeeping: 3,
    defense: 6,
    dribbling: 8,
    speed: 8,
    competitiveness: 9
  },
  {
    name: "Vecino",
    physicalCondition: 9,
    shooting: 9,
    passing: 8,
    goalkeeping: 2,
    defense: 5,
    dribbling: 9,
    speed: 10,
    competitiveness: 9
  },
  // Agregamos el resto de los jugadores con valores aleatorios
  ...["Bruno", "Jani", "Mati L.", "Fercho", "Gime", "Tama", "Pela", "Igor", "Rama", "Nico p.", "Colo", "Leo", "Lucho E", "Fede V"].map(name => ({
    name,
    physicalCondition: Math.floor(Math.random() * 10) + 1,
    shooting: Math.floor(Math.random() * 10) + 1,
    passing: Math.floor(Math.random() * 10) + 1,
    goalkeeping: Math.floor(Math.random() * 10) + 1,
    defense: Math.floor(Math.random() * 10) + 1,
    dribbling: Math.floor(Math.random() * 10) + 1,
    speed: Math.floor(Math.random() * 10) + 1,
    competitiveness: Math.floor(Math.random() * 10) + 1
  }))
];

function calculatePlayerScore(player) {
  return Object.values(player).reduce((sum, value) => {
    return typeof value === 'number' ? sum + value : sum;
  }, 0) / (Object.keys(player).length - 1); // -1 para excluir el nombre
}

function createBalancedTeams(selectedPlayers) {
  const sortedPlayers = selectedPlayers.sort((a, b) => calculatePlayerScore(b) - calculatePlayerScore(a));
  const team1 = [];
  const team2 = [];
  let team1Score = 0;
  let team2Score = 0;

  sortedPlayers.forEach((player, index) => {
    const playerScore = calculatePlayerScore(player);
    if (team1Score <= team2Score) {
      team1.push(player);
      team1Score += playerScore;
    } else {
      team2.push(player);
      team2Score += playerScore;
    }
  });

  return { team1, team2 };
}

app.post('/create-teams', (req, res) => {
  const selectedPlayerNames = req.body.players;
  const selectedPlayers = players.filter(player => selectedPlayerNames.includes(player.name));
  const teams = createBalancedTeams(selectedPlayers);
  res.json(teams);
});

app.get('/players', (req, res) => {
  res.json(players);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

