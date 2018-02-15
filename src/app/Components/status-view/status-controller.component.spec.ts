import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusControllerComponent } from './status-controller.component';

describe('StatusControllerComponent', () => {
  let component: StatusControllerComponent;
  let fixture: ComponentFixture<StatusControllerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatusControllerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatusControllerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
