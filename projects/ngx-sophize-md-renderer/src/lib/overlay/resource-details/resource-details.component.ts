import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import {
  Language,
  Proposition,
  Resource,
  ResourcePointer,
  ResourceType,
  Term,
} from 'sophize-datamodel';
import {
  Argument,
  Article,
  Beliefset,
  Machine,
  Project,
} from 'sophize-datamodel/dist/types';
import { AbstractDataProvider } from '../../data-provider';
import { Helpers } from '../../helpers';

@Component({
  selector: 'lib-resource-details',
  templateUrl: './resource-details.component.html',
  styleUrls: ['./resource-details.component.css'],
})
export class ResourceDetailsComponent implements OnChanges {
  readonly JSON = JSON;
  readonly ResourceType = ResourceType;
  readonly Language = Language;

  @Input()
  resourcePtr = new ResourcePointer();

  existingResource: Resource;
  pageTitle = '';
  fetching = false;
  fetchError = '';

  constructor(private dataProvider: AbstractDataProvider) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['resourcePtr']) return;
    this.setPageTitle();
    this.fetching = true;
    this.dataProvider.getResources([this.resourcePtr]).subscribe(
      (resources) => {
        this.fetching = false;
        this.existingResource = resources?.[0];
        this.setPageTitle();
      },
      (_) => {
        this.fetching = false;
        this.fetchError = 'Could not fetch the resource';
      }
    );
  }

  topPtrId() {
    return '#' + this.resourcePtr.toString();
  }

  copyTopPtrId() {
    Helpers.copyText(this.topPtrId());
  }

  setPageTitle() {
    if (!this.existingResource) {
      this.pageTitle = this.resourcePtr.resourceType;
      return;
    }

    this.pageTitle =
      Helpers.getPrimaryName(this.existingResource) ||
      this.resourcePtr.resourceType;
    if (this.resourcePtr.resourceType === ResourceType.TERM) {
      this.pageTitle = (this.existingResource as Term).phrase;
      if ((this.existingResource as Term).language === Language.MetamathSetMm) {
        this.dataProvider
          .getLatexDefs(Language.MetamathSetMm, [this.pageTitle])
          .subscribe(
            (mdStrings) => (this.pageTitle = '$' + mdStrings[0] + '$')
          );
      }
    }
  }

  get citationStringList() {
    if (!this.existingResource?.citations) return [];
    return this.existingResource.citations.map((c) => c.textCitation);
  }

  get term() {
    return this.existingResource as Term;
  }

  get proposition() {
    return this.existingResource as Proposition;
  }

  get argument() {
    return this.existingResource as Argument;
  }

  get beliefset() {
    return this.existingResource as Beliefset;
  }

  get article() {
    return this.existingResource as Article;
  }

  get project() {
    return this.existingResource as Project;
  }

  get machine() {
    return this.existingResource as Machine;
  }

  get context() {
    return { contextPtr: this.resourcePtr };
  }
}
