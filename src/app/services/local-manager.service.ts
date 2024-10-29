import { Injectable } from '@angular/core';

export enum LocalKeys {
  accessToken = 'token',
  refreshToken = 'refresh-token',
}

@Injectable({
  providedIn: 'root'
})
export class LocalManagerService {
  getElement(key: LocalKeys): string | null {
    return localStorage.getItem(key);
  }

  setElement(key: LocalKeys, value: string): void {
    localStorage.setItem(key, value);
  }

  clearStorage(): void {
    localStorage.clear();
  }
}
