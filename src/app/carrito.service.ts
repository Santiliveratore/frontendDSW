import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from './config/config'; // Importa la variable global de configuración

@Injectable({
  providedIn: 'root',
})
export class CarritoService {
  private storageKey = 'carrito';
  private url = `${API_URL}/api/pedidos`; // URL base para pedidos

  constructor(private http: HttpClient) {}

  // Obtener el carrito desde localStorage
  obtenerCarrito() {
    const carrito = localStorage.getItem(this.storageKey);
    return carrito ? JSON.parse(carrito) : [];
  }

  // Obtener la cantidad de un producto en el carrito
  obtenerCantidadProducto(productoId: string): number {
    const carrito = this.obtenerCarrito();
    const linea = carrito.find((item: any) => item.producto.id === productoId);
    return linea ? linea.cantidad : 0;
  }

  // Guardar el carrito en localStorage
  guardarCarrito(carrito: any[]) {
    localStorage.setItem(this.storageKey, JSON.stringify(carrito));
  }

  // Agregar una línea de pedido al carrito
  agregarAlCarrito(producto: any, cantidad: number) {
    const carrito = this.obtenerCarrito();
    const lineaExistente = carrito.find((item: any) => item.producto.id === producto.id);

    if (lineaExistente) {
      // Si el producto ya está en el carrito, actualiza la cantidad
      lineaExistente.cantidad += cantidad;
    } else {
      // Si no, agrega una nueva línea de pedido
      carrito.push({ producto, cantidad });
    }

    // Guardar el carrito actualizado
    this.guardarCarrito(carrito);
  }

  // Eliminar una línea de pedido del carrito
  eliminarDelCarrito(productoId: string) {
    let carrito = this.obtenerCarrito();
    carrito = carrito.filter((item: any) => item.producto.id !== productoId);
    this.guardarCarrito(carrito);
  }

  // Limpiar el carrito (vaciarlo)
  limpiarCarrito() {
    localStorage.removeItem(this.storageKey);
  }

  // Crear un pedido
  crearPedido(lineas: any[], usuarioId: number): Observable<any> {
    const body = {
      lineas: lineas.map(linea => ({
        productoId: linea.producto.id,
        cantidad: linea.cantidad,
      })),
      usuarioId: usuarioId,
    };
    return this.http.post(this.url, body);
  }

  // Obtener pedidos por usuario
  obtenerPedidosPorUsuario(usuarioId: number): Observable<any> {
    return this.http.get(`${this.url}/filtrar/${usuarioId}`);
  }

  // Obtener todos los pedidos
  obtenerPedidos(): Observable<any> {
    return this.http.get<any>(this.url);
  }

  // Marcar pedido como entregado
  marcarComoEntregado(pedidoId: number): Observable<any> {
    return this.http.put<any>(`${this.url}/${pedidoId}`, { estado: 'Entregado' });
  }

  // Eliminar un pedido
  eliminarPedido(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}

