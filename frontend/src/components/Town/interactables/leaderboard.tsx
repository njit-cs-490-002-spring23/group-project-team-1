import React from 'react';
import { GameResult } from '../../../types/CoveyTownSocket';
import updateElo from Elo.ts
//very basic leaderboard will continue to update

export default function Leaderboard({ results }: { results: GameResult[] }): JSX.Element {
  // Create a map to store aggregated results for each player
  // come back and connect to database once fully set up
  var currentplayers = new Array();
  const playerStats: { [playerName: string]: { elo: number } } = {};

  results.forEach(result => {
    for (const [playerName] of Object.entries(result.scores)) {
      if (!playerStats[playerName]) {
        playerStats[playerName] = { elo: 1500 };
      }
      currentplayers.push(playerName);
    }
  });
  updateElo(currentplayers[0],currentplayers[1], results) //update elo from elo.ts
  // Convert the playerStats map to an array and sort by elo, come back to grabbing from database when set up
  const sortedPlayers = Object.entries(playerStats)
    .map(([playerName, stats]) => ({ playerName, ...stats }))
    .sort((a, b) => b.elo - a.elo);
  //display leaderboard
  return (
    <table role='grid'>
      <thead>
        <tr role='row'>
          <th>Player</th>
          <th>Elo</th>
        </tr>
      </thead>
      <tbody>
        {sortedPlayers.map(player => (
          <tr role='row' key={player.playerName}>
            <td role='gridcell'>{player.playerName}</td>
            <td role='gridcell'>{player.elo}</td>
 
          </tr>
        ))}
      </tbody>
    </table>
  );
}
