/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CryptomonnaieComponent } from './cryptomonnaie.component';

describe('CryptomonnaieComponent', () => {
  let component: CryptomonnaieComponent;
  let fixture: ComponentFixture<CryptomonnaieComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CryptomonnaieComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CryptomonnaieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
