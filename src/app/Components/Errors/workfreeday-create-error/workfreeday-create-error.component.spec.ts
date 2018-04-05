import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkfreedayCreateErrorComponent } from './workfreeday-create-error.component';

describe('WorkfreedayCreateErrorComponent', () => {
  let component: WorkfreedayCreateErrorComponent;
  let fixture: ComponentFixture<WorkfreedayCreateErrorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkfreedayCreateErrorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkfreedayCreateErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
