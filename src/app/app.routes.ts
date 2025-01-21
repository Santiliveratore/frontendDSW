import { Routes } from '@angular/router';
import { CatalogoComponent } from './catalogo/catalogo.component';
import { LogInComponent } from './log-in/log-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { AddProductoComponent } from './add-producto/add-producto.component';
import { AddCategoriaComponent } from './add-categoria/add-categoria.component';
import { EditProductoComponent } from './edit-producto/edit-producto.component';
import { authGuard,notAuthGuard,authAdminGuard } from './guards/auth.guard';
import { CarritoComponent } from './carrito/carrito.component';
import { PedidosComponent } from './pedidos/pedidos.component';
import { PedidosAdminComponent } from './pedidos-admin/pedidos-admin.component';

export const routes: Routes = [
    {path:'',component:CatalogoComponent},
    {path:'logIn',component:LogInComponent,canActivate:[notAuthGuard]},
    {path:'signUp',component:SignUpComponent,canActivate:[notAuthGuard]},
    {path:'addProducto',component:AddProductoComponent,canActivate:[authAdminGuard]},
    {path:'addCategoria',component:AddCategoriaComponent,canActivate:[authAdminGuard]},
    {path:'editProducto/:id',component:EditProductoComponent,canActivate:[authAdminGuard]},
    {path:'carrito',component:CarritoComponent,canActivate:[authGuard]},
    {path:'pedidos',component:PedidosComponent,canActivate:[authGuard]},
    {path:'pedidosAdmin',component:PedidosAdminComponent,canActivate:[authAdminGuard]}
];
