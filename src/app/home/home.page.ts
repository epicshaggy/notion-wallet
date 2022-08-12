import { Component, OnInit } from '@angular/core';
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
  constructor(private notionService: NotionService) {}

  ngOnInit(): void {
    this.notionService.getExpenses().subscribe((expenses: Expense[]) => {
      this.expenses = expenses;
      this.isLoading = false;
    });
  }
}
