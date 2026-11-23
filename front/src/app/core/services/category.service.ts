
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  Category,
  CategoryListResponse,
  CategoryResponse
} from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:3000/api/categories';

  // Get all categories
  getAll(): Observable<CategoryListResponse> {
    return this.http.get<CategoryListResponse>(this.apiUrl);
  }

  // Get category by ID
  getById(id: number): Observable<CategoryResponse> {
    return this.http.get<CategoryResponse>(`${this.apiUrl}/${id}`);
  }

  // Create category
  create(data: { name: string }): Observable<CategoryResponse> {
    return this.http.post<CategoryResponse>(this.apiUrl, data);
  }

  // Update category
  update(id: number, data: { name: string }): Observable<CategoryResponse> {
    return this.http.put<CategoryResponse>(`${this.apiUrl}/${id}`, data);
  }

  // Delete category
  delete(id: number): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(
      `${this.apiUrl}/${id}`
    );
  }
}
