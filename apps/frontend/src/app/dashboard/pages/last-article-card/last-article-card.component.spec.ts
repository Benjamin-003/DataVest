/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { LastArticleCardComponent } from './last-article-card.component';

describe('LastArticleCardComponent', () => {
  let component: LastArticleCardComponent;
  let fixture: ComponentFixture<LastArticleCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LastArticleCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LastArticleCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
