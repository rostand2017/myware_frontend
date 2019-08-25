import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteGroupProjectComponent } from './delete-group-project.component';

describe('DeleteGroupProjectComponent', () => {
  let component: DeleteGroupProjectComponent;
  let fixture: ComponentFixture<DeleteGroupProjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteGroupProjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteGroupProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
