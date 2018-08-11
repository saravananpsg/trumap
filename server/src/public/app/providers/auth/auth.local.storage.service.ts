import { Inject, Injectable } from '@angular/core';
import { urlBase64Decode } from '@nebular/auth/helpers';

@Injectable()
export class AuthLocalStorage {
  protected key = 'user_token';

  getPayload(token): any {

      if (!token) {
        throw new Error('Cannot extract payload from an empty token.');
      }

      const parts = token.split('.');

      if (parts.length !== 3) {
        throw new Error(`The token ${token} is not valid JWT token and must consist of three parts.`);
      }

      let decoded;
      try {
        decoded = urlBase64Decode(parts[1]);
      } catch (e) {
        throw new Error(`The token ${token} is not valid JWT token and cannot be parsed.`);
      }

      if (!decoded) {
        throw new Error(`The token ${token} is not valid JWT token and cannot be decoded.`);
      }

      return JSON.parse(decoded);
  }
  get(): any {
    return this.getPayload(localStorage.getItem(this.key));
  }

  /**
   * Sets token to localStorage
   * @param {NbAuthToken} token
   */
  set(token) {
    localStorage.setItem(this.key, token);
  }

  /**
   * Clears token from localStorage
   */
  clear() {
    localStorage.removeItem(this.key);
  }
}
