import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Expense } from '../models/expense.model';
import { NotionService } from '../notion.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  isLoading = true;
  expenses: Expense[] = [];

  constructor(
    private notionService: NotionService,
    private alertController: AlertController
  ) {}

  async ngOnInit() {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log(await this.promptFortoken());
      return;
    }

    this.notionService.getExpenses().subscribe((expenses: Expense[]) => {
      this.expenses = expenses;
      this.isLoading = false;
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

  changeToken() {
    this.promptFortoken();
  }
}
