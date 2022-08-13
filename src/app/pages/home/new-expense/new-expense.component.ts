import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import {
  LoadingController,
  ModalController,
  ToastController,
} from '@ionic/angular';
import { Expense } from 'src/app/models/expense.model';
import { NotionService } from 'src/app/notion.service';
import { formatISO, parseISO } from 'date-fns';

@Component({
  selector: 'app-new-expense',
  templateUrl: './new-expense.component.html',
  styleUrls: ['./new-expense.component.scss'],
})
export class NewExpenseComponent implements OnInit {
  @ViewChild('form') form: NgForm;

  constructor(
    private modalController: ModalController,
    private notionService: NotionService,
    private toastController: ToastController,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {}

  onCancel() {
    this.modalController.dismiss();
  }

  async onSave() {
    if (this.form.form.invalid) {
      return;
    }

    const l = await this.loadingController.create();
    l.present();

    const expense: Expense = this.form.form.value;

    expense.date = formatISO(parseISO(expense.date), {
      representation: 'date',
    });

    console.log(expense.date);

    const res = await this.notionService.createExpense(expense).toPromise();

    l.dismiss();

    if (!res) {
      const t = await this.toastController.create({
        message: 'Error creating expense',
        duration: 2000,
      });
      t.present();

      return;
    }
    expense.id = res.id;

    this.modalController.dismiss(expense, 'created');
  }
}
