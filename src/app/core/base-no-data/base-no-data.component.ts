import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzResultModule } from 'ng-zorro-antd/result';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 't-pest-base-no-data',
  standalone: true,
  imports: [CommonModule, NzResultModule, TranslateModule],
  templateUrl: './base-no-data.component.html',
  styleUrls: ['./base-no-data.component.less'],
})
export class BaseNoDataComponent {}
