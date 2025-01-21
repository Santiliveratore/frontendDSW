import { CanActivateFn,Router } from '@angular/router';
import { inject } from '@angular/core';
import { UsuarioService } from '../usuario.service';

export const authGuard: CanActivateFn = (route, state) => {
  const usuarioService= inject(UsuarioService);
  const router= inject(Router);
  if(usuarioService.isLoggedIn()){
    return true
  }else{
    router.navigateByUrl('/logIn');
    return false
  }
}

export const notAuthGuard: CanActivateFn = (route, state) => {
  const usuarioService= inject(UsuarioService);
  const router= inject(Router);
  if(usuarioService.isLoggedIn()){
    router.navigateByUrl('');
    return false
  }else{
    return true
  }
}

export const authAdminGuard: CanActivateFn = (route, state) => {
  const usuarioService= inject(UsuarioService);
  const router= inject(Router);
  if(usuarioService.isAdmin()){
    return true
  }else{
    router.navigateByUrl('');
    return false
  }
}
