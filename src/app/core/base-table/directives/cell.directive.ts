import { Directive, TemplateRef } from '@angular/core';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[tPestCell]',
})
export class CellDirective {
  constructor(public template: TemplateRef<any>) {}
}
