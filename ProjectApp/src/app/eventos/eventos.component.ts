import { Component, OnInit, TemplateRef } from '@angular/core';
import { EventoService } from '../_services/evento.service';
import { Evento } from '../_models/Evento';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { defineLocale, BsLocaleService, ptBrLocale } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
defineLocale('pt-br', ptBrLocale);

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css']
})

export class EventosComponent implements OnInit {

  titulo = 'Eventos';

  eventosFiltrados: Evento[];
  eventos: Evento[];

  evento: Evento;
  modSave = 'post';

  imagenLargura = 50;
  imagemMargem = 2;
  mostrarImagem = false;
  registerForm: FormGroup;
  bodyDeletarEvento = '';

  file: File;

  _filtroLista = '';

  constructor(
     private eventoService: EventoService,
     private modalService: BsModalService,
     private fb: FormBuilder,
     private localeService: BsLocaleService,
     private toastr: ToastrService
  ) {
    this.localeService.use('pt-br');
  }

  get filtroLista(): string {
    return this._filtroLista;
  }
  set filtroLista(value: string) {
    this._filtroLista = value;
    this.eventosFiltrados = this.filtroLista ? this.filtrarEventos(this.filtroLista) : this.eventos;
  }

  editEvento(evento: Evento, template: any) {
    this.modSave = 'put';
    this.openModal(template);
    this.evento = Object.assign({}, evento);
    this.evento.imagemURL = '';
    this.registerForm.patchValue(this.evento);
  }

  newEvento(template: any) {
    this.modSave = 'post';
    this.openModal(template);
  }

  openModal(template: any) {
    this.registerForm.reset();
    template.show();
  }

  excluirEvento(evento: Evento, template: any) {
    this.openModal(template);
    this.evento = evento;
    this.bodyDeletarEvento = `Tem certeza que deseja excluir o Evento: ${evento.tema}, Código: ${evento.id}`;
  }

  confirmeDelete(template: any) {
    this.eventoService.deleteEvento(this.evento.id).subscribe(
      () => {
          template.hide();
          this.getEventos();
          this.toastr.success('Deletado com Secesso!');
        }, error => {
          this.toastr.error(`Erro ao Deletar: ${error}`);
        }
    );
  }

  ngOnInit() {
    this.validation();
    this.getEventos();
  }

  filtrarEventos(filtrarPor: string): Evento[] {
    filtrarPor = filtrarPor.toLocaleLowerCase();
    return this.eventos.filter(
      evento => evento.tema.toLocaleLowerCase().indexOf(filtrarPor) !== - 1
    );
  }

  alternarImagem() {
    this.mostrarImagem = !this.mostrarImagem;
  }

  validation() {
    this.registerForm = this.fb.group({
      tema: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      local: ['', Validators.required],
      dataEvento: ['', Validators.required],
      imagemURL: ['', Validators.required],
      qtdPessoas: ['', [Validators.required, Validators.max(2000)]],
      telefone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]

    });
  }

  onFileChange(event) {
    const reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      this.file = event.target.files;

      console.log(this.file);
    }
  }

  uploadImagem() {
    const nomeArquivo = this.evento.imagemURL.split('\\', 3);
    this.evento.imagemURL = nomeArquivo[2];

    this.eventoService.postUpload(this.file, nomeArquivo[2]).subscribe();

  }

  salvarAlteracao(template) {
    if (this.registerForm.valid) {
      if (this.modSave === 'post') {
        this.evento = Object.assign({}, this.registerForm.value);

        this.uploadImagem();

        this.eventoService.postevento(this.evento).subscribe(
          (novoEvento: Evento) => {
            template.hide();
            this.getEventos();
            this.toastr.success('Inserido com Secesso!');
          }, error => {
            this.toastr.error(`Erro ao Inserir: ${error}`);
          }
        );
      } else {
        this.evento = Object.assign({id: this.evento.id}, this.registerForm.value);

        this.uploadImagem();

        this.eventoService.putevento(this.evento).subscribe(
          () => {
            template.hide();
            this.getEventos();
            this.toastr.success('Editado com Secesso!');
          }, error => {
            this.toastr.error(`Erro ao Editar: ${error}`);
          }
        );
      }
    }
  }

  getEventos() {
    this.eventoService.getAllEvento().subscribe(
      (_eventos: Evento[]) => {
      this.eventos = _eventos;
      console.log('Eventos', this.eventos);
      this.eventosFiltrados = this.eventos;
      }, error => {
        this.toastr.error(`Erro ao tentar Carregar eventos: ${error}`);
      }
    );
  }
}
