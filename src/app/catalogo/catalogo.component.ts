import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CatalogoService } from '../catalogo.service';
import { UsuarioService } from '../usuario.service';
import { RouterLink} from '@angular/router';
import { CarritoService } from '../carrito.service';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [RouterLink,CommonModule],
  templateUrl: './catalogo.component.html',
  styleUrl: './catalogo.component.css'
})
export class CatalogoComponent implements OnInit  {
  productos:any=[]=[];
  categorias:any=[]=[];
  usuario: any = null;
  selectedCategory: string = 'Todo';
  dropdownOpen: boolean = false;

  constructor(private service:CatalogoService,private usuarioService: UsuarioService,private carritoService: CarritoService){}

  ngOnInit(): void{
   // Nos suscribimos a los cambios del usuario
   this.usuarioService.getUsuarioObservable().subscribe(usuario => {
    this.usuario = usuario;
  });
  // Comprobamos si ya existe un usuario logueado al cargar el componente
  this.usuario = this.usuarioService.getUsuarioActual();

  //Obtengo lista de categorias
  this.service.getCategorias().subscribe(response=>this.categorias=response.data);

  //Obtengo lista de productos
  this.service.getProductos().subscribe(response=>this.productos=response.data);
    
  }

  isAdmin(): boolean|null {
    return this.usuarioService.isAdmin();
  }
  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }
  
  getProductos(){
    this.selectedCategory = 'Todo';
    this.service.getProductos().subscribe(response=>this.productos=response.data)};

  // Método para filtrar productos por categoría
  filtrarProductos(categoria: string): void {
    this.selectedCategory = categoria;
    this.service.getProductosPorCategoria(categoria).subscribe(response => {
      this.productos = response.data;
    });
  }

  eliminarProducto(productoId: string,fotoUrl:string): void {
    const confirmacion = window.confirm('¿Estás seguro de que deseas eliminar este producto?');
  
    if (confirmacion) {
      // Si el usuario confirma, proceder con la eliminación
      this.service.eliminarProducto(productoId,fotoUrl).subscribe({
        next: (response) => {
          console.log('Producto eliminado', response);
          // Eliminar el producto del arreglo local
          this.productos = this.productos.filter((p: any) => p.id !== productoId);
        },
        error: (err) => {
          console.error('Error eliminando el producto:', err);
        }
      });
    }
  }
  obtenerCantidadProductoEnCarrito(productoId: string): number {
    return this.carritoService.obtenerCantidadProducto(productoId);
  }
  
  agregarAlCarrito(producto: any, cantidad: number) {
    this.carritoService.agregarAlCarrito(producto, cantidad);
    console.log('Producto añadido al carrito');
  }
}
