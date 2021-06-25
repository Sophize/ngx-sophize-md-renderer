import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { debounceTime, distinctUntilChanged, skip, take } from 'rxjs/operators';
import { Language, ResourcePointer } from 'sophize-datamodel';
import { CaseOption, MdContext } from 'sophize-md-parser';
import { AbstractDataProvider } from '../data-provider';
import { Helpers } from '../helpers';

const PREVIEW_TRIGGER_SET = /[#$()_+\[\]{}|~*<>=]/;

@Component({
  selector: 'sophize-md-editor',
  templateUrl: './md-editor.component.html',
  styleUrls: ['./md-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MdEditorComponent implements OnChanges {
  @Input()
  placeholder = '';

  @Input()
  formControl: FormControl;

  @Input()
  editingEnabled = true;

  @Input()
  context: ResourcePointer;

  @Input() // This is needed so that we can re-render when a page is switched.
  pageId: string;

  @Input()
  language = Language.Informal;

  @Input()
  lookupTerms: ResourcePointer[] = [];

  autoPreview = false;
  viewerContent = new BehaviorSubject<string>(' ');
  manualAction: boolean = null;

  constructor(private dataProvider: AbstractDataProvider) {}

  onFormControlUpdate() {
    // Special case to avoid initial load delay.
    this.formControl.valueChanges
      .pipe(take(1))
      .subscribe((_) => this.setViewerContent());
    this.formControl.valueChanges
      .pipe(skip(1), distinctUntilChanged(), debounceTime(1000))
      .subscribe((_) => this.setViewerContent());
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      // Everything except formControl.
      Helpers.hasChanged(changes, 'lookupTerms', ResourcePointer.listEquals) ||
      Helpers.hasChanged(changes, 'language') ||
      Helpers.hasChangedPtr(changes, 'context') ||
      Helpers.hasChanged(changes, 'pageId') ||
      Helpers.hasChangedPtr(changes, 'editingEnabled') ||
      Helpers.hasChanged(changes, 'placeholder')
    ) {
      this.setViewerContent();
    }
    if (Helpers.hasChanged(changes, 'formControl')) {
      this.onFormControlUpdate();
    }
  }

  get showPreview() {
    return this.manualAction || (this.manualAction == null && this.autoPreview);
  }

  setViewerContent() {
    const userInput = this.formControl.value;
    this.viewerContent.next(userInput || ' ');
    this.checkAutoPreview(userInput);
  }

  checkAutoPreview(content: string) {
    if (this.autoPreview) return;
    this.autoPreview =
      this.language === Language.MetamathSetMm ||
      PREVIEW_TRIGGER_SET.test(content);
  }

  get mdContext(): MdContext {
    return {
      inline: false,
      language: this.language,
      lookupTerms: this.lookupTerms,
      contextPtr: this.context,
      plainText: false,
      caseOption: CaseOption.DEFAULT_CASE,
    };
  }
}
