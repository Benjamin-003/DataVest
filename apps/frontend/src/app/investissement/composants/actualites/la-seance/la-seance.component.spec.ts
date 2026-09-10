
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { LaSeanceComponent } from './la-seance.component';

describe('LaSeanceComponent', () => {
  let component: LaSeanceComponent;
  let fixture: ComponentFixture<LaSeanceComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    declarations: [LaSeanceComponent]
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LaSeanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
