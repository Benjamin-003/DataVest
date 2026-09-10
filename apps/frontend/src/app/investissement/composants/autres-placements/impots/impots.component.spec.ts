
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { ImpotsComponent } from './impots.component';

describe('ImpotsComponent', () => {
  let component: ImpotsComponent;
  let fixture: ComponentFixture<ImpotsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    declarations: [ImpotsComponent]
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImpotsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
