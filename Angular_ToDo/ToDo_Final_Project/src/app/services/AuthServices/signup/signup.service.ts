import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HandleApiErrorService } from '../handle-api-error.service/handle-api-error.service.service';
import { User } from '../../../../types';
import { catchError, Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable({
  providedIn: 'root'
})
export class SignupService {
  private url = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient, private handleApiErrorService: HandleApiErrorService) { }

  signup(user: User): Observable<{status: string, message: string, token: string}>{
    return this.http.post<{status: string, message: string, token: string}>(`${this.url}/register`, user, httpOptions).pipe(
      catchError(this.handleApiErrorService.handleError)
  )}
}
