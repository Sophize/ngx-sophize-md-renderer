import { BehaviorSubject, Observable } from 'rxjs';
import {
  Language,
  Page,
  Resource,
  ResourcePointer,
  TruthStatus,
} from 'sophize-datamodel';

export abstract class AbstractDataProvider {
  abstract getResources(ptr: ResourcePointer[]): Observable<Resource[]>;

  abstract getPages(ptr: ResourcePointer): Observable<Page[]>;

  abstract getTruthStatus(
    beliefsetPtr: ResourcePointer,
    targetPtr: ResourcePointer
  ): Observable<TruthStatus>;

  abstract getMachineStatus(
    beliefsetPtr: ResourcePointer,
    machinePtr: ResourcePointer
  ): Observable<boolean>;

  abstract getLatexDefs(l: Language, keys: string[]): Observable<string[]>;

  abstract getResourceNavRoute(resourcePtr: ResourcePointer): string;

  abstract getPageNavRoute(
    resourcePtr: ResourcePointer,
    pageId: string
  ): string;

  abstract getCommentFragment(commentId: number): string;

  abstract onResourceOverlayAction(
    resourcePtr: ResourcePointer,
    dialog?: any
  ): void;

  inUseBeliefset$: BehaviorSubject<ResourcePointer>;
}
