import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { AbstractDataProvider } from './data-provider';
import { ActivatedIconComponent } from './icons/activated-icon.component';
import { TruthValueIconComponent } from './icons/truth-value-icon.component';
import { KeepHtmlPipe } from './keep-html.pipe';
import { MdLatexComponent } from './latex/md-latex.component';
import { MdPartialLatexComponent } from './latex/md-partial-latex.component';
import { ResourceDetailsComponent } from './overlay/resource-details/resource-details.component';
import { ResourceListDisplayComponent } from './overlay/resource-list-display/resource-list-display.component';
import { StringListDisplayComponent } from './overlay/string-list-display/string-list-display.component';
import { MdCommentLinkComponent } from './links/md-comment-link/md-comment-link.component';
import { MdLinkComponent } from './links/md-link/md-link.component';
import { MdPageLinkComponent } from './links/md-page-link/md-page-link.component';
import { MdResourceLinkComponent } from './links/md-resource-link/md-resource-link.component';
import { MdSimpleResourceLinkComponent } from './links/md-simple-resource-link/md-simple-resource-link.component';
import { LocalDataProvider, LOCAL_PROVIDER_SERVER_ADDRESS } from './local-data-provider';
import { MdBlockComponent } from './md-block/md-block.component';
import { MdEditorComponent } from './md-editor/md-editor.component';
import { MdInlineComponent } from './md-inline/md-inline.component';
import { MdViewerComponent } from './md-viewer/md-viewer.component';
import { ResourceOverlayComponent } from './overlay/resource-overlay/resource-overlay.component';

@NgModule({
  declarations: [
    MdEditorComponent,
    MdViewerComponent,
    MdBlockComponent,
    MdInlineComponent,

    MdCommentLinkComponent,
    MdLinkComponent,
    MdPageLinkComponent,
    MdResourceLinkComponent,

    TruthValueIconComponent,
    ActivatedIconComponent,

    MdLatexComponent,
    MdPartialLatexComponent,
    KeepHtmlPipe,

    MdSimpleResourceLinkComponent,
    ResourceOverlayComponent,
    ResourceDetailsComponent,
    StringListDisplayComponent,
    ResourceListDisplayComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,

    MatDialogModule,
    MatTooltipModule,

    // For resource overlay
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  exports: [MdViewerComponent, MdEditorComponent],
})
export class SophizeMdRendererModule {
  static forRoot(dataProvider): ModuleWithProviders<SophizeMdRendererModule> {
    if (typeof dataProvider === 'string') {
      const serverAddress = dataProvider;
      return {
        ngModule: SophizeMdRendererModule,
        providers: [
          { provide: AbstractDataProvider, useClass: LocalDataProvider },
          { provide: LOCAL_PROVIDER_SERVER_ADDRESS, useValue: serverAddress },
        ],
      };
    }

    return {
      ngModule: SophizeMdRendererModule,
      providers: [{ provide: AbstractDataProvider, useClass: dataProvider }],
    };
  }
}
