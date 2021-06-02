import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EventosComponent } from './eventos/eventos.component';
import { PalestrantesComponent } from './palestrantes/palestrantes.component';
import { ContatosComponent } from './contatos/contatos.component';


const routes: Routes = [
  {path: 'dashboard', component: DashboardComponent},
  {path: 'eventos', component: EventosComponent},
  {path: 'palestrantes', component: PalestrantesComponent},
  {path: 'contatos', component: ContatosComponent},
  {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
  {path: '**', redirectTo: 'dashboard', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
