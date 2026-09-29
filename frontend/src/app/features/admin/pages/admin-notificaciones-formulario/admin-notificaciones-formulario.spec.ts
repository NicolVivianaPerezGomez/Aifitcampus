import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminNotificacionesFormulario } from './admin-notificaciones-formulario';

describe('AdminNotificacionesFormulario', () => {
  let component: AdminNotificacionesFormulario;
  let fixture: ComponentFixture<AdminNotificacionesFormulario>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminNotificacionesFormulario],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminNotificacionesFormulario);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
