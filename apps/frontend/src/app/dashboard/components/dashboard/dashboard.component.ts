import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsModule } from 'primeng/tabs';
import { Article } from '../../interfaces/article';
import { MacroeconomicNewsService } from '../../services/macroeconomic-news.service';
import { LastArticleCardComponent } from '../../pages/last-article-card/last-article-card.component';
import { ArticleTableComponent } from '../../pages/article-table/article-table.component';
import { TableFooterComponent } from '../../pages/table-footer/table-footer.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, TabsModule, LastArticleCardComponent, ArticleTableComponent, TableFooterComponent],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  private readonly macroEconomicNews = inject(MacroeconomicNewsService);

  public isError = true;
  public articleListe: Article[] = [];
  public firstArticle: Article = { title: '', description: '', publicationDate: '', link: '' };

  public readonly streams = [
    { label: 'FT - Economic News', url: 'https://www.ft.com/rss/home',                        attr: '_cdata' },
    { label: 'WSJ - US',           url: 'https://feeds.a.dj.com/rss/WSJcomUSBusiness.xml',    attr: '_text'  },
    { label: 'WSJ - Markets',      url: 'https://feeds.a.dj.com/rss/RSSMarketsMain.xml',      attr: '_text'  },
  ];

  ngOnInit(): void {
    this.getStream(this.streams[0].url, this.streams[0].attr);
  }

  onTabChange(index: number): void {
    const stream = this.streams[index];
    this.getStream(stream.url, stream.attr);
  }

  getStream(url: string, attributeTitle: string): void {
    this.macroEconomicNews.getNews(url).subscribe({
      next: (result) => {
        this.articleListe = result.rss.channel.item.map((rawData: any) => {
          const description: { _cdata: string } | undefined = rawData?.description;
          return {
            title:           rawData.title[attributeTitle],
            description:     description?.['_cdata'] ?? '',
            publicationDate: rawData.pubDate['_text'],
            link:            rawData.link['_text'],
          };
        });
        this.sortArticleByDate(this.articleListe);
        this.firstArticle = this.articleListe[0];
        this.articleListe.shift();
        this.isError = false;
      },
      error: () => { this.isError = true; },
    });
  }

  sortArticleByDate(list: Article[]): void {
    list.sort((a, b) => Date.parse(b.publicationDate) - Date.parse(a.publicationDate));
  }
}