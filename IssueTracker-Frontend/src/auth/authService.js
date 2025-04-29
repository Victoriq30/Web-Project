const users = [
  { username: 'admin', password: 'admin123', email: 'admin@example.com' },
  { username: 'user', password: 'user123', email:' user@example.com'}
];

export function login(username, password) {
  return users.find(user => user.username === username && user.password === password);
}

export function register(username, password, email) {
  const usernameExists = users.some(user => user.username === username);
  const emailExists = users.some(user => user.email === email);
  
  if (usernameExists || emailExists) return false;

  users.push({ username, password, email });
  return true;
}
