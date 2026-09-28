import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminHorariosFormulario } from './admin-horarios-formulario';

describe('AdminHorariosFormulario', () => {
  let component: AdminHorariosFormulario;
  let fixture: ComponentFixture<AdminHorariosFormulario>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminHorariosFormulario],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminHorariosFormulario);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
