import { Component,OnInit } from '@angular/core';
import {FormControl,FormGroup,ReactiveFormsModule,Validators } from '@angular/forms';
import { UsuarioService } from '../usuario.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})

export class SignUpComponent implements OnInit{

  userForm = new FormGroup({
    nombre: new FormControl('',Validators.required),
    apellido: new FormControl('',Validators.required),
    email: new FormControl('',[Validators.required, Validators.email]),
    contraseña: new FormControl('',Validators.required),
    localidad: new FormControl('',Validators.required)
    
  });
  errorMessage: string | null = null;
  localidades:any=[]=[];

  constructor(private usuarioService: UsuarioService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.usuarioService.getLocalidades().subscribe(response=>this.localidades=response.data)
  }
  onSubmit(){
    if (this.userForm.valid) {  // Verifica si el formulario es válido
      const usuario = this.userForm.value;  // Obtiene los valores del formulario

      // Llama al método del servicio para enviar los datos
      this.usuarioService.crearUsuario(usuario).subscribe({
        next: (response) => {
          console.log('Usuario creado:', response);  // Muestra la respuesta
          this.router.navigate(['']);
        },
        error: (err) => {
          if (err.status === 400) {
            this.errorMessage = 'El email ingresado ya ha sido utilizado';
          }
        }
      });
    } else {
      this.userForm.markAllAsTouched();
      this.errorMessage = 'Por favor, completa todos los campos correctamente.';
    }
  }

}
