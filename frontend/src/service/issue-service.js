const BASE_PATH = `${window.location.protocol}//${window.location.hostname}:3001`;

export const getCurrentSprint = () =>
  fetch(`${BASE_PATH}/currentsprint`).then(response => response.json());
