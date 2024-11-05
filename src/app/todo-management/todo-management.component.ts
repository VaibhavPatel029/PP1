import { Component, OnInit } from '@angular/core';
import { Todo, User } from '../models/user.model';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../user.service';
import { CommonModule } from '@angular/common';
import { TodoService } from '../todo.service';

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
    private router: Router,
    private todoService: TodoService
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
      this.todoService.getTodosByUserId(this.userId).subscribe(
        (data: Todo[]) => {
          this.todos = data;
        },
        error => {
          console.error('Error loading todos:', error);
        }
      );
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

  // deleteTodo(todoId: number) {
  //   this.todos = this.todos.filter(todo => todo.id !== todoId);
  // }

  deleteTodo(todoId: number) {
    this.todoService.deleteTodo(todoId).subscribe(
      {next:() => {
      this.todos = this.todos.filter(todo => todo.id !== todoId);
    },
    error:(error) => {
      console.error('Error deleting todo:', error);
    }
    }
      // {next:() => {
      //   this.todos = this.todos.filter(todo => todo.id !== todoId);
      // },
      // error => {
      //   console.error('Error deleting todo:', error);
      // }}
    );
  }

  // submitTodoForm() {
  //   if (this.todoForm.valid) {
  //     const newTodo = { ...this.todoForm.value, id: this.isEditMode ? this.editingTodoId : Date.now() };
  //     if (this.isEditMode) {
  //       const index = this.todos.findIndex(todo => todo.id === this.editingTodoId);
  //       if (index !== -1) this.todos[index] = newTodo;
  //     } else {
  //       this.todos.push(newTodo);
  //     }
  //     this.showTodoForm = false;
  //   }
  // }

  submitTodoForm() {
    if (this.todoForm.valid) {
      const todoData: Todo = { ...this.todoForm.value, userId: this.userId!, id: this.editingTodoId || 0 };
      
      if (this.isEditMode) {
        this.todoService.updateTodo(todoData).subscribe(
          (updatedTodo: Todo) => {
            const index = this.todos.findIndex(todo => todo.id === updatedTodo.id);
            if (index !== -1) this.todos[index] = updatedTodo;
            this.showTodoForm = false;
          },
          error => {
            console.error('Error updating todo:', error);
          }
        );
      } else {
        this.todoService.addTodo(todoData).subscribe(
          (newTodo: Todo) => {
            this.todos.push(newTodo);
            this.showTodoForm = false;
          },
          error => {
            console.error('Error adding todo:', error);
          }
        );
      }
    }
  }

  cancelTodoForm() {
    this.showTodoForm = false;
    this.todoForm.reset();
  }
}
