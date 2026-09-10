
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { AccueilInvestirResponsableComponent } from './accueil-investir-responsable.component';

describe('AccueilInvestirResponsableComponent', () => {
  let component: AccueilInvestirResponsableComponent;
  let fixture: ComponentFixture<AccueilInvestirResponsableComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    declarations: [AccueilInvestirResponsableComponent]
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccueilInvestirResponsableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
