import moment from "moment";

export const getPreviousWorkday = () => {
  let workday = moment();
  let day = workday.day();
  let diff = 1; // returns yesterday
  if (day === 0 || day === 1) {
    // is Sunday or Monday
    diff = day + 2; // returns Friday
  }
  return workday.subtract(diff, "days").startOf("day");
};
