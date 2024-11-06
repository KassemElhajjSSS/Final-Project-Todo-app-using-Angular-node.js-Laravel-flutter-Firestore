import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HandleApiErrorService } from '../handle-api-error.service/handle-api-error.service.service';
import { catchError, Observable } from 'rxjs';
import { User } from '../../../../types';


@Injectable({
  providedIn: 'root'
})
export class LoginService {
  //To use API's make sure to include provideHttpClient() in providers in app.config.ts

  private url = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient, private handleApiErrorService: HandleApiErrorService) { }

  login(user: User): Observable<{status: string, message: string, token: string}> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    
    return this.http.post<{status: string, message: string, token: string}>(`${this.url}/login`, user, httpOptions).pipe(
      catchError(this.handleApiErrorService.handleError)
    );
  }
}
