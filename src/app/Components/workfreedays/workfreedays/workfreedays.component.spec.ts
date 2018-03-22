import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkfreedaysComponent } from './workfreedays.component';

describe('WorkfreedaysComponent', () => {
  let component: WorkfreedaysComponent;
  let fixture: ComponentFixture<WorkfreedaysComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkfreedaysComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkfreedaysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
