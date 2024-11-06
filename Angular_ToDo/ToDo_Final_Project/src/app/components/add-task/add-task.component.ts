import { Component, EventEmitter, Output } from '@angular/core';
import { Task } from '../../../types';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.css'
})
export class AddTaskComponent {
  @Output() onSubmitTask: EventEmitter<Task> = new EventEmitter();
  taskForm: FormGroup;
  task!: Task

  constructor(private fb: FormBuilder){
    this.taskForm = this.fb.group({
      taskContent: ['', [Validators.required]],
    });
  }

  // Getter for easy access to form fields
  get f() { return this.taskForm.controls; }

  onSubmit(): void {
    if(!this.taskForm.value.taskContent){
      alert('Please fill in the task!')
      return
    }
    this.task = {
      taskContent : this.taskForm.value.taskContent
    }
    this.onSubmitTask.emit(this.task)
    this.taskForm.reset();
  }
}
