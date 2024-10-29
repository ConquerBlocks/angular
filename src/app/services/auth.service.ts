import { AuthAdapter } from "@/adapters";
import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable, map, tap, throwError, catchError } from "rxjs";
import { LocalManagerService, LocalKeys } from "./local-manager.service";
import { Router } from "@angular/router";
import { AuthData, Auth, LoginResponse } from "@/models";

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly baseUrl = 'http://localhost:4000/auth';
  http = inject(HttpClient);
  localManager = inject(LocalManagerService);
  router = inject(Router);

  login(user: AuthData): Observable<Auth> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, user).pipe(
      map(AuthAdapter),
      tap((auth) => {
        this.localManager.setElement(LocalKeys.accessToken, auth.accessToken);
        this.localManager.setElement(LocalKeys.refreshToken, auth.refreshToken);
      })
    );
  }

  register(user: AuthData): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/register`, user);
  }

  refreshToken(): Observable<string> {
    const refreshToken = this.localManager.getElement(LocalKeys.refreshToken);

    if (!refreshToken) {
      this.logout();
      return throwError(() => new Error('No refresh token available'));
    }

    return this.http
      .post<{ refreshToken: string }>(`${this.baseUrl}/token`, { refreshToken })
      .pipe(
        map((response) => response.refreshToken),
        tap((newAccessToken) => {
          this.localManager.setElement(LocalKeys.accessToken, newAccessToken);
        }),
        catchError((error) => {
          this.logout();
          return throwError(() => error);
        })
      );
  }

  logout(): void {
    this.localManager.clearStorage()
    this.router.navigate(['/login']);
  }
}
