import { Component, EventEmitter, Inject, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Subscription, merge } from 'rxjs';
import { startWith } from 'rxjs/operators';
import { Prof, User } from 'src/app/models/models';
import { UowService } from 'src/app/services/uow.service';

@Component({
  selector: 'app-profs',
  templateUrl: './profs.component.html',
  styleUrls: ['./profs.component.scss']
})
export class ProfsComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  // @ViewChild(MatSort, { static: true }) sort: MatSort;

  update = new EventEmitter();
  isLoadingResults = true;
  resultsLength = 0;

  subs: Subscription[] = [];

  dataSource: Prof[] = [];


  panelOpenState = false;

  nom = new UntypedFormControl('');
  prenom = new UntypedFormControl('');
  intro = new UntypedFormControl('');
  email = new UntypedFormControl('');
  tel = new UntypedFormControl('');
  adresse = new UntypedFormControl('');
  cin = new UntypedFormControl('');
  role = new UntypedFormControl('');
  isActive = new UntypedFormControl(0);
  idVille = new UntypedFormControl(0);


  villes = this.uow.villes.get();
  constructor(private uow: UowService, @Inject('BASE_URL') private url: string) { }

  ngOnInit(): void {
    const sub = merge(this.paginator.page, this.update).pipe(startWith(null as any)).subscribe(
      r => {
        r === true ? this.paginator.pageIndex = 0 : r = r;
        !this.paginator.pageSize ? this.paginator.pageSize = 12 : r = r;
        const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
        this.isLoadingResults = true;
        this.getPage(
          startIndex,
          this.paginator.pageSize,
          'id',
          'desc',
          // this.nom.value === '' ? '*' : this.nom.value,
          // this.prenom.value === '' ? '*' : this.prenom.value,
          // this.email.value === '' ? '*' : this.email.value,
          // this.tel.value === '' ? '*' : this.tel.value,
          // this.adresse.value === '' ? '*' : this.adresse.value,
          // this.cin.value === '' ? '*' : this.cin.value,
          // this.role.value === '' ? '*' : this.role.value,
          // this.idVille.value === 0 ? 0 : this.idVille.value,

        );
      }
    );



    this.subs.push(sub);
  }

  // tslint:disable-next-line: align
  getPage(startIndex, pageSize, sortBy, sortDir/*, nom, nomAr, idTypeActivite,*/) {
    const sub = this.uow.profs.getAll(startIndex, pageSize, sortBy, sortDir/*, nom, nomAr, idTypeActivite,*/).subscribe(
      (r: any) => {
        console.log(r);
        this.dataSource = r.list;
        this.resultsLength = r.count;
        this.isLoadingResults = false;
      }
    );

    this.subs.push(sub);
  }

  openLink(url: string) {
    window.open(url);
  }


  displayImage(urlImage: string, id: number) {
    if (!urlImage) {
      return 'assets/404.png';
    }
    if (urlImage && urlImage.startsWith('http')) {
      return urlImage;
    }

    return `${this.url}/users/${id}/${urlImage.replace(';', '')}`;
  }

  imgError(img: any) {
    img.src = 'assets/404.png';
  }

}
