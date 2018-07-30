import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusDeleteComponent } from './status-delete.component';

describe('StatusDeleteComponent', () => {
  let component: StatusDeleteComponent;
  let fixture: ComponentFixture<StatusDeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatusDeleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatusDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
