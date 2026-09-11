import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { VideoInvestisseurComponent } from './video-investisseur.component';

describe('VideoInvestisseurComponent', () => {
  let component: VideoInvestisseurComponent;
  let fixture: ComponentFixture<VideoInvestisseurComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [VideoInvestisseurComponent]
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoInvestisseurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});