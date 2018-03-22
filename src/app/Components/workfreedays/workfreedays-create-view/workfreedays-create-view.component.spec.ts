import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkfreedaysCreateViewComponent } from './workfreedays-create-view.component';

describe('WorkfreedaysCreateViewComponent', () => {
  let component: WorkfreedaysCreateViewComponent;
  let fixture: ComponentFixture<WorkfreedaysCreateViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkfreedaysCreateViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkfreedaysCreateViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
