import { Component, OnInit, ViewChild } from '@angular/core';
import {
  AlertController,
  IonRefresher,
  IonRouterOutlet,
  ModalController,
  PopoverController,
} from '@ionic/angular';
import { InfoComponent } from '../info/info.component';
import { Expense } from '../models/expense.model';
import { NotionService } from '../notion.service';
import { NewExpenseComponent } from '../pages/home/new-expense/new-expense.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  @ViewChild('refresher') refreshser: IonRefresher;
  isLoading = true;
  expenses: Expense[] = [];
  expectedBalance: number;
  isRefreshingExpenses = false;
  isRefreshingExpectedBalance = false;

  constructor(
    private notionService: NotionService,
    private alertController: AlertController,
    private modalController: ModalController,
    private ionRouterOutlet: IonRouterOutlet,
    private popoverController: PopoverController
  ) {}

  async ngOnInit() {
    const token = localStorage.getItem('token');
    if (!token) {
      if (!(await this.promptFortoken())) {
        this.isLoading = false;
        return;
      }
    }

    this.getData();
  }

  getData() {
    this.notionService.getExpenses().subscribe((expenses: Expense[]) => {
      this.expenses = expenses;
      this.isLoading = false;

      this.isRefreshingExpenses = false;

      if (!this.isRefreshingExpectedBalance) {
        this.refreshser?.complete();
      }
    });

    this.notionService.getExpectedBalance().subscribe((balance: any) => {
      this.expectedBalance = balance.value;

      this.isRefreshingExpectedBalance = false;

      if (!this.isRefreshingExpenses) {
        this.refreshser?.complete();
      }
    });
  }

  async promptFortoken() {
    const a = await this.alertController.create({
      header: 'Notion Token',
      message: 'Please enter your Notion token',
      inputs: [
        {
          name: 'token',
          type: 'text',
          placeholder: 'Notion Token',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'OK',
        },
      ],
    });

    a.present();
    const { role, data } = await a.onDidDismiss();

    if (role === 'cancel') {
      return false;
    }

    if (!!data?.values?.token) {
      localStorage.setItem('token', data.values.token);
      return true;
    }

    return false;
  }

  async changeToken() {
    if (this.promptFortoken()) {
      this.getData();
    }
  }

  deleteExpense(expense: Expense) {
    this.notionService.deleteExpense(expense.id);
    this.expectedBalance += expense.amount;
    this.expenses = this.expenses.filter((e) => e.id !== expense.id);
  }

  completeExpense(id: string) {
    this.notionService.completeExpense(id);
    this.expenses = this.expenses.filter((e) => e.id !== id);
  }

  doRefresh() {
    this.isRefreshingExpenses = true;
    this.isRefreshingExpectedBalance = true;
    this.getData();
  }

  async showNewExpense() {
    const m = await this.modalController.create({
      component: NewExpenseComponent,
      presentingElement: this.ionRouterOutlet.nativeEl,
      canDismiss: true,
    });

    m.present();

    const { role, data } = await m.onDidDismiss();

    if (role !== 'created') {
      return;
    }

    this.expectedBalance -= data.amount;

    this.expenses.push(data);
  }

  async showInfo(e) {
    const p = await this.popoverController.create({
      component: InfoComponent,
      event: e,
    });

    p.present();
  }
}
