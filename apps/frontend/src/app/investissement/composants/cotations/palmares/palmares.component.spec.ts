/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PalmaresComponent } from './palmares.component';

describe('PalmaresComponent', () => {
  let component: PalmaresComponent;
  let fixture: ComponentFixture<PalmaresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PalmaresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PalmaresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
