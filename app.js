const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const app = express();
app.use(express.json());

const dbPath = path.join(__dirname, "cricketTeam.db");

let db = null;

const initializeDbAndServer = async () => {
  try {
    db = await open({
      fileName: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000,()=>{
        console.log("Server is Running")
    })
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
const playersArray = await database.all(getPlayersQuery);
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
module.exports = app;
