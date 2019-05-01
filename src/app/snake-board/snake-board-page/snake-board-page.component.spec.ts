import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SnakeBoardPageComponent } from './snake-board-page.component';

describe('SnakeBoardPageComponent', () => {
  let component: SnakeBoardPageComponent;
  let fixture: ComponentFixture<SnakeBoardPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SnakeBoardPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SnakeBoardPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
