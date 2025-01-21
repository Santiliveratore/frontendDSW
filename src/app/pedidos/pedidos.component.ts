import { Component, OnInit } from '@angular/core';
import { CarritoService } from '../carrito.service';
import { UsuarioService } from '../usuario.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pedidos.component.html',
  styleUrl: './pedidos.component.css'
})
export class PedidosComponent implements OnInit {
  pedidos: any[] = [];
  usuario: any;

  constructor(private pedidoService: CarritoService, private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.usuario = this.usuarioService.getUsuarioActual(); // Obtener el usuario de la sesión
    this.obtenerPedidos();
  }

  obtenerPedidos() {
    if (this.usuario && this.usuario.id) {
      this.pedidoService.obtenerPedidosPorUsuario(this.usuario.id).subscribe(
        (data) => {
          this.pedidos = data;
        },
        (error) => {
          console.error('Error al obtener los pedidos:', error);
        }
      );
    }
  }

  eliminarPedido(id: number) {
    const confirmacion = confirm('¿Estás seguro de que deseas eliminar este pedido? Esta acción no se puede deshacer.');
  
    if (confirmacion) {
      this.pedidoService.eliminarPedido(id).subscribe(
        () => {
          // Filtramos el pedido eliminado de la lista de pedidos
          this.pedidos = this.pedidos.filter((pedido) => pedido.id !== id);
          alert('Pedido eliminado con éxito.');
        },
        (error) => {
          console.error('Error al eliminar el pedido:', error);
          alert('Ocurrió un error al intentar eliminar el pedido. Intenta nuevamente.');
        }
      );
    }
  }
  

}
