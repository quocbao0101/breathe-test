import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { Router } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzResultModule } from "ng-zorro-antd/result";
@Component({
  selector: "t-pest-permission-denied-page",
  standalone: true,
  imports: [CommonModule, NzResultModule, NzButtonModule, TranslateModule],
  templateUrl: './permission-denied-page.component.html',
  styleUrl: './permission-denied-page.component.less',
})
export class PermissionDeniedPageComponent {
  router = inject(Router);
  handleClickHome() {
    this.router.navigate(['/']);
  }
}
