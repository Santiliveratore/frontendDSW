import { CommonModule } from '@angular/common';
import { Component, OnInit} from '@angular/core';
import {FormGroup,FormControl,ReactiveFormsModule, Validators } from '@angular/forms';
import { CatalogoService } from '../catalogo.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-producto',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule,],
  templateUrl: './add-producto.component.html',
  styleUrl: './add-producto.component.css'
})
export class AddProductoComponent implements OnInit{
  selectedImage: File | null = null; // Imagen seleccionada
  imagePreview: string | ArrayBuffer | null = ''; // Vista previa de la imagen
  categorias:any=[]=[];
  tipos:any=[]=[];

  productoForm = new FormGroup({
    nombre: new FormControl('',Validators.required),
    descripcion: new FormControl('',Validators.required),
    precio: new FormControl('',Validators.required),
    foto: new FormControl('',Validators.required),
    categoria: new FormControl('',Validators.required),
    tipo: new FormControl('',Validators.required)
  });
  errorMessage: string | null = null;

  constructor(private catalogoService: CatalogoService,
    private router: Router){};

  ngOnInit(): void {
    this.catalogoService.getTipos().subscribe(response=>this.tipos=response.data)
    this.catalogoService.getCategorias().subscribe(response=>this.categorias=response.data)
    
    console.log(this.tipos);
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedImage = file;

      // Mostrar la vista previa de la imagen seleccionada
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }
  
  onSubmit(): void {
    if(this.selectedImage!=(null)){
      const im=this.selectedImage
      if (this.productoForm.valid) {
        const producto = this.productoForm.value;
        // Llama al método del servicio para enviar los datos
        this.catalogoService.crearProducto(producto,im).subscribe({
          next: (response) => {
            console.log('Producto creado:', response);  // Muestra la respuesta
            this.router.navigate(['']);
          },
          error: (err) => {
            console.error('Error al crear producto:', err);  // Maneja el error
          }
        });
      
      }else {
        this.productoForm.markAllAsTouched();
        this.errorMessage = 'Por favor, completa todos los campos correctamente.';
      }
    }else{
        this.productoForm.markAllAsTouched();
        this.errorMessage = 'Por favor, completa todos los campos correctamente.';
    }
    }
}