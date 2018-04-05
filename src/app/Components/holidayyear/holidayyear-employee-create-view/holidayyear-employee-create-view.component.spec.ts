import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HolidayyearEmployeeCreateViewComponent } from './holidayyear-employee-create-view.component';

describe('HolidayyearEmployeeCreateViewComponent', () => {
  let component: HolidayyearEmployeeCreateViewComponent;
  let fixture: ComponentFixture<HolidayyearEmployeeCreateViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HolidayyearEmployeeCreateViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HolidayyearEmployeeCreateViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
