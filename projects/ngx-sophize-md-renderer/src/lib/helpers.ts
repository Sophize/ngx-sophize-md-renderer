import { SimpleChanges } from '@angular/core';
import {
  Article,
  Page,
  PropositionPointer,
  Resource,
  ResourcePointer,
  ResourceType,
  Term,
  TruthStatus,
  TruthValue,
} from 'sophize-datamodel';

export class Helpers {
  static readonly GLOBAL_DATASET_NAME = 'global';

  public static isNonEmptyList(list: any[]): boolean {
    return !!list?.length;
  }

  public static getTruthValIconColor(
    positiveAffirmed: boolean,
    negativeAffirmed: boolean
  ) {
    if (positiveAffirmed && negativeAffirmed) {
      return 'purple';
    } else if (positiveAffirmed) {
      return 'green';
    } else if (negativeAffirmed) {
      return 'red';
    } else {
      return 'gray';
    }
  }

  public static getTruthValueIconColor(truthValue: TruthValue) {
    if (!truthValue) return Helpers.getTruthValIconColor(false, false);

    switch (truthValue) {
      case TruthValue.True:
        return Helpers.getTruthValIconColor(true, false);
      case TruthValue.False:
        return Helpers.getTruthValIconColor(false, true);
      case TruthValue.Contradiction:
        return Helpers.getTruthValIconColor(true, true);
      default:
        return Helpers.getTruthValIconColor(false, false);
    }
  }

  public static getTruthValIcon(
    positiveAffirmed: boolean,
    negativeAffirmed: boolean,
    isAxiomatic: boolean
  ) {
    if (isAxiomatic) return '\uf192';
    // The following are codes for font-awesome icons.
    if (positiveAffirmed && negativeAffirmed) return '\uf06a';
    if (positiveAffirmed) return '\uf058';
    if (negativeAffirmed) return '\uf057';
    return '\uf059';
  }

  public static isPositiveAffirmed(truthStatus: TruthStatus) {
    return (
      truthStatus &&
      (ResourcePointer.isValid(truthStatus.activatedArgument) ||
        Helpers.isNonEmptyList(truthStatus.axiomParentList))
    );
  }

  public static isNegativeAffirmed(truthStatus: TruthStatus) {
    return (
      truthStatus &&
      (ResourcePointer.isValid(truthStatus.negativeActivatedArgument) ||
        Helpers.isNonEmptyList(truthStatus.negativeAxiomParentList))
    );
  }

  public static isAxiomatic(truthStatus: TruthStatus) {
    return (
      truthStatus &&
      (Helpers.isNonEmptyList(truthStatus.axiomParentList) ||
        Helpers.isNonEmptyList(truthStatus.negativeAxiomParentList))
    );
  }

  public static findPage(pageId: string, pages: Page[]): Page {
    if (!pages || !pageId) return null;
    const atTopLevel = pages.find((page) => page.pageId === pageId);
    if (atTopLevel) return atTopLevel;
    for (const page of pages) {
      const childPages = page['childPages'];
      const childResult = this.findPage(pageId, childPages);
      if (childResult) return childResult;
    }
    return null;
  }

  public static copyText(text: string) {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = text;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

  public static hasChanged(
    changes: SimpleChanges,
    inputName: string,
    eqFun?: (one: any, two: any) => boolean
  ) {
    const fieldChanges = changes[inputName];
    if (!eqFun) {
      return (
        fieldChanges && fieldChanges.previousValue !== fieldChanges.currentValue
      );
    }
    return (
      fieldChanges &&
      !eqFun(fieldChanges.previousValue, fieldChanges.currentValue)
    );
  }

  public static hasChangedPtr(changes: SimpleChanges, inputName: string) {
    return this.hasChanged(changes, inputName, ResourcePointer.equals);
  }
  public static hasChangedPropPtr(changes: SimpleChanges, inputName: string) {
    return this.hasChanged(changes, inputName, PropositionPointer.equals);
  }

  public static getPartialLatexSections(
    query: string
  ): { text: string; isLatex: boolean }[] {
    if (!query) return [];
    const sections = [];
    let opened = false;
    let lastLocation = 0;
    for (let i = 0; i < query.length; i++) {
      if (query[i] === '$') {
        const text = query.substring(lastLocation, i);
        if (text.trim().length > 0) {
          sections.push({ text, isLatex: opened });
        }
        lastLocation = i + 1;
        opened = !opened;
      }
    }

    const endText = query.substring(lastLocation).trim();
    if (endText.length > 0) sections.push({ text: endText, isLatex: opened });
    return sections;
  }

  public static getPrimaryName(r: Resource) {
    if (!r) return '';
    const type = Helpers.getDisplayPtr(r).resourceType;
    if (type === ResourceType.TERM) {
      const phrase = (r as unknown as Term).phrase;
      if (phrase) return phrase;
    }
    if (type === ResourceType.ARTICLE) {
      const title = (r as unknown as Article).title;
      if (title) return title;
    }
    if (r.names && r.names[0]) return r.names[0];
    return '';
  }

  public static getDisplayPtr(
    r: Resource,
    defaultDatasetId?: string
  ): ResourcePointer {
    const ptr = r.assignablePtr || r.permanentPtr || r.ephemeralPtr;
    return ptr ? ResourcePointer.fromString(ptr, defaultDatasetId): null;
  }

  private constructor() {}
}
