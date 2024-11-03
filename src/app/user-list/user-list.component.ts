import { Component } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, NgClass } from '@angular/common';
import { User } from '../models/user.model';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NgClass, FormsModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent {
  users: User[] = [];
  filteredUsers: User[] = [];
  selectedFilter: string = 'all';  // Default filter to show all users

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.users = this.userService.getUsers();
    this.applyFilter();  // Apply initial filter on load

    // this.userService.getUsers().subscribe(
    //   (data: User[]) => {
    //     this.users = data;
    //   },
    //   (error) => {
    //     console.error('Error fetching users:', error);
    //   }
    // );
  }
  addUser() {
    this.router.navigate(['/user',0]); // Navigate to UserComponent with empty form for adding a new user
  }

  editUser(userId: number) {
    // Navigate to the edit user page
    this.router.navigate(['/user', userId]);
  }

  manageTodos(userId: number) {
    // Navigate to the to-do management page for the user
    this.router.navigate(['/todos', userId]);
  }
  deleteUser(userId: number) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(userId);
      this.loadUsers();  // Refresh the list after deletion
    }
  }
  applyFilter() {
    switch (this.selectedFilter) {
      case 'lessThan5':
        this.filteredUsers = this.users.filter(user => {
          console.log(`Filtering user with todoCount: ${user.todoCount}`);  // Debugging log
          return user.todoCount < 5;
        });
        break;
        break;
      case 'lessThan10':
        this.filteredUsers = this.users.filter(user => user.todoCount < 10);
        break;
      case 'moreThan25':
        this.filteredUsers = this.users.filter(user => user.todoCount > 25);
        break;
      default:
        this.filteredUsers = [...this.users];  // Show all users if 'all' is selected
        break;
    }
    
  }
}
