import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 't-pest-tenants',
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './tenants.component.html',
  styleUrls: ['./tenants.component.less'],
})
export class TenantsComponent {
}
