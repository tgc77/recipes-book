import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { BehaviorSubject, throwError } from 'rxjs';

import { User } from '../models/user.model';
import { Router } from '@angular/router';

export interface IAuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  user = new BehaviorSubject<User>(null);
  private API_KEY = 'AIzaSyAX2TH71BPl3UYNRh4latgzo1GCPSbvpGM';
  private SIGNUP_URL =
    'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=';
  private LOGIN_URL =
    'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=';

  constructor(private http: HttpClient, private router: Router) {
    this.SIGNUP_URL += this.API_KEY;
    this.LOGIN_URL += this.API_KEY;
  }

  signup(email: string, password: string) {
    return this.http
      .post<IAuthResponseData>(this.SIGNUP_URL, {
        email,
        password,
        returnSecureToken: true,
      })
      .pipe(
        catchError(this.handleError),
        tap((resData) => {
          this.handleAuthentication(
            resData.email,
            resData.localId,
            resData.idToken,
            +resData.expiresIn
          );
        })
      );
  }

  private handleAuthentication(
    email: string,
    userId: string,
    token: string,
    expiresIn: number
  ) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email, userId, token, expirationDate);
    this.user.next(user);
  }

  login(email: string, password: string) {
    return this.http
      .post<IAuthResponseData>(this.LOGIN_URL, {
        email,
        password,
        returnSecureToken: true,
      })
      .pipe(
        catchError(this.handleError),
        tap((resData) => {
          this.handleAuthentication(
            resData.email,
            resData.localId,
            resData.idToken,
            +resData.expiresIn
          );
        })
      );
  }

  logout() {
    this.user.next(null);
    this.router.navigate(['/auth']);
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';

    if (!errorRes.error || !errorRes.error.error) {
      return throwError(errorMessage);
    }

    switch (errorRes.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'This email exists already!';
        break;

      case 'TOO_MANY_ATTEMPTS_TRY_LATER':
        errorMessage =
          'This operation was blocked! Too many attempts! Try again later';
        break;

      case 'EMAIL_NOT_FOUND':
        errorMessage = 'This email do not exists! Have you sign up already?';
        break;

      case 'INVALID_PASSWORD':
        errorMessage = 'Email or password invalid!';
        break;

      default:
        break;
    }
    return throwError(errorMessage);
  }
}
