/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CotationsComponent } from './cotations.component';

describe('CotationsComponent', () => {
  let component: CotationsComponent;
  let fixture: ComponentFixture<CotationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CotationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CotationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
