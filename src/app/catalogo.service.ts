import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { UsuarioService } from './usuario.service';
import { API_URL } from './config/config';// Importa la variable global de configuración

@Injectable({
  providedIn: 'root'
})
export class CatalogoService {
  private baseUrl = `${API_URL}/api/productos`; 
  private categoriasUrl = `${API_URL}/api/categorias`; 
  private tiposUrl = `${API_URL}/api/tipo_productos`; 

  constructor(private http: HttpClient, private usuarioService: UsuarioService) {}

  // Obtener todos los productos
  getProductos() {
    return this.http.get<any>(this.baseUrl);
  }

  // Obtener productos por categoría
  getProductosPorCategoria(categoria: string) {
    return this.http.get<any>(`${this.baseUrl}?categoria=${categoria}`);
  }

  // Obtener todas las categorías
  getCategorias() {
    return this.http.get<any>(this.categoriasUrl);
  }

  // Obtener todos los tipos de productos
  getTipos() {
    return this.http.get<any>(this.tiposUrl);
  }

  // Eliminar un producto (solo si el usuario es admin)
  eliminarProducto(id: string, foto: string): Observable<any> {
    if (this.usuarioService.isAdmin()) {
      return this.http.delete(`${this.baseUrl}/${id}/${foto}`);
    } else {
      return throwError(() => new Error('No tienes permisos para eliminar el producto.'));
    }
  }

  // Crear un nuevo producto
  crearProducto(producto: any, im: File): Observable<any> {
    const formData = new FormData();
    formData.append('nombre', producto.nombre);
    formData.append('descripcion', producto.descripcion);
    formData.append('precio', producto.precio.toString());
    formData.append('categoria', producto.categoria.toString());
    formData.append('tipo', producto.tipo.toString());
    formData.append('foto', im); // Agrega la imagen al FormData
    return this.http.post(this.baseUrl, formData);
  }

  // Crear una nueva categoría
  crearCategoria(categoria: any): Observable<any> {
    return this.http.post(this.categoriasUrl, categoria);
  }

  // Obtener un producto por su ID
  getProducto(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  // Editar un producto
  editProducto(id: number, producto: any, im: File | null): Observable<any> {
    const formData = new FormData();
    formData.append('nombre', producto.value.nombre);
    formData.append('descripcion', producto.value.descripcion);
    if (im != null) {
      formData.append('foto', im);
    }

    return this.http.put<any>(`${this.baseUrl}/${id}`, formData);
  }
}

