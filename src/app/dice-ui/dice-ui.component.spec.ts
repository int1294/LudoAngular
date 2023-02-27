import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiceUIComponent } from './dice-ui.component';

describe('DiceUIComponent', () => {
  let component: DiceUIComponent;
  let fixture: ComponentFixture<DiceUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiceUIComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiceUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
