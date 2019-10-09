import React, { useState, useEffect } from "react";
import { getCurrentSprint } from "../service/issue-service.js";
import { RotateLoader } from "react-spinners";
import classNames from "classnames";

const issueStati = ["Open", "In Progress", "Done"];
const taskStati = ["To Do", "In Progress", "Code Review", "Done"];

const issueStatiClasses = {
  [issueStati[0]]: "open",
  [issueStati[1]]: "in-progress",
  [issueStati[2]]: "done"
};

const Board = () => {
  const [issues, setIssues] = useState([]);
  const [sprint, setSprint] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const renderSubTasksForStatus = (subtasks, status) => (
    <div className="sub-task-column">
      {subtasks
        .filter(
          subtask =>
            subtask.fields.status.name.toLowerCase() === status.toLowerCase()
        )
        .map(subtask => (
          <div className="sub-task-container">{subtask.fields.summary}</div>
        ))}
    </div>
  );

  const isIssueDone = issue => issue.fields.status.name === "Done";

  const renderIssueContent = issue => {
    return (
      <div>
        <div
          className={classNames(
            "issue",
            issueStatiClasses[issue.fields.status.name]
          )}
        >
          {issue.fields.assignee && (
            <img src={issue.fields.assignee.avatarUrls["16x16"]}></img>
          )}
          <h4>
            {issue.key} - {issue.fields.summary} - {issue.fields.status.name}
          </h4>
        </div>
        {!isIssueDone(issue) && (
          <div
            className="sub-task-grid"
            style={{
              gridTemplateColumns: `repeat(${taskStati.length}, minmax(0, 1fr))`
            }}
          >
            {taskStati.map(status =>
              renderSubTasksForStatus(issue.fields.subtasks, status)
            )}
          </div>
        )}
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
      setIsLoading(true);
      const activeSprint = await getCurrentSprint();
      setSprint(activeSprint.sprint);
      setIssues(activeSprint.issues);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  return (
    <div>
      {isLoading && (
        <div className="loading-indicator-container">
          <RotateLoader color="#63a5a9" />
        </div>
      )}
      <ul className="issue-list">{renderIssues()}</ul>
    </div>
  );
};

export default Board;
