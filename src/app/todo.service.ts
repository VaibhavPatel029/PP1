// src/app/services/todo.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Todo } from './models/user.model';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private apiBaseUrl = 'http://65.0.179.193:8080/api/todos';  // Base URL for To-Do API

  constructor(private http: HttpClient) {}

  // Fetch all To-Dos for a specific user
  getTodosByUserId(userId: number): Observable<Todo[]> {
    return this.http.get<Todo[]>(`${this.apiBaseUrl}?userId=${userId}`);
  }

  // Add a new To-Do
  addTodo(todo: Todo): Observable<Todo> {
    return this.http.post<Todo>(`${this.apiBaseUrl}`, todo);
  }

  // Update an existing To-Do
  updateTodo(todo: Todo): Observable<Todo> {
    return this.http.put<Todo>(`${this.apiBaseUrl}/${todo.id}`, todo);
  }

  // Delete a To-Do by ID
  deleteTodo(todoId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiBaseUrl}/${todoId}`);
  }
}
