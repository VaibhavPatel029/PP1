import { Component, OnInit } from '@angular/core';
import { Todo } from '../models/user.model';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-todo-management',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './todo-management.component.html',
  styleUrl: './todo-management.component.css'
})
export class TodoManagementComponent implements OnInit{
  todos: Todo[] = [];
  userId: number | null = null;
  todoForm: FormGroup;
  showTodoForm: boolean = false;
  isEditMode: boolean = false;
  editingTodoId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.todoForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(15)]],
      dueDate: ['', [Validators.required, this.dateWithinOneMonthValidator]],
      status: ['Pending', Validators.required]
    });
  }

  ngOnInit(): void {
    this.userId = Number(this.route.snapshot.paramMap.get('userId'));
    if (this.userId) {
      const user = this.userService.getUserById(this.userId);
      if (user) {
        this.todos = user.todos || [];
      }
    }
  }
  goBack() {
    this.router.navigate(['/users']);  // Navigate back to User List page
  }
  openAddTodo() {
    this.showTodoForm = true;
    this.isEditMode = false;
    this.todoForm.reset({ status: 'Pending' });
  }
  // Custom validator to check if the date is within one month from today
  dateWithinOneMonthValidator(control: any) {
    const selectedDate = new Date(control.value);
    const today = new Date();
    const oneMonthFromToday = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());

    return selectedDate >= today && selectedDate <= oneMonthFromToday ? null : { dateOutOfRange: true };
  }

  editTodo(todo: Todo) {
    this.showTodoForm = true;
    this.isEditMode = true;
    this.editingTodoId = todo.id;
    this.todoForm.patchValue(todo);
  }

  deleteTodo(todoId: number) {
    this.todos = this.todos.filter(todo => todo.id !== todoId);
  }

  submitTodoForm() {
    if (this.todoForm.valid) {
      const newTodo = { ...this.todoForm.value, id: this.isEditMode ? this.editingTodoId : Date.now() };
      if (this.isEditMode) {
        const index = this.todos.findIndex(todo => todo.id === this.editingTodoId);
        if (index !== -1) this.todos[index] = newTodo;
      } else {
        this.todos.push(newTodo);
      }
      this.showTodoForm = false;
    }
  }

  cancelTodoForm() {
    this.showTodoForm = false;
    this.todoForm.reset();
  }
}
