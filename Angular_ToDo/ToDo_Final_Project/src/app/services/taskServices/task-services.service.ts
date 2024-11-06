import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Task } from '../../../types';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskServicesService {
  private url = 'http://localhost:3000/tasks'
  constructor(private http: HttpClient) { }

  addTask(task: Task): Observable<{status: string, message: string, task: Task}>{
    const token = localStorage.getItem('authToken');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    }
    return this.http.post<{status: string, message: string, task: Task}>(`${this.url}`, task, httpOptions);
  }

  getTasks(): Observable<{status: string, message: string, tasks: Task[]}>{
    const token = localStorage.getItem('authToken');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    }
    return this.http.get<{status: string, message: string, tasks: Task[]}>(`${this.url}`, httpOptions);  //In post we only have two parameters so we don't have to fill the body
  }

  deleteTask(taskId: string): Observable<{status: string, message: string}>{
    const token = localStorage.getItem('authToken');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    }
    return this.http.delete<{status: string, message: string}>(`${this.url}/${taskId}`, httpOptions);
  }

}
