import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TodoService, AuthenticationService } from '../_services';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent implements OnInit {

  todoForm: FormGroup;
  submitted = false;
  loading = false;
  todoList: Array<{ title: string, description: string }> = [];
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private todoService: TodoService,
    private authenticationService: AuthenticationService
  ) {
    this.listTode();
  }

  ngOnInit() {
    this.todoForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required]
    });

    this.listTode();
  }

  onSubmit() {
    console.log('this = ', this);
    this.submitted = true;

    // stop here if form is invalid
    if (this.todoForm.invalid) {
      alert('form invalid');
    }

    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));

    if (currentUser && currentUser.data && currentUser.data._id) {
      this.todoForm.value.createdBy = currentUser.data._id;
    }

    this.loading = true;
    this.todoService.save(this.todoForm.value)
      .pipe(first())
      .subscribe(
        (response: any) => {
          console.log('response.data ', response.data);
          this.todoList.push(response.data);
          this.todoForm.reset();
          this.router.navigate(['/todo']);
        },
        error => {
          console.log('error', error);
          if (error.status === 404) {
            alert(error.error.data);
          } else if (error.status === 403) {
            alert(error.error.message);
            this.router.navigate(['/login']);
          }
          this.loading = false;
        });
  }

  listTode() {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    let userId = '';
    if (currentUser && currentUser.data && currentUser.data._id) {
      userId = currentUser.data._id;
    }

    this.todoService.getAll(userId)
      .subscribe(
        (response: any) => {
          if (response && response.data) {
            this.todoList = response.data;
          }
          // this.todoList = response.data;
          this.router.navigate(['/todo']);
        },
        error => {
          console.log('error', error);
          if (error.status === 404) {
            alert(error.data);
          }
          this.loading = false;
        });
  }
}
