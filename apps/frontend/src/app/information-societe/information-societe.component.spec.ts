import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformationSocieteComponent } from './information-societe.component';

describe('InformationSocieteComponent', () => {
  let component: InformationSocieteComponent;
  let fixture: ComponentFixture<InformationSocieteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InformationSocieteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InformationSocieteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
