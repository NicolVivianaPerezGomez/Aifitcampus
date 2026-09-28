import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminEjerciciosFormulario } from './admin-ejercicios-formulario';

describe('AdminEjerciciosFormulario', () => {
  let component: AdminEjerciciosFormulario;
  let fixture: ComponentFixture<AdminEjerciciosFormulario>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminEjerciciosFormulario],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminEjerciciosFormulario);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
