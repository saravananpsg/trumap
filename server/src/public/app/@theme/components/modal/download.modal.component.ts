import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ngx-modal',
  template: `
      <div class="modal-header">
        <span> {{modalHeader}} </span>
        <button class="close" aria-label="Close" (click)="dismissModal('dismiss')">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        {{ modalContent }}
      </div>
      <div class="modal-footer">
        <button class="btn btn-md btn-primary" (click)="closeModal()">Proceed</button>
      </div>
  `,
})
export class DownloadModalComponent {

  @Input() modalHeader;
  @Input() modalContent;

  constructor(private activeModal: NgbActiveModal) { }

  dismissModal(reason) {
    this.activeModal.dismiss(reason);
  }
  closeModal() {
    this.activeModal.close();
  }
}
