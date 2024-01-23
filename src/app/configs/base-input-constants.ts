import { TemplateRef } from '@angular/core';
import { NzSizeLDSType } from 'ng-zorro-antd/core/types';

export interface InputControlValidator {
  type: string;
  message: string;
}

export interface InputOptionData {
  label: string;
  value: string | number;
}

export enum FormInputType {
  input = 'input',
  radio = 'radio',
  select = 'select',
  textArea = 'textArea',
}

export interface UIFormData {
  id?: number | null;
  label?: string | null;
  prefixIcon?: string | null;
  suffix?: string | TemplateRef<any> | null;
  type?: string | null;
  controlName: string;
  validators?: Array<InputControlValidator>;
  placeholder?: string;
  size?: NzSizeLDSType;
  inputSpan?: number;
  labelSpan?: number;
  options?: Array<InputOptionData>;
  isRequired?: boolean;
  formType: FormInputType;
  loading?: boolean;
  isDelayed?: boolean;
  handleDelayedInput?: any;
  inputChange?: any;
  isReadOnly?: boolean;
}
