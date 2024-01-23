import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzSpinModule } from 'ng-zorro-antd/spin';

@Component({
  selector: 't-pest-page-loading',
  standalone: true,
  imports: [CommonModule, NzSpinModule],
  templateUrl: './page-loading.component.html',
  styleUrls: ['./page-loading.component.less'],
})
export class PageLoadingComponent {}
