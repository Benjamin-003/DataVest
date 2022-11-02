/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DossierComponent } from './dossier.component';

describe('DossierComponent', () => {
  let component: DossierComponent;
  let fixture: ComponentFixture<DossierComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DossierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DossierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
