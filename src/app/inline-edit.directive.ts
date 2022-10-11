import {
  Directive,
  Input,
  ElementRef,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';

@Directive({
  selector: '[inlineEdit]',
})
export class InlineEditDirective {
  constructor(private elementRef: ElementRef) {
    console.log(this.elementRef.nativeElement);
  }
}

@Directive({
  selector: '[inlineEditControls]',
})
export class InlineEditControlsDirective {
  constructor(
    private templateRef: TemplateRef<unknown>,
    private viewContainerRef: ViewContainerRef
  ) {}

  ngOnInit() {
    console.log('Controls');
    console.log(this.templateRef);
    this.viewContainerRef.createEmbeddedView(this.templateRef);
  }
}
