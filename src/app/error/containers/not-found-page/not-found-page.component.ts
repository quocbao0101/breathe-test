import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { Router } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzResultModule } from "ng-zorro-antd/result";
@Component({
  standalone: true,
  imports: [CommonModule, NzResultModule, NzButtonModule, TranslateModule],
  selector: "t-pest-not-found-page",
  templateUrl: './not-found-page.component.html',
  styleUrl: './not-found-page.component.less',
})
export class NotFoundPageComponent {
  router = inject(Router);

  handleClickHome() {
    this.router.navigate(['/']);
  }

}
