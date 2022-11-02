/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { LeJournalComponent } from './le-journal.component';

describe('LeJournalComponent', () => {
  let component: LeJournalComponent;
  let fixture: ComponentFixture<LeJournalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeJournalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeJournalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
