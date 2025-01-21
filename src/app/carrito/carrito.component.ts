import { Component, OnInit } from '@angular/core';
import { CarritoService } from '../carrito.service';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../usuario.service';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.css'
})
export class CarritoComponent implements OnInit {
  carrito: any[] = [];
  usuario:any;
  mensaje:any;

  constructor(private carritoService: CarritoService,private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.carrito = this.carritoService.obtenerCarrito();
    this.usuario = this.usuarioService.getUsuarioActual();
  }

  eliminarDelCarrito(productoId: string) {
    this.carritoService.eliminarDelCarrito(productoId);
    this.carrito = this.carritoService.obtenerCarrito(); // Actualizar el carrito
  }

  limpiarCarrito() {
    this.carritoService.limpiarCarrito();
    this.carrito = [];
  }

  // Método para calcular el precio total del carrito
  calcularTotal(): number {
    let total = 0;
  
    // Recorre el carrito y sumamos el precio por la cantidad
    this.carrito.forEach(item => {
     total += item.producto.precio * item.cantidad; 
    });
  
    return total;
  }

  
  realizarPedido() {
    if (!this.usuario) {
      this.mostrarMensaje('Usuario no autenticado', 'error');
      return;
    }
    // Llamar al método del servicio para realizar el pedido
    this.carritoService.crearPedido(this.carrito,this.usuario.id).subscribe({
      next: (response) => {
        console.log('Pedido realizado exitosamente:', response);
        this.mostrarMensaje('Pedido realizado con éxito', 'success');
        this.limpiarCarrito(); // Limpiar el carrito después de realizar el pedido
      },
      error: (error) => {
        console.error('Error al realizar el pedido:', error);
        alert('Error al realizar el pedido, intenta nuevamente.');
      }
    });
  }

  mostrarMensaje(mensaje: string, tipo: 'success' | 'error') {
    this.mensaje = { texto: mensaje, tipo: tipo };
    setTimeout(() => {
      this.mensaje = null; // Ocultar el mensaje después de unos segundos
    }, 3000);
  }

   // Incrementar la cantidad de un producto
   incrementarCantidad(productoId: string) {
    const producto = this.carrito.find((item) => item.producto.id === productoId);
    if (producto) {
      this.carritoService.agregarAlCarrito(producto.producto, 1);
      this.carrito = this.carritoService.obtenerCarrito(); // Reflejar cambios en el carrito
    }
  }

  // Decrementar la cantidad de un producto
  decrementarCantidad(productoId: string) {
    const producto = this.carrito.find((item) => item.producto.id === productoId);
    if (producto && producto.cantidad > 1) {
      producto.cantidad -= 1; // Reducir cantidad
      this.carritoService.guardarCarrito(this.carrito); // Guardar cambios en localStorage
    } else if (producto && producto.cantidad === 1) {
      this.eliminarDelCarrito(productoId); // Si llega a 1, eliminar del carrito
    }
    this.carrito = this.carritoService.obtenerCarrito(); // Reflejar cambios en el carrito
  }
}
