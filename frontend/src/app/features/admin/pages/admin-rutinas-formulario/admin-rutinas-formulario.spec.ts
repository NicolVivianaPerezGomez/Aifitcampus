import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminRutinasFormulario } from './admin-rutinas-formulario';

describe('AdminRutinasFormulario', () => {
  let component: AdminRutinasFormulario;
  let fixture: ComponentFixture<AdminRutinasFormulario>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminRutinasFormulario],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminRutinasFormulario);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
