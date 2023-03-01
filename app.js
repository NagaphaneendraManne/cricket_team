const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const app = express();
app.use(express.json());

const dbPath = path.join(__dirname, "cricketTeam.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};
initializeDBAndServer();

//
app.get("/players/", async (request, response) => {
  const getPlayersQuery = `
 SELECT
 *
 FROM
 cricket_team;`;
  const playersArray = await db.all(getPlayersQuery);
  const convertDbObjectToResponseObject = (dbObject) => {
    return {
      playerId: dbObject.player_id,
      playerName: dbObject.player_name,
      jerseyNumber: dbObject.jersey_number,
      role: dbObject.role,
    };
  };
  response.send(
    playersArray.map((eachPlayer) =>
      convertDbObjectToResponseObject(eachPlayer)
    )
  );
});

//Adding new player
app.post("/players/", async (request, response) => {
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  const addPlayerQuery = `
    INSERT cricket_team( playerName,
        jerseyNumber,
        role)
          VALUES
      (
          ${playerName},
          ${jerseyNumber},
          ${role}
          );`;
  const dbResponse = await db.run(addPlayerQuery);
  const playerId = dbResponse.lastID;
  response.send({ playerId: playerId });
});

// GET player by Player Id
app.get("/players/", async (request, response) => {
  const getPlayersQuery = `
 SELECT
 *
 FROM
 cricket_team
 ORDER BY player_id;`;
  const playersArray = await db.all(getPlayersQuery);
  const convertDbObjectToResponseObject = (dbObject) => {
    return {
      playerId: dbObject.player_id,
      playerName: dbObject.player_name,
      jerseyNumber: dbObject.jersey_number,
      role: dbObject.role,
    };
  };
  response.send(
    playersArray.map((eachPlayer) =>
      convertDbObjectToResponseObject(eachPlayer)
    )
  );
});

//Update Player Details
app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;

  const updatePlayerQuery = `
    UPDATE
      cricket_team
    SET
      playerName='${playerName}',
      jerseyNumber=${jerseyNumber},
      role=${role},
    WHERE
      player_id = ${playerId};`;
  await db.run(updatePlayerQuery);
  response.send("Player Details updated");
});

//Delete Player Details
app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const deletePlayerQuery = `
    DELETE FROM cricket_team WHERE player_id = ${playerId};`;
  await db.run(deletePlayerQuery);
  response.send("Player Removed");
});
module.exports = app;
