import { Component, OnInit } from '@angular/core';
import { Article } from './../../interfaces/article';
import { MacroeconomicNewsService } from './../../services/macroeconomic-news.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [
  ]
})

export class DashboardComponent implements OnInit {
  public isError:boolean = true
  public articleListe: Article[] = []
  public firstArticle: Article = { title: "", description: "", publicationDate: "", link: "" }
  public items = [
    {
      label: 'FT - Economic News', command: () => {
        this.getStream('https://www.ft.com/rss/home','_cdata')
      }
    },
    {
      label: 'WSJ - US', command: () => {
        this.getStream('https://feeds.a.dj.com/rss/WSJcomUSBusiness.xml','_text')
      }
    },
    {
      label: 'WSJ - Markets', command: () => {
        this.getStream('https://feeds.a.dj.com/rss/RSSMarketsMain.xml','_text')
      }

    }]
  public activeItem = this.items[0];

  constructor(private macroEconomicNews: MacroeconomicNewsService) { }

  ngOnInit(): void {
    this.getStream('https://www.ft.com/rss/home','_cdata')
  }

  //Permet de remplir de tableau d'itération avec les données récupéré
  bindDatasToArray(articleListe: Article[]) {
    this.firstArticle = articleListe[0]
    this.articleListe.shift()
  }


  //Appel du flux RSS
  getStream(URL:string,attributeTitle:string) {
    this.macroEconomicNews.getNews(URL).subscribe(result => {
      this.articleListe = result.rss.channel.item.map(
        (rawData: any) => {
          let description: { _cdata: string } | undefined = rawData?.description;
          if (description === undefined)
            description = { _cdata: '' };
          return {
            title: rawData.title[attributeTitle],
            description: description['_cdata'],
            publicationDate: rawData.pubDate['_text'],
            link: rawData.link['_text']
          }
        })
      this.sortArticleByDate(this.articleListe)
      this.bindDatasToArray(this.articleListe)
      this.isError=false
    },error=>{
      this.isError=true
      }
    )
  }


  //Permet de trier les articles par ordre décroissant
  sortArticleByDate(list: Article[] | undefined) {
    return list?.sort(function (a, b): any {
      return Date.parse(b.publicationDate) - Date.parse(a.publicationDate);
    });
  }
}
