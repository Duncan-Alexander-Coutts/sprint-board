import { getPreviousWorkday } from "./date-helper";
import moment from "moment";

export const wasCompletedOnLastWorkingDay = (issue) => {
  const completedDateString = issue.fields.resolutiondate;

  if (!completedDateString) {
    return false;
  }

  const completedDate = moment(completedDateString);
  const lastWorkingDay = getPreviousWorkday();
  const now = moment();

  return completedDate.isBetween(lastWorkingDay, now);
};
