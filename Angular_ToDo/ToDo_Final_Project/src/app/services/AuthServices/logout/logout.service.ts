import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HandleApiErrorService } from '../handle-api-error.service/handle-api-error.service.service';
import { catchError, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LogoutService {
  //To use API's make sure to include provideHttpClient() in providers in app.config.ts

  private url = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient, private handleApiErrorService: HandleApiErrorService) { }

  logout(): Observable<{status: string, message: string}> {
    const token = localStorage.getItem('authToken');
    
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
    return this.http.post<{status: string, message: string}>(`${this.url}/logout`, {}, httpOptions).pipe( //Make sure to add this {} for body
      catchError(this.handleApiErrorService.handleError)
    );
  }
}
