
import { Component, OnInit, signal, computed, inject, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Category } from '../../../core/models/category.model';
import { CategoryService } from '../../../core/services/category.service';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [FormsModule, ConfirmDialogComponent],
  templateUrl: './category-list.html',
  styleUrl: './category-list.css',
})
export class CategoryList implements OnInit {

  private categoryService = inject(CategoryService);

  // Confirm dialog
  confirmDialog = viewChild(ConfirmDialogComponent);

  // Categories
  categories = signal<Category[]>([]);

  // Loading and error
  loading = signal<boolean>(false);
  error = signal<string>('');

  // Form
  categoryName = signal<string>('');
  editingId = signal<number | null>(null);

  // Search
  searchTerm = signal<string>('');

  // Computed
  totalCategories = computed(() => this.categories().length);

  filteredCategories = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();

    return this.categories().filter(category =>
      category.name.toLowerCase().includes(term)
    );
  });

  ngOnInit(): void {
    this.loadCategories();
  }

  // GET: Load categories
  loadCategories(): void {
    this.loading.set(true);

    this.categoryService.getAll().subscribe({
      next: (response) => {
        this.categories.set(response.data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Error loading categories');
        this.loading.set(false);
      }
    });
  }

  // POST / PUT: Save category
  saveCategory(): void {
    const name = this.categoryName().trim();

    if (name.length < 2) {
      this.error.set('Name must contain at least 2 characters');
      return;
    }

    const id = this.editingId();

    const request = id !== null
      ? this.categoryService.update(id, { name })
      : this.categoryService.create({ name });

    request.subscribe({
      next: () => {
        this.resetForm();
        this.loadCategories();
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Operation failed');
      }
    });
  }

  // Prepare edit
  editCategory(category: Category): void {
    this.editingId.set(category.id);
    this.categoryName.set(category.name);
    this.error.set('');
  }

  // DELETE: Open confirmation dialog
  deleteCategory(id: number): void {
    this.confirmDialog()?.open({
      title: 'Supprimer la catégorie',
      message: 'Êtes-vous sûr de vouloir supprimer cette catégorie ?',
      confirmLabel: 'Supprimer',
      cancelLabel: 'Annuler',
      onConfirm: () => this.confirmDelete(id)
    });
  }

  // Confirm deletion
  private confirmDelete(id: number): void {
    this.categoryService.delete(id).subscribe({
      next: () => {
        this.error.set('');
        this.loadCategories();
      },
      error: (err) => {
        this.error.set(
          err.error?.message || 'Delete failed'
        );
      }
    });
  }

  
  resetForm(): void {
    this.categoryName.set('');
    this.editingId.set(null);
    this.error.set('');
  }
}
