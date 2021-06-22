import {
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
} from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ResourcePointer } from 'sophize-datamodel';
import { AbstractDataProvider } from '../data-provider';
import { Helpers } from '../helpers';

@Component({
  selector: 'lib-activated-icon',
  templateUrl: './activated-icon.component.html',
})
export class ActivatedIconComponent implements OnChanges, OnDestroy {
  @Input()
  machinePtr: ResourcePointer;

  activated$ = new BehaviorSubject<boolean>(null);
  beliefsetSubscription: Subscription;

  constructor(
    private dataProvider: AbstractDataProvider,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.beliefsetSubscription = this.dataProvider.inUseBeliefset$.subscribe(
      (_) => this.resetIcon()
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (Helpers.hasChangedPtr(changes, 'machinePtr')) {
      this.resetIcon();
    }
  }

  ngOnDestroy() {
    this.beliefsetSubscription.unsubscribe();
  }

  resetIcon() {
    if (!this.machinePtr || !this.dataProvider.inUseBeliefset$.value) {
      this.setActivatedValue(null);
      return;
    }
    this.dataProvider
      .getMachineStatus(
        this.machinePtr,
        this.dataProvider.inUseBeliefset$.value
      )
      .subscribe((status) => this.setActivatedValue(status));
  }

  setActivatedValue(value: boolean) {
    this.activated$.next(value);
    this.changeDetectorRef.markForCheck();
  }
}
