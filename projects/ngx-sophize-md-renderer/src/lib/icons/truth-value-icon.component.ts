import {
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { PropositionPointer, ResourceType } from 'sophize-datamodel';
import { AbstractDataProvider } from '../data-provider';
import { Helpers } from '../helpers';

@Component({
  selector: 'lib-truth-value-icon',
  templateUrl: './truth-value-icon.component.html',
})
export class TruthValueIconComponent implements OnDestroy, OnChanges {
  readonly P_GET = 'get_truth_status';

  @Input()
  propPtr: PropositionPointer;

  showIcon = true;

  icon = '\uf141';
  iconColor = 'gray';

  beliefsetSubscription: Subscription;

  constructor(
    private dataProvider: AbstractDataProvider,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.beliefsetSubscription = this.dataProvider.inUseBeliefset$.subscribe(
      (_) => this.resetIcon()
    );
  }

  ngOnDestroy() {
    this.beliefsetSubscription.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!Helpers.hasChangedPropPtr(changes, 'propPtr')) {
      return;
    }
    this.resetIcon();
  }

  resetIcon() {
    const beliefSetPtr = this.dataProvider.inUseBeliefset$.value;

    if (
      !beliefSetPtr ||
      !PropositionPointer.isValid(this.propPtr) ||
      this.propPtr.ptr.resourceType !== ResourceType.PROPOSITION
    ) {
      this.showIcon = false;
      this.changeDetectorRef.markForCheck();
      return;
    }

    this.icon = '\uf141';
    this.iconColor = 'gray';
    this.showIcon = true;
    this.changeDetectorRef.markForCheck();

    this.dataProvider.getTruthStatus(beliefSetPtr, this.propPtr.ptr).subscribe(
      (truthValueResponse) => {
        let positiveAffirmed = Helpers.isPositiveAffirmed(truthValueResponse);
        let negativeAffirmed = Helpers.isNegativeAffirmed(truthValueResponse);
        const isAxiomatic = Helpers.isAxiomatic(truthValueResponse);

        if (this.propPtr.negative) {
          [positiveAffirmed, negativeAffirmed] = [
            negativeAffirmed,
            positiveAffirmed,
          ];
        }
        this.icon = Helpers.getTruthValIcon(
          positiveAffirmed,
          negativeAffirmed,
          isAxiomatic
        );
        this.iconColor = Helpers.getTruthValIconColor(
          positiveAffirmed,
          negativeAffirmed
        );
        this.changeDetectorRef.markForCheck();
      },
      (err) => {
        this.showIcon = false;
        this.changeDetectorRef.markForCheck();
      }
    );
  }
}
