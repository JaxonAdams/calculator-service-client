import { jwtDecode } from "jwt-decode";

class JWTService {
  // get the user's token from local storage
  getToken() {
    return localStorage.getItem("token");
  }

  // set the user's token in local storage
  setToken(token) {
    localStorage.setItem("token", token);
  }

  // remove the user's token from local storage
  removeToken() {
    localStorage.removeItem("token");
  }

  // check if the user's token is expired
  isTokenExpired(token) {
    if (!token) return true;
    const { exp } = jwtDecode(token);
    return exp * 1000 < Date.now();
  }

  isLoggedIn() {
    const token = this.getToken();
    return token && !this.isTokenExpired(token);
  }
}

export default new JWTService();
