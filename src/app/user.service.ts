import { Injectable } from '@angular/core';
import { User } from './models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  userdata: User[] = [
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      phoneNumber: '1234567890',
      gender: 'Male',
      email: 'john.doe@example.com',
      status: 'Active',
      todoCount: 2,
      todos: [
        { id: 101, title: 'Buy groceries', dueDate: new Date(), status: 'Pending' },
        { id: 102, title: 'Schedule meeting', dueDate: new Date(), status: 'Completed' }
      ]
    },
    {
      id: 2,
      firstName: 'Jane',
      lastName: 'Smith',
      phoneNumber: '0987654321',
      gender: 'Female',
      email: 'jane.smith@example.com',
      status: 'Inactive',
      todoCount: 1,
      todos: [
        { id: 201, title: 'Complete project report', dueDate: new Date(), status: 'Pending' }
      ]
    }
  ];

  constructor() {}

  // Method to retrieve all users
  getUsers(): User[] {
    return this.userdata;
  }
  getUserById(id: number): User | undefined {
    return this.userdata.find(user => user.id === id);
  }
  addUser(newUser: User): void {
    this.userdata.push(newUser);
  }
  updateUser(updatedUser: User): void {
    const index = this.userdata.findIndex(user => user.id === updatedUser.id);
    if (index !== -1) {
      this.userdata[index] = updatedUser;  // Update user data in the array
    }
  }
  deleteUser(id: number): void {
    this.userdata = this.userdata.filter(user => user.id !== id);
  }
}
