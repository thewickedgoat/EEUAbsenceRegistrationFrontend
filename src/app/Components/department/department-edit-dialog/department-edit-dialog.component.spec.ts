import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentEditDialogComponent } from './department-edit-dialog.component';

describe('DepartmentEditDialogComponent', () => {
  let component: DepartmentEditDialogComponent;
  let fixture: ComponentFixture<DepartmentEditDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DepartmentEditDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepartmentEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
