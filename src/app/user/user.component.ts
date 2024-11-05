import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../models/user.model';
import { HttpClientModule } from '@angular/common/http';
@Component({
  selector: 'app-user',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements OnInit{
  userForm: FormGroup;
  userId: number | null = null;
  isEditMode: boolean = false;
  user: User | undefined;

  constructor(private fb: FormBuilder, private userService: UserService,private route: ActivatedRoute, private router: Router,) {
    this.userForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(10)]],
      lastName: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(10)]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      gender: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      status: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!id;  // Check if ID is provided

    if (this.isEditMode && id != '0') {
      this.userId = Number(id);
      this.userService.getUserById(this.userId).subscribe(
        (data: User) => {
          this.user = data;
        },
        error => {
          console.error('Error fetching user:', error);
        }
      );
      // const user = this.userService.getUserById(this.userId);
      // if (user) {
      //   this.userForm.patchValue(user);
      // }
    }else{
      this.isEditMode = false; 
      this.user = {
        id: 0,
        firstName: '',
        lastName: '',
        phoneNumber: '',
        gender: '',
        email: '',
        status: 'Active',
        todoCount: 0
      };
    }
  }
  
  submitForm() {
    if (this.userForm.valid) {
      if (this.isEditMode) {
        // Edit mode: Update existing user
        // const updatedUser: User = {
        //   id: this.userId!,
        //   ...this.userForm.value
        // };
        // this.userService.updateUser(updatedUser);
        this.userService.updateUser(this.user as User).subscribe(
          () => {
            this.router.navigate(['/users']);
          },
          error => {
            console.error('Error updating user:', error);
          }
        );
      } else {
        // Add mode: Add new user
        // const newId = this.generateNewId();
        // const newUser: User = {
        //   id: newId,
        //   ...this.userForm.value
        // };
        // this.userService.addUser(newUser);

        this.userService.addUser(this.user as User).subscribe(
          () => {
            this.router.navigate(['/users']);
          },
          error => {
            console.error('Error adding user:', error);
          }
        );

      }
      //this.router.navigate(['/users']);  // Navigate back to the user list
    }
  }
  // private generateNewId(): number {
  //   const users = this.userService.getUsers();
  //   const maxId = users.reduce((acc, user) => (user.id > acc ? user.id : acc), 0);
  //   return maxId + 1;
  // }
}
