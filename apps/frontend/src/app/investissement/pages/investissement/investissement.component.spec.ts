/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { InvestissementComponent } from './investissement.component';

describe('InvestissementComponent', () => {
  let component: InvestissementComponent;
  let fixture: ComponentFixture<InvestissementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvestissementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvestissementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
