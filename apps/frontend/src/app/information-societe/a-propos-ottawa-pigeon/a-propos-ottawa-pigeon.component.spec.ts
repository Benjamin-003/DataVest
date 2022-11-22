/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AProposOttawaPigeonComponent } from './a-propos-ottawa-pigeon.component';

describe('AProposOttawaPigeonComponent', () => {
  let component: AProposOttawaPigeonComponent;
  let fixture: ComponentFixture<AProposOttawaPigeonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AProposOttawaPigeonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AProposOttawaPigeonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
