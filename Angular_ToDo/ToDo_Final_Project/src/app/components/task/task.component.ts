import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Task } from '../../../types';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task.component.html',
  styleUrl: './task.component.css'
})
export class TaskComponent {
  @Input() task!: Task; 
  @Output() onDeleteTask = new EventEmitter<Task>(); 

  onDelete(): void {
    this.onDeleteTask.emit(this.task); // Emit the task ID to delete
  }
}
