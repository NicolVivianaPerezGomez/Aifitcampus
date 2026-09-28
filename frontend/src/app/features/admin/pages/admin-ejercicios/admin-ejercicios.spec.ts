import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminEjercicios } from './admin-ejercicios';

describe('AdminEjercicios', () => {
  let component: AdminEjercicios;
  let fixture: ComponentFixture<AdminEjercicios>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminEjercicios],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminEjercicios);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
