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
import { MdContext } from 'sophize-md-parser';
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

  resource: Resource;
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
        this.resource = resources?.[0];
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
    if (!this.resource) {
      this.pageTitle = this.resourcePtr.resourceType;
      return;
    }

    this.pageTitle =
      Helpers.getPrimaryName(this.resource) || this.resourcePtr.resourceType;
    if (this.resourcePtr.resourceType === ResourceType.TERM) {
      this.pageTitle = (this.resource as Term).phrase;
      if ((this.resource as Term).language === Language.MetamathSetMm) {
        this.dataProvider
          .getLatexDefs(Language.MetamathSetMm, [this.pageTitle])
          .subscribe(
            (mdStrings) => (this.pageTitle = '$' + mdStrings[0] + '$')
          );
      }
    }
  }

  get citationStringList() {
    if (!this.resource?.citations) return [];
    return this.resource.citations.map((c) => c.textCitation);
  }

  get term() {
    return this.resource as Term;
  }

  get proposition() {
    return this.resource as Proposition;
  }

  get argument() {
    return this.resource as Argument;
  }

  get beliefset() {
    return this.resource as Beliefset;
  }

  get article() {
    return this.resource as Article;
  }

  get project() {
    return this.resource as Project;
  }

  get machine() {
    return this.resource as Machine;
  }

  get context(): MdContext {
    return {
      language: (this.resource as any)?.language || Language.Informal,
      lookupTerms: ResourcePointer.fromStringArr(
        (this.resource as any)?.lookupTerms || []
      ),
      contextPtr: this.resourcePtr,
    };
  }

  get simpleContext(): MdContext {
    return { contextPtr: this.resourcePtr };
  }
}
