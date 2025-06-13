

export function login(username: string, password: string): boolean {
    if (username === 'admin' && password === 'password123') {
      localStorage.setItem('isAuthenticated', 'true'); 
      return true;
    }
    return false;
  }
  