import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsuariosDisponibles } from './usuarios-disponibles';

describe('UsuariosDisponibles', () => {
  let component: UsuariosDisponibles;
  let fixture: ComponentFixture<UsuariosDisponibles>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsuariosDisponibles],
    }).compileComponents();

    fixture = TestBed.createComponent(UsuariosDisponibles);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
