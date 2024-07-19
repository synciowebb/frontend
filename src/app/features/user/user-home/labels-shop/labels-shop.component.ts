import { Component } from '@angular/core';
import { Label } from 'src/app/core/interfaces/label';
import { LabelService } from 'src/app/core/services/label.service';
import { UserService } from 'src/app/core/services/user.service';
import { UserResponse } from 'src/app/features/authentication/login/user.response';
import { PaymentService } from 'src/app/core/services/payment.service';
import { VNPay } from 'src/app/core/interfaces/vnpay';
import { HttpParams } from '@angular/common/http';
import { LabelResponse } from 'src/app/core/interfaces/label-response';
import { ToastService } from 'src/app/core/services/toast.service';
import { BillingService } from 'src/app/core/services/billing.service';
import { Billing } from 'src/app/core/interfaces/billing';
import { SelectItem } from 'primeng/api';

@Component({
  selector: 'app-labels-shop',
  templateUrl: './labels-shop.component.html',
  styleUrls: ['./labels-shop.component.scss'],
})
export class LabelsShopComponent {
  labelDialog: boolean = false;
  billOfUserDialog: boolean = false;
  submitted: boolean = false;
  labels!: LabelResponse[];
  label!: LabelResponse;
  vnpay!: VNPay;
  type?: string;
  statuses?: any[];
  dateNow: any = null;
  user?: UserResponse | null =
    this.userService.getUserResponseFromLocalStorage();
  bills!: Billing[];
  sortOptions!: SelectItem[];
  sortOrder!: number;
  sortField!: string;
  sortKey!: string;

  constructor(
    private labelService: LabelService,
    private userService: UserService,
    private toastService: ToastService,
    private paymentService: PaymentService,
    private billingService: BillingService
  ) {}

  ngOnInit() {
    if (this.user?.id) {
      this.labelService.getLabelsWithPurchaseStatus(this.user?.id).subscribe({
        next: (data) => {
          console.log(data);
          this.labels = data;
          this.dateNow = Date.now();
          this.labels.forEach(
            (label) =>
              (label.type = label.labelURL
                ?.split('.')
                .pop()
                ?.toLocaleUpperCase())
          );
        },
        error: (error) => {
          console.error('Error fetching labels', error);
        },
      });
    }
    this.sortKey = 'price';
    this.sortOptions = [
      { label: 'Price High to Low', value: '!price' },
      { label: 'Price Low to High', value: 'price' },
    ];
  }

  onSortChange(event: any) {
    let value = event.value;

    if (value.indexOf('!') === 0) {
      this.sortOrder = -1;
      this.sortField = value.substring(1, value.length);
    } else {
      this.sortOrder = 1;
      this.sortField = value;
    }
  }
  hideDialog() {
    //this.selectedLabels = []; // xoá label đã chọn -> khi mở dialog lên sẽ không hiển thị label đã chọn
    this.labelDialog = false;
    this.submitted = false;
  }

  buyNow(label: Label) {
    this.submitted = true;

    if (label.id) {
      let params = new HttpParams().set('labelID', label.id);

      console.log('params: ' + params.toString());

      this.paymentService.createVNPayPayment(params).subscribe({
        next: (data) => {
          this.vnpay = data;
          console.log(data);

          if (this.vnpay.paymentURL) {
            window.location.href = this.vnpay.paymentURL;
          }
        },

        error: (error) => {
          this.toastService.showError('Error', error.error.message);
        },
      });
    }
  }

  gift(label: Label) {
    this.label = { ...label };
    this.labelDialog = true;
  }

  sendGift() {
    this.submitted = true;

    if (this.label.owner == null || this.label.owner == '') {
      this.toastService.showError(
        'Error',
        'Please enter username you want to send a gift'
      );
      return;
    }

    if (this.label.id) {
      let params = new HttpParams().set('labelID', this.label.id);

      if (this.label.owner) {
        params = params.set('owner', this.label.owner);
      }

      this.paymentService.createVNPayPayment(params).subscribe({
        next: (data) => {
          this.vnpay = data;
          console.log(data);

          if (this.vnpay.paymentURL) {
            window.location.href = this.vnpay.paymentURL;
          }
        },

        error: (error) => {
          this.toastService.showError('Error', error.error.message);
        },
      });
    }
  }

  openPurchaseHistory() {
    this.billOfUserDialog = true;
    this.billingService.getAllBillOfCurrentUser(this.user?.id || '').subscribe({
      next: (data) => {
        console.log(data);
        this.bills = data;
      },
      error: (error) => {
        console.error('Error fetching bills', error);
      },
    });
  }

  getSeverity(status: string) {
    switch (status) {
      case 'SUCCESS':
        return 'success';
      case 'PROCESSING':
        return 'warning';
      case 'FAILED':
        return 'danger';
      default:
        return 'info';
    }
  }
}
