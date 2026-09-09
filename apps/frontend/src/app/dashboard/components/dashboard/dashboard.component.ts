import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsModule } from 'primeng/tabs';
import { Article } from '../../interfaces/article';
import { MacroeconomicNewsService } from '../../services/macroeconomic-news.service';
import { LastArticleCardComponent } from '../../pages/last-article-card/last-article-card.component';
import { ArticleTableComponent } from '../../pages/article-table/article-table.component';
import { TableFooterComponent } from '../../pages/table-footer/table-footer.component';

interface RawArticle {
  title: Record<string, string>;
  description?: { _cdata?: string };
  pubDate: { _text: string };
  link: { _text: string };
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    TabsModule,
    LastArticleCardComponent,
    ArticleTableComponent,
    TableFooterComponent,
  ],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  private readonly macroEconomicNews = inject(MacroeconomicNewsService);

  public activeTab = 0;
  public isError = true;
  public articleListe: Article[] = [];
  public firstArticle: Article = {
    title: '',
    description: '',
    publicationDate: '',
    link: '',
  };

  public readonly streams = [
    {
      id: 'ft-economic',
      label: 'FT - Economic News',
      attr: '_cdata',
    },
    {
      id: 'wsj-us',
      label: 'WSJ - US',
      attr: '_text',
    },
    {
      id: 'wsj-markets',
      label: 'WSJ - Markets',
      attr: '_text',
    },
  ];

  ngOnInit(): void {
    this.getStream(this.streams[0].id, this.streams[0].attr);
  }

  onTabChange(index: number): void {
    this.activeTab = index;
    const stream = this.streams[index];
    this.getStream(stream.id, stream.attr);
  }

  getStream(feedId: string, attributeTitle: string): void {
    this.macroEconomicNews.getNews(feedId).subscribe({
      next: (result) => {
        this.articleListe = result.rss.channel.item.map(
          (rawData: RawArticle) => {
            const description = rawData.description;
            return {
              title: rawData.title[attributeTitle],
              description: description?.['_cdata'] ?? '',
              publicationDate: rawData.pubDate['_text'],
              link: rawData.link['_text'],
            };
          },
        );
        this.sortArticleByDate(this.articleListe);
        this.firstArticle = this.articleListe[0];
        this.articleListe.shift();
        this.isError = false;
      },
      error: () => {
        this.isError = true;
      },
    });
  }

  sortArticleByDate(list: Article[]): void {
    list.sort(
      (a, b) => Date.parse(b.publicationDate) - Date.parse(a.publicationDate),
    );
  }
}