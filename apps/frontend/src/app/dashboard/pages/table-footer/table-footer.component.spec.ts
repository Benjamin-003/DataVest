import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { TableFooterComponent } from './table-footer.component';
import { Article } from '../../interfaces/article';

describe('TableFooterComponent', () => {
  let component: TableFooterComponent;
  let fixture: ComponentFixture<TableFooterComponent>;

  const mockArticle: Article = {
    title: 'Test Article Title',
    description: 'Test description',
    publicationDate: '2026-01-01T00:00:00Z',
    link: 'https://example.com/article',
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ TableFooterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableFooterComponent);
    component = fixture.componentInstance;
    component.firstArticle = mockArticle;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});