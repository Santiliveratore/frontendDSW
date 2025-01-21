import { Component,OnInit,OnChanges} from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { UsuarioService } from '../usuario.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CarritoService } from '../carrito.service';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterOutlet,RouterLink,CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit{

  usuario: any = null;
  dropdownOpen = false; //menu desplegable
  

  constructor(private usuarioService: UsuarioService, private router: Router,private carritoService: CarritoService) {}

  ngOnInit(): void {

    // Nos suscribimos a los cambios del usuario
    this.usuarioService.getUsuarioObservable().subscribe(usuario => {
      this.usuario = usuario;
    });
    // Comprobamos si ya existe un usuario logueado al cargar el componente
    this.usuario = this.usuarioService.getUsuarioActual();

   
  }

 

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen; // activar/desactivar menu desplegable
  }

  isLoggedIn(): boolean {
    return this.usuarioService.isLoggedIn();
  }

  logOut(): void {
    this.usuarioService.clearToken();
    this.carritoService.limpiarCarrito();
    this.router.navigate(['/logIn']);
    this.usuario = null;  // Limpiar usuario actual
  }
  isAdmin(): boolean|null {
    return this.usuarioService.isAdmin();
  }

}

