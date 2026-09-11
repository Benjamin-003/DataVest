import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { AProposOttawaPigeonComponent } from './a-propos-ottawa-pigeon.component';

describe('AProposOttawaPigeonComponent', () => {
  let component: AProposOttawaPigeonComponent;
  let fixture: ComponentFixture<AProposOttawaPigeonComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ AProposOttawaPigeonComponent ]
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