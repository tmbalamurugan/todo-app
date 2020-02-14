import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Todo } from '../_model';

@Injectable({ providedIn: 'root' })
export class TodoService {
    constructor(private http: HttpClient) { }

    getAll(userId: any) {
        return this.http.post('api/todo/list', { id: userId });
    }
    save(todo: Todo) {
        return this.http.post('api/todo/save', todo);
    }
}

