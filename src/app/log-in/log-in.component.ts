import { Component } from '@angular/core';
import { FormArray,FormBuilder,FormControl,FormGroup,ReactiveFormsModule,Validators } from '@angular/forms';
import { UsuarioService } from '../usuario.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-log-in',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './log-in.component.html',
  styleUrl: './log-in.component.css'
})
export class LogInComponent {

  loginForm = new FormGroup({
    email: new FormControl('',[Validators.required, Validators.email]),
    contraseña: new FormControl('',Validators.required)
  })
  errorMessage: string | null = null;

  constructor(private usuarioService: UsuarioService,
    private router: Router
  ) {}

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, contraseña } = this.loginForm.value;

      // Llamamos al servicio de login
      this.usuarioService.login(email!, contraseña!).subscribe({
        next: (response) => {
          // Si el login es exitoso, guardamos el token
          this.usuarioService.storeToken(response.token);
          console.log('Login exitoso, token y usuario almacenados:', response.token);

          // Redirigimos al usuario al catálogo
          this.router.navigate(['']);
        },
        error: (err) => {
          // Mostrar un mensaje de error basado en la respuesta del servidor
          if (err.status === 404) {
            this.errorMessage = 'Usuario no encontrado';
          } else if (err.status === 401) {
            this.errorMessage = 'Contraseña incorrecta';
          } else {
            this.errorMessage = 'Error al iniciar sesión. Inténtalo de nuevo más tarde.';
          }
          console.error('Error en el login:', err);
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
      this.errorMessage = 'Por favor, completa todos los campos correctamente.';
      console.log('El formulario no es válido');
    }
  }

  

}

