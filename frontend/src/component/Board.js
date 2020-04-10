import React, { useState, useEffect } from "react";
import { getCurrentSprint } from "../service/issue-service.js";
import { RotateLoader } from "react-spinners";
import classNames from "classnames";
import { wasCompletedOnLastWorkingDay } from "../helper/issue-helper.js";

const issueStati = ["Open", "In Progress", "Done", "Resolved"];
const completedIssueStatiStartIndex = 2;
const taskStati = ["Open", "In Progress", "Code Review", "Done"];

const issueStatiClasses = {
  [issueStati[0]]: "open",
  [issueStati[1]]: "in-progress",
  [issueStati[2]]: "done",
  [issueStati[3]]: "done",
};

const scrollToItemsCompletedOnPreviousWorkDay = () => {
  setTimeout(() => {
    const completeItem = document.querySelector(".latest-complete");
    completeItem && completeItem.scrollIntoView(true);
  });
};

const Board = () => {
  const [issues, setIssues] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const renderSubTasksForStatus = (subtasks, status) => (
    <div key={status} className="sub-task-column">
      {subtasks
        .filter(
          (subtask) =>
            subtask.fields.status.name.toLowerCase() === status.toLowerCase()
        )
        .map((subtask) => (
          <div key={subtask.key} className="sub-task-container">
            {subtask.fields.summary}
          </div>
        ))}
    </div>
  );

  const isIssueDone = (issue) => issue.fields.status.name === "Done";

  const renderIssueContent = (issue) => {
    const isNewlyCompleted = wasCompletedOnLastWorkingDay(issue);
    return (
      <div>
        <div
          className={classNames(
            "issue",
            issueStatiClasses[issue.fields.status.name],
            {
              "latest-complete": isNewlyCompleted,
            }
          )}
        >
          {issue.fields.assignee && (
            <img
              alt={`Avatar of ${issue.fields.assignee.name}`}
              src={issue.fields.assignee.avatarUrls["16x16"]}
            ></img>
          )}

          <h4>
            {issue.key} - {issue.fields.summary} - {issue.fields.status.name}
          </h4>
          {isNewlyCompleted && (
            <span
              class="latest-complete-indicator"
              role="img"
              aria-label="Rocket emoji"
            >
              🚀
            </span>
          )}
        </div>
        {!isIssueDone(issue) && (
          <div
            className="sub-task-grid"
            style={{
              gridTemplateColumns: `repeat(${taskStati.length}, minmax(0, 1fr))`,
            }}
          >
            {taskStati.map((status) =>
              renderSubTasksForStatus(issue.fields.subtasks, status)
            )}
          </div>
        )}
      </div>
    );
  };

  const sortCompletedIssuesFirst = (a, b) => {
    const aStatusIndex = issueStati.indexOf(a.fields.status.name);
    const bStatusIndex = issueStati.indexOf(b.fields.status.name);

    if (
      aStatusIndex >= completedIssueStatiStartIndex &&
      bStatusIndex < completedIssueStatiStartIndex
    ) {
      return -1;
    } else if (
      bStatusIndex >= completedIssueStatiStartIndex &&
      aStatusIndex < completedIssueStatiStartIndex
    ) {
      return 1;
    }
    return 0;
  };

  const renderIssues = () => {
    return issues
      .filter((issue) => issue.fields.issuetype.name !== "Sub-task")
      .sort(sortCompletedIssuesFirst)
      .map((issue) => <li key={issue.id}>{renderIssueContent(issue)}</li>);
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const activeSprint = await getCurrentSprint();
      setIssues(activeSprint.issues);
      setIsLoading(false);
      scrollToItemsCompletedOnPreviousWorkDay();
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
