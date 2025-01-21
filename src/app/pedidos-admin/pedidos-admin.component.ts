import { Component,OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarritoService } from '../carrito.service';

@Component({
  selector: 'app-pedidos-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pedidos-admin.component.html',
  styleUrl: './pedidos-admin.component.css'
})
export class PedidosAdminComponent implements OnInit{

  pedidosPendientes: any[] = [];
  pedidosEntregados: any[] = [];

  constructor(private pedidoService: CarritoService){};

  ngOnInit(): void {
    this.obtenerPedidos();
  }

  obtenerPedidos() {
    this.pedidoService.obtenerPedidos().subscribe(
      (response) => {
        const pedidos = response.data;
        this.pedidosPendientes = pedidos.filter((pedido:any) => pedido.estado === 'Pendiente');
        this.pedidosEntregados = pedidos.filter((pedido:any) => pedido.estado === 'Entregado');
      },
      (error) => {
        console.error('Error al obtener los pedidos:', error);
      }
    );
  }

  marcarComoEntregado(pedidoId: number) {
    this.pedidoService.marcarComoEntregado(pedidoId).subscribe(
      () => {
        this.obtenerPedidos(); // Vuelve a obtener los pedidos para actualizar la vista
      },
      (error) => {
        console.error('Error al actualizar el estado del pedido:', error);
      }
    );
  }

}
