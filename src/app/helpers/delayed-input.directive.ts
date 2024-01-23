import {
  DestroyRef,
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent, timer } from 'rxjs';
import { debounce, distinctUntilChanged } from 'rxjs/operators';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[tPestDelayedInput]',
  standalone: true,
})
export class DelayedInputDirective implements OnInit {
  destroyRef = inject(DestroyRef);

  @Input() delayTime = 500;
  @Output() delayedInput = new EventEmitter<Event>();

  constructor(private elementRef: ElementRef<HTMLInputElement>) {}

  ngOnInit() {
    fromEvent(this.elementRef.nativeElement, 'input')
      .pipe(
        debounce(() => timer(this.delayTime)),
        distinctUntilChanged(
          (previous: string, current: string) => previous === current,
          (event: Event) => (event.target as HTMLInputElement).value
        ),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((e) => {
        this.delayedInput.emit(e)
      });
  }
}
