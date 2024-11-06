import { Component, EventEmitter, Output } from '@angular/core';
import { Task } from '../../../../../types';

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.css'
})
export class LogoutComponent {
  @Output() onSubmitLogout: EventEmitter<Task> = new EventEmitter();

  constructor() {}

  onSubmit(): void {
    this.onSubmitLogout.emit();
  }
}
