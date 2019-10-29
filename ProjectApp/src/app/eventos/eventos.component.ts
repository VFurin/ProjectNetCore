import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css']
})

export class EventosComponent implements OnInit {

  eventos: any = [
    {
      EventoId: 1,
      Tema: 'Angular',
      Local: 'São Paulo'
    },
    {
      EventoId: 2,
      Tema: 'Dot .Net Core',
      Local: 'Rio de Janeiro',
    },
    {
      EventoId: 3,
      Tema: 'Angular e Dot .Net Core',
      Local: 'Belo Horizonte'
    }
  ];
  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.getEventos();
  }

  getEventos() {
    this.eventos = this.http.get('http://localhost:5000/api/values').subscribe(response => {
      this.eventos = response;
    }, error => {
      console.log(error);
    }
    );
  }
}
