import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkfreedaysCreateComponent } from './workfreedays-create.component';

describe('WorkfreedaysCreateComponent', () => {
  let component: WorkfreedaysCreateComponent;
  let fixture: ComponentFixture<WorkfreedaysCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkfreedaysCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkfreedaysCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
