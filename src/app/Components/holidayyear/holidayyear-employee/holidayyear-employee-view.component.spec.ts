import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HolidayyearEmployeeViewComponent } from './holidayyear-employee-view.component';

describe('HolidayyearEmployeeViewComponent', () => {
  let component: HolidayyearEmployeeViewComponent;
  let fixture: ComponentFixture<HolidayyearEmployeeViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HolidayyearEmployeeViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HolidayyearEmployeeViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
