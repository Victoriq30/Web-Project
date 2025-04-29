const users = [
  { username: 'admin', password: 'admin123' },
  { username: 'user', password: 'user123' }
];

export function login(username, password) {
  return users.find(user => user.username === username && user.password === password);
}

export function register(username, password) {
  users.push({ username, password });
  return true;
}
