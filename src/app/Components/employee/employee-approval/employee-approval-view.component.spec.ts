import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeApprovalViewComponent } from './employee-approval-view.component';

describe('EmployeeApprovalViewComponent', () => {
  let component: EmployeeApprovalViewComponent;
  let fixture: ComponentFixture<EmployeeApprovalViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeApprovalViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeApprovalViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
