import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { LastArticleCardComponent } from './last-article-card.component';
import { Article } from '../../interfaces/article';

describe('LastArticleCardComponent', () => {
  let component: LastArticleCardComponent;
  let fixture: ComponentFixture<LastArticleCardComponent>;

  const mockArticle: Article = {
    title: 'Test Article Title',
    description: 'Test description',
    publicationDate: '2026-01-01T00:00:00Z',
    link: 'https://example.com/article',
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ LastArticleCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LastArticleCardComponent);
    component = fixture.componentInstance;
    component.firstArticle = mockArticle;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});