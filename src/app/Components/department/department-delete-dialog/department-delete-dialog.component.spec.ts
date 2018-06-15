import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentDeleteDialogComponent } from './department-delete-dialog.component';

describe('DepartmentDeleteDialogComponent', () => {
  let component: DepartmentDeleteDialogComponent;
  let fixture: ComponentFixture<DepartmentDeleteDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DepartmentDeleteDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepartmentDeleteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
