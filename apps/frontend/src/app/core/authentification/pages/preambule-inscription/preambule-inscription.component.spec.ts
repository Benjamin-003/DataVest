
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { PreambuleInscriptionComponent } from './preambule-inscription.component';

describe('PreambuleInscriptionComponent', () => {
  let component: PreambuleInscriptionComponent;
  let fixture: ComponentFixture<PreambuleInscriptionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PreambuleInscriptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreambuleInscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
