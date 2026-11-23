import { Component, signal, computed, inject, OnInit, effect } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/models/product.model';
import { CategoryService } from '../../../core/services/category.service';
import { Category } from '../../../core/models/category.model';
@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './product-form.html',
  styleUrl: './product-form.css'
})
export class ProductFormComponent implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly categoryService = inject(CategoryService);

  categories = signal<Category[]>([]);
  categoriesLoading = signal(false);
  isEdit = signal(false);
  productId = signal<number | null>(null);
  loading = signal(false);
  saving = signal(false);
  error = signal<string | null>(null);
  toast = signal<{ message: string; type: 'success' | 'error' } | null>(null);

  imagePreview = signal<string | null>(null);
  loadCategories() {
  this.categoriesLoading.set(true);

  this.categoryService.getAll().subscribe({
    next: (res) => {
      this.categories.set(res.data);
      this.categoriesLoading.set(false);
    },
    error: () => {
      this.error.set('Impossible de charger les catégories.');
      this.categoriesLoading.set(false);
    }
  });
}

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    price: [null as number | null, [Validators.required, Validators.min(0)]],
    category_id: [null as number | null],
    description: [null as string | null],
    stock: [0, [Validators.required, Validators.min(0)]],
    sku: [null as string | null],
    image_url: [null as string | null],
    is_active: [1 as 0 | 1]
  });

  pageTitle = computed(() => this.isEdit() ? 'Modifier le produit' : 'Nouveau produit');
  submitLabel = computed(() => this.isEdit() ? 'Enregistrer les modifications' : 'Créer le produit');

  ngOnInit() {
      this.loadCategories();

  const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit.set(true);
      this.productId.set(Number(id));
      this.loadProduct(Number(id));
    }

    this.form.get('image_url')!.valueChanges.subscribe(val => {
      this.imagePreview.set(val || null);
    });
  }

  loadProduct(id: number) {
    this.loading.set(true);
    this.productService.getById(id).subscribe({
      next: (res) => {
        const p = res.data;
        this.form.patchValue({
          name: p.name,
          price: p.price,
          category_id: p.category_id,
          description: p.description,
          stock: p.stock,
          sku: p.sku,
          image_url: p.image_url,
          is_active: p.is_active
        });
        this.imagePreview.set(p.image_url);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Impossible de charger le produit.');
        this.loading.set(false);
      }
    });
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    const data = this.form.value as Partial<Product>;

    const obs = this.isEdit()
      ? this.productService.update(this.productId()!, data)
      : this.productService.create(data);

    obs.subscribe({
      next: (res) => {
        this.saving.set(false);
        const msg = this.isEdit() ? 'Produit mis à jour avec succès' : 'Produit créé avec succès';
        this.showToast(msg, 'success');
        setTimeout(() => this.router.navigate(['/products', res.data.id]), 1200);
      },
      error: () => {
        this.saving.set(false);
        this.showToast('Une erreur est survenue', 'error');
      }
    });
  }

  cancel() {
    if (this.isEdit()) {
      this.router.navigate(['/products', this.productId()]);
    } else {
      this.router.navigate(['/products']);
    }
  }

  showToast(message: string, type: 'success' | 'error') {
    this.toast.set({ message, type });
    setTimeout(() => this.toast.set(null), 3500);
  }

  hasError(field: string, error?: string): boolean {
    const ctrl = this.form.get(field);
    if (!ctrl || !ctrl.touched || !ctrl.invalid) return false;
    return error ? ctrl.hasError(error) : ctrl.invalid;
  }

  get isActiveValue(): boolean {
    return this.form.get('is_active')!.value === 1;
  }

  toggleActive() {
    const current = this.form.get('is_active')!.value;
    this.form.get('is_active')!.setValue(current === 1 ? 0 : 1);
  }
}
