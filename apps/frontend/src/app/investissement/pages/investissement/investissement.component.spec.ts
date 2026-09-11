
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { InvestissementComponent } from './investissement.component';
import { ActivatedRoute } from '@angular/router';

describe('InvestissementComponent', () => {
  let component: InvestissementComponent;
  let fixture: ComponentFixture<InvestissementComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [InvestissementComponent],
     providers: [ { provide: ActivatedRoute, useValue: { snapshot: { paramMap: new Map() } } }]
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvestissementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
