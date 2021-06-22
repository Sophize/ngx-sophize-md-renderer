import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {
  emptyTruthStatus,
  Language,
  Resource,
  ResourcePointer,
  ResourceType,
} from 'sophize-datamodel';
import { AbstractDataProvider } from './data-provider';
import { ResourceOverlayComponent } from './overlay/resource-overlay/resource-overlay.component';

export const LOCAL_PROVIDER_SERVER_ADDRESS = 'local-data-provider-server-address';

@Injectable()
export class LocalDataProvider implements AbstractDataProvider {
  metamathKeys = new Map<string, string>();
  constructor(
    @Inject(LOCAL_PROVIDER_SERVER_ADDRESS) private serverAddress: string,
    private http: HttpClient
  ) {
    console.log(serverAddress);
    this.http
      .get(serverAddress + '/metamath_set_mm_latex_map')
      .subscribe((response) => {
        for (const v in response) {
          this.metamathKeys[v] = response[v];
        }
      }, console.log);
  }

  getResource(ptr: ResourcePointer): Observable<Resource> {
    // TIP: Serve a directory using `http-server --cors="*"`
    const url = [
      this.serverAddress,
      ptr.datasetId,
      ptr.resourceShowId + '.json',
    ].join('/');

    return this.http.get(url).pipe(
      catchError((_) => of(null)),
      map((response) => {
        console.log(response);
        if (response) {
          response['assignablePtr'] = response['permanentPtr'] =
            '#' + ptr.toString();
        }
        return response as Resource;
      })
    );
  }

  getPages(ptr: ResourcePointer) {
    return of([]);
  }

  getTruthStatus(beliefsetPtr: ResourcePointer, targetPtr: ResourcePointer) {
    return of(emptyTruthStatus(beliefsetPtr, targetPtr));
  }

  getMachineStatus(beliefsetPtr: ResourcePointer, machinePtr: ResourcePointer) {
    return of(false);
  }

  getLatexDefs(language: Language, keys: string[]): Observable<string[]> {
    if (language !== Language.MetamathSetMm) return of(keys);
    return of(keys.map((key) => this.metamathKeys.get(key) || key));
  }

  getResourceNavRoute(resourcePtr: ResourcePointer): string {
    return [
      'https://sophize.org/s',
      resourcePtr.datasetId,
      resourcePtr.resourceShowId,
    ].join('/');
  }

  getPageNavRoute(resourcePtr: ResourcePointer, pageId: string): string {
    return [this.getResourceNavRoute(resourcePtr), pageId].join('/');
  }

  getCommentFragment(commentId: number): string {
    return !commentId ? undefined : 'comment-' + commentId;
  }

  onResourceOverlayAction(resourcePtr: ResourcePointer, dialog?: any): void {
    if (!ResourcePointer.isValid(resourcePtr) || !(dialog instanceof MatDialog))
      return;
    dialog.open(ResourceOverlayComponent, {
      data: resourcePtr,
      width: '150vw',
      maxWidth: '150vw',
    });
  }

  inUseBeliefset$ = new BehaviorSubject<ResourcePointer>(
    ResourcePointer.assignablePtr('wiki', ResourceType.BELIEFSET, 'default')
  );
}
