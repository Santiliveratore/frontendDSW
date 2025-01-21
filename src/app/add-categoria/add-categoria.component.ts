import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormGroup,FormControl,ReactiveFormsModule, Validators } from '@angular/forms';
import { CatalogoService } from '../catalogo.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-categoria',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './add-categoria.component.html',
  styleUrl: './add-categoria.component.css'
})
export class AddCategoriaComponent {

  categoriaForm = new FormGroup({
    nombre: new FormControl('',Validators.required)
  });
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(private catalogoService: CatalogoService,
    private router: Router){};

  onSubmit(): void {
    if (this.categoriaForm.valid) {
      const categoria= this.categoriaForm.value;
      // Llama al método del servicio para enviar los datos
      this.catalogoService.crearCategoria(categoria).subscribe({
        next: (response) => {
          console.log('Categoria creada:', response);  // Muestra la respuesta
          this.successMessage='Categoria creada correctamente';
        },
        error: (err) => {
          console.error('Error al crear producto:', err);  // Maneja el error
        }
      });
    
    }else {
      this.categoriaForm.markAllAsTouched();
      this.errorMessage = 'Por favor, completa todos los campos correctamente.';
    }
    }

}
