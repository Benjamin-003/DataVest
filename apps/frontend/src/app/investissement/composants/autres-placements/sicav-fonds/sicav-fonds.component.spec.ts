/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SicavFondsComponent } from './sicav-fonds.component';

describe('SicavFondsComponent', () => {
  let component: SicavFondsComponent;
  let fixture: ComponentFixture<SicavFondsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SicavFondsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SicavFondsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
