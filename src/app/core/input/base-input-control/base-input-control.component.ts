import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NzSizeLDSType } from 'ng-zorro-antd/core/types';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { FormInputType, InputOptionData, InputControlValidator } from 'src/app/configs/base-input-constants';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { DelayedInputDirective } from 'src/app/helpers/delayed-input.directive';

@Component({
  selector: 't-pest-base-input-control',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzTypographyModule,
    NzIconModule,
    NzRadioModule,
    NzSelectModule,
    NzCardModule,
    NzSkeletonModule,
    DelayedInputDirective
  ],
  templateUrl: './base-input-control.component.html',
  styleUrls: ['./base-input-control.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BaseInputControlComponent {
  @Input() prefixIcon? = '';
  @Input() suffix?: string | TemplateRef<any> = '';
  @Input() type? = 'text';
  @Input() control!: FormControl;
  @Input() validators?: InputControlValidator[] = [];
  @Input() placeholder? = '';
  @Input() size?: NzSizeLDSType = 'large';
  @Input() span? = 24;
  @Input() labelSpan? = 24;
  @Input() label?:string|null = null;
  @Input() options?:Array<InputOptionData> = [];
  @Input() isRequired? = false;
  @Input() formType = FormInputType.input;
  @Input() textAreaRows? = 4;
  @Input() loading? = false;
  @Input() isDelayed? = false;

  @Output() inputChange = new EventEmitter<any>();
  @Output() delayedInput = new EventEmitter<string>();

  baseDelayedInputTime = 500;
  formInputType = {
    radio: FormInputType.radio,
    textArea : FormInputType.textArea,
    select: FormInputType.select
  }

  handleInputChange(value: any): void {
    this.inputChange.emit(value);
  }

  delayInputChange(e: any) {
    this.delayedInput.emit(e.target.value);
  }
}
