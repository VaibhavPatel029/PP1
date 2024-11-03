import { Component, OnInit } from '@angular/core';
import { Todo } from '../models/user.model';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
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
    private userService: UserService
  ) {
    this.todoForm = this.fb.group({
      title: ['', Validators.required],
      dueDate: ['', Validators.required],
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

  openAddTodo() {
    this.showTodoForm = true;
    this.isEditMode = false;
    this.todoForm.reset({ status: 'Pending' });
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
