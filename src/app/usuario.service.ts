import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { API_URL } from './config/config'; // Importa la variable global de configuración

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private usuarioSubject = new BehaviorSubject<any>(null);
  private apiUrl = `${API_URL}/api/usuarios`; 
  private localidadesUrl = `${API_URL}/api/localidades`; 
  private usuarioActual: any = null;

  constructor(private http: HttpClient) {}

  // Método para registrarse
  crearUsuario(usuario: any): Observable<any> {
    usuario.rol = 'cliente';
    return this.http.post(this.apiUrl, usuario);
  }

  // Métodos para iniciar sesión

  // Iniciar sesión
  login(email: string, contraseña: string): Observable<any> {
    const loginData = { email, contraseña };
    return this.http.post(`${this.apiUrl}/login`, loginData);
  }

  // Almacenar el token en el localStorage
  storeToken(token: string): void {
    localStorage.setItem('authToken', token);
    this.getUsuarioActual();
  }

  // Obtener el token
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  // Obtener usuario actual
  getUsuarioActual(): { usuario: any } | null {
    const token = this.getToken();
    if (token) {
      try {
        // Decodifica el token para obtener la información del usuario
        const decodedToken: any = jwtDecode(token);
        this.usuarioSubject.next(decodedToken);
        return decodedToken;
      } catch (error) {
        console.error('Error al decodificar el token:', error);
        return null;
      }
    }
    return null;
  }

  // Observable del usuario actual
  getUsuarioObservable(): Observable<any> {
    return this.usuarioSubject.asObservable(); // Para que otros componentes puedan escuchar cambios
  }

  // Eliminar el token (logout)
  clearToken(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('usuario');
    this.usuarioActual = null;
    this.usuarioSubject.next(null);
  }

  // Verificar si hay sesión iniciada
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // Verifica si el usuario es admin, cliente o no está logueado
  isAdmin(): boolean | null {
    this.usuarioActual = this.getUsuarioActual();
    if (this.usuarioActual) {
      if (this.usuarioActual.rol === 'admin') return true;
      if (this.usuarioActual.rol === 'cliente') return false;
    }
    return null;
  }

  // Obtener localidades
  getLocalidades(): Observable<any> {
    return this.http.get<any>(this.localidadesUrl);
  }
}
