export const loadState = () => {
  try {
    const serializedState = localStorage.getItem("shodyra-twitchsubs-state");
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

export const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem("shodyra-twitchsubs-state", serializedState);
  } catch (err) {
    // ignore write errors
  }
};
