const properties = require("./properties.json");
const express = require("express");
const app = express();
var cors = require("cors");
var JiraClient = require("jira-connector");
const port = 3001;

app.use(cors());

var jira = new JiraClient({
  host: properties.host,
  basic_auth: {
    email: properties.credentials.email,
    api_token: properties.credentials.token
  }
});

app.get("/currentsprint", async (req, res) => {
  const juralioBoard = await jira.board.getBoard({ boardId: 1 });
  const activeSprints = await jira.board.getAllSprints({
    boardId: juralioBoard.id,
    state: "active"
  });

  const activeSprint = activeSprints.values[0];

  const sprintIssues = await jira.board.getIssuesForSprint({
    boardId: juralioBoard.id,
    sprintId: activeSprint.id,
    maxResults: 1000
  });
  res.json({
    sprint: activeSprint,
    issues: sprintIssues.issues
  });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
