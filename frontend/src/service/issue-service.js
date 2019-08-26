//const BASE_PATH = "https://juralio.atlassian.net/rest/agile/1.0";
const BASE_PATH = "http://localhost:3001";

export const getCurrentSprint = () =>
  fetch(`${BASE_PATH}/currentsprint`).then(response => response.json());
