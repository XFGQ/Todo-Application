export const getTodosFromStorage = (username) => {
  return JSON.parse(localStorage.getItem(`todos_${username}`) || '[]');
};

export const saveTodosToStorage = (username, todos) => {
  localStorage.setItem(`todos_${username}`, JSON.stringify(todos));
};