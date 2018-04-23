import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HolidayyearEmployeeComponent } from './holidayyear-employee.component';

describe('HolidayyearEmployeeComponent', () => {
  let component: HolidayyearEmployeeComponent;
  let fixture: ComponentFixture<HolidayyearEmployeeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HolidayyearEmployeeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HolidayyearEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
