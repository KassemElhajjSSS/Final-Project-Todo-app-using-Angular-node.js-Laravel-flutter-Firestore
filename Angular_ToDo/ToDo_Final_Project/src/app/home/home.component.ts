import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AddTaskComponent } from "../components/add-task/add-task.component";
import { Task } from "../../types"
import { TaskServicesService } from '../services/taskServices/task-services.service';
import { LogoutComponent } from "../components/Auth/logout/logout/logout.component";
import { LogoutService } from '../services/AuthServices/logout/logout.service';
import { Router } from '@angular/router';
import { TaskComponent } from "../components/task/task.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, AddTaskComponent, AddTaskComponent, LogoutComponent, TaskComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})

export class HomeComponent {
  taskList: Task[] = []
  isLoggedIn: boolean = false;
  
  constructor(private taskServices: TaskServicesService, private logoutServices: LogoutService, private router: Router ) {}

  ngOnInit(): void {
    this.checkLoginStatus(); // Check login status when the app initializes
    this.fetchTasks();
  }

  checkLoginStatus(): void {
    const token = localStorage.getItem('authToken');
    this.isLoggedIn = !!token; // If token exists, the user is logged in
    if (!this.isLoggedIn) {
      this.router.navigate(['/login']); // If not logged in, redirect to login
    }
  }

  fetchTasks(){
    this.taskServices.getTasks().subscribe({
      next: (response) => {
        if (response.status === 'ok') {
          console.log(response.message)
          this.taskList = response.tasks
        }else{
          alert(response.message)
        }
      },
      error: (error) => {
        console.error('fetch failed:', error);
        alert('An error occurred while trying to fetch the tasks.');
      }
    })
  }

  addTask(task: Task){
    this.taskServices.addTask(task).subscribe({
      next: (response) => {
        if (response.status === 'ok') {
          this.taskList.push(response.task)
        } else {
          alert(response.message);
        }
      },
      error: (error) => {
        console.error('Login failed:', error);
        alert('An error occurred while trying to log in.');
      }
    });
  }

  deleteTask(task: Task){
    this.taskServices.deleteTask(task.id || '-1').subscribe({
      next: (response) => {
        if(response.status === 'ok'){
          this.taskList = this.taskList.filter((t) => t.id !== task.id)
        }else{
          alert(response.message)
        }
      },
      error: (error) => {
        console.error('delete task failed:', error);
        alert(`An error occurred while trying to delete the task of ID ${task.id}.`);
      }
    })
  }

  logout(){
    this.logoutServices.logout().subscribe({
      next: (response) => {
        if (response.status === 'ok') {
          localStorage.removeItem('authToken');
          this.router.navigate(['/login']);
        } else {
          alert(response.message);
        }
      },
      error: (error) => {
        console.error('Logout failed:', error);
        alert('An error occurred while trying to logout.');
      }
    });
  }

}
 