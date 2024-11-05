import { Injectable } from '@angular/core';
import { User } from './models/user.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // userdata: User[] = [
  //   {
  //     id: 1,
  //     firstName: 'John',
  //     lastName: 'Doe',
  //     phoneNumber: '1234567890',
  //     gender: 'Male',
  //     email: 'john.doe@example.com',
  //     status: 'Active',
  //     todoCount: 2,
  //     todos: [
  //       { id: 101, title: 'Buy groceries', dueDate: new Date(), status: 'Pending' },
  //       { id: 102, title: 'Schedule meeting', dueDate: new Date(), status: 'Completed' }
  //     ]
  //   },
  //   {
  //     id: 2,
  //     firstName: 'Jane',
  //     lastName: 'Smith',
  //     phoneNumber: '0987654321',
  //     gender: 'Female',
  //     email: 'jane.smith@example.com',
  //     status: 'Inactive',
  //     todoCount: 1,
  //     todos: [
  //       { id: 201, title: 'Complete project report', dueDate: new Date(), status: 'Pending' }
  //     ]
  //   }
  // ];
  private apiBaseUrl = 'http://65.0.179.193:8080/api/users';  // Replace with the correct endpoint

  constructor(private http: HttpClient) {}

  // Fetch all users
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiBaseUrl}`);
  }
  
  // Method to retrieve all users
  // getUsers(): User[] {
  //   return this.userdata;
  // }
    // Fetch a specific user by ID
    getUserById(id: number): Observable<User> {
      return this.http.get<User>(`${this.apiBaseUrl}/${id}`);
    }
  
  // getUserById(id: number): User | undefined {
  //   return this.userdata.find(user => user.id === id);
  // }

  // Add a new user
  addUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.apiBaseUrl}`, user);
  }
  // addUser(newUser: User): void {
  //   this.userdata.push(newUser);
  // }

  // Update an existing user
  updateUser(user: User): Observable<User> {
    return this.http.put<User>(`${this.apiBaseUrl}/${user.id}`, user);
  }

  // updateUser(updatedUser: User): void {
  //   const index = this.userdata.findIndex(user => user.id === updatedUser.id);
  //   if (index !== -1) {
  //     this.userdata[index] = updatedUser;  // Update user data in the array
  //   }
  //}

   // Delete a user by ID
   deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiBaseUrl}/${id}`);
  }
  // deleteUser(id: number): void {
  //   this.userdata = this.userdata.filter(user => user.id !== id);
  // }
}
