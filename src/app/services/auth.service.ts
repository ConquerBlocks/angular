import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { AuthData, LoginResponse } from '../models/auth.model';
import { AuthAdapter } from './adapters';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly baseUrl = 'http://localhost:4000/auth';
  http: HttpClient = inject(HttpClient);

  login(user: AuthData): Observable<string> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, user).pipe(map(AuthAdapter));
  }

  register(user: AuthData): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/register`, user);
  }
}
