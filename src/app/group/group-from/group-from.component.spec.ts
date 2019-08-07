import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupFromComponent } from './group-from.component';

describe('GroupFromComponent', () => {
  let component: GroupFromComponent;
  let fixture: ComponentFixture<GroupFromComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupFromComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupFromComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
