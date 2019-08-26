import React, { useState, useEffect } from "react";
import { getCurrentSprint } from "../service/issue-service.js";

const statuses = ["To Do", "In Progress", "Code Review", "Done"];

const Board = () => {
  const [issues, setIssues] = useState([]);
  const [sprint, setSprint] = useState({});

  const renderSubTasksForStatus = (subtasks, status) => (
    <div className="sub-task-column">
      {subtasks
        .filter(
          subtask =>
            subtask.fields.status.statusCategory.name.toLowerCase() ===
            status.toLowerCase()
        )
        .map(subtask => (
          <div className="sub-task-container">{subtask.fields.summary}</div>
        ))}
    </div>
  );

  const renderIssueContent = issue => {
    console.log(issue.fields.subtasks);
    return (
      <div>
        <div className="issue">
          <h5>
            {issue.key} - {issue.fields.summary}
          </h5>
        </div>
        <div
          className="sub-task-grid"
          style={{
            gridTemplateColumns: `repeat(${statuses.length}, minmax(0, 1fr))`
          }}
        >
          {statuses.map(status =>
            renderSubTasksForStatus(issue.fields.subtasks, status)
          )}
        </div>
      </div>
    );
  };

  const renderIssues = () => {
    return issues
      .filter(issue => issue.fields.issuetype.name !== "Sub-task")
      .map(issue => <li key={issue.id}>{renderIssueContent(issue)}</li>);
  };

  useEffect(() => {
    const fetchData = async () => {
      const activeSprint = await getCurrentSprint();
      setSprint(activeSprint.sprint);
      setIssues(activeSprint.issues);
    };
    fetchData();
  }, []);

  return (
    <div>
      <ul className="issue-list">{renderIssues()}</ul>
    </div>
  );
};

export default Board;
