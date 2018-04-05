import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HolidayyearRemainingEmployeeComponent } from './holidayyear-remaining-employee.component';

describe('HolidayyearRemainingEmployeeComponent', () => {
  let component: HolidayyearRemainingEmployeeComponent;
  let fixture: ComponentFixture<HolidayyearRemainingEmployeeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HolidayyearRemainingEmployeeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HolidayyearRemainingEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
