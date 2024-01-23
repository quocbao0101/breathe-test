import { Component, Input, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { RouterModule } from '@angular/router';

export interface HeaderBreadcrumbItem {
  text: string;
  link: string;
}

export interface HeaderBreadcrumb {
  list: Array<HeaderBreadcrumbItem>;
  active: string;
}

@Component({
  selector: 't-pest-page-header',
  standalone: true,
  imports: [CommonModule, NzBreadCrumbModule, RouterModule],
  templateUrl: './page-header.component.html',
  styleUrl: './page-header.component.less',
})
export class PageHeaderComponent {
  @Input() breadcrumb!: HeaderBreadcrumb;
  @Input() title!: string | TemplateRef<any>;
  @Input() rightContent?: TemplateRef<any>;

  isString(val: string | TemplateRef<any>): boolean { return typeof val === 'string'; }
}
