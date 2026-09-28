import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminRutinas } from './admin-rutinas';

describe('AdminRutinas', () => {
  let component: AdminRutinas;
  let fixture: ComponentFixture<AdminRutinas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminRutinas],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminRutinas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
