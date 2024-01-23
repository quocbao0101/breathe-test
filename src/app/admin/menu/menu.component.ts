import { Component, Input } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';

export interface MenuItem {
  id: number;
  title: string;
  icon?: string;
  activeIcon?: string;
  link: string;
  children: MenuItem[];
}

@Component({
  selector: 't-pest-menu',
  standalone: true,
  imports: [
    CommonModule,
    NzPopoverModule,
    NzButtonModule,
    RouterModule,
    NzMenuModule,
    NzToolTipModule,
    NzIconModule,
    NzLayoutModule,
  ],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.less'],
})
export class MenuComponent {
  @Input() isCollapsed = true;
  isClicked: boolean = false;
  currentRoute!: string;
  focusingMenuItem = null;

  menuItems: MenuItem[] = [
    {
      id: 1,
      title: 'Tổ chức',
      icon: 'qlydulieuIcon',
      activeIcon: 'qlydulieuIconActive',
      link: '/admin/tenants',
      children: [],
    },
    {
      id: 2,
      title: 'Người dùng',
      icon: 'nhapLieu',
      activeIcon: 'nhapLieuActive',
      link: '/admin/users',
      children: [],
    },
    {
      id: 3,
      title: 'Cài đặt',
      icon: 'settingIconDefault',
      activeIcon: 'settingIconActive',
      link: '/admin/settings',
      children: [
        {
          id: 4,
          title: 'Hình mẫu cây lúa',
          link: '/admin/settings/sample-images',
          children: [],
        },
        {
          id: 5,
          title: 'Hướng dẫn sử dụng',
          link: '/admin/settings/guide',
          children: [
            {
              id: 6,
              title: 'Website',
              link: '/admin/settings/guide/website',
              children: [],
            },
            {
              id: 7,
              title: 'Mobile',
              link: '/admin/settings/guide/mobile',
              children: [],
            }
          ],
        },
        {
          id: 8,
          title: 'Liên hệ hỗ trợ',
          link: '/admin/settings/support-contact',
          children: [],
        },
        {
          id: 9,
          title: 'Thời gian lữu trữ hình',
          link: '/admin/settings/resource-management',
          children: [],
        },
        {
          id: 10,
          title: 'Quản lý mẫu thông báo',
          link: '/admin/settings/notification-template',
          children: [],
        }
      ],
    },
  ];

  constructor(private router: Router) {
    this.currentRoute = this.router.url;
    this.router.events.pipe(takeUntilDestroyed()).subscribe((navigation) => {
      if (navigation instanceof NavigationEnd) {
        this.currentRoute = navigation.url;
      }
    });
  }
  toggleSider() {
    this.isCollapsed = !this.isCollapsed;
  }
  handleClick() {
    this.isClicked = !this.isClicked;
  }

  handleFocusMenuItem(item: any) {
    this.focusingMenuItem = item.id;
  }

  handleUnFocusMenuItem(isHasSub: boolean) {
    if (!isHasSub) this.focusingMenuItem = null;
  }

  handleOpenSubMenu(status: boolean) {    
    if (!status) {
      this.focusingMenuItem = null;
    }

  }
}
