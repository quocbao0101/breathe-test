import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzSpinModule } from 'ng-zorro-antd/spin';

@Component({
  standalone: true,
  imports: [
    NgIf,
    RouterModule,
    TranslateModule,
    NzSpinModule,
    NzMessageModule,
  ],
  providers: [
    TranslateService,
  ],
  selector: 't-pest-admin-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.less',
})
export class AppComponent implements OnInit {
  constructor(private translate: TranslateService) {
    // this language will be used as a fallback when a translation isn't found in the current language
    translate.setDefaultLang('vi-VN');

    // the lang to use, if the lang isn't available, it will use the current loader to get them
    translate.use('vi-VN');
  }
  loading = true;
  ngOnInit(): void {
    this.translate.get('last.dummy').subscribe({
      next: () => {
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }
}
