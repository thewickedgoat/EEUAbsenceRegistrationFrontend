import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkfreedayComponent } from './workfreeday.component';

describe('WorkfreedayComponent', () => {
  let component: WorkfreedayComponent;
  let fixture: ComponentFixture<WorkfreedayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkfreedayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkfreedayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
