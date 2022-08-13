/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable arrow-body-style */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { catchError, map } from 'rxjs/operators';
import { Expense } from './models/expense.model';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotionService {
  constructor(private httpClient: HttpClient) {}

  getExpenses() {
    const token = localStorage.getItem('token');

    const params = {
      token,
    };
    return this.httpClient

      .get(`${environment.apiUrl}/expenses`, { params })
      .pipe(
        catchError((error) => {
          return of([]);
        }),
        map((res: any) => {
          return res?.pages?.map((page) => {
            const expense: Expense = {
              id: page.id,
              description: page.Description.value,
              amount: page.Amount.value,
              date: page.Date.value,
            };
            return expense;
          });
        })
      );
  }

  getExpectedBalance() {
    const token = localStorage.getItem('token');

    const params = {
      token,
    };

    return this.httpClient
      .get(`${environment.apiUrl}/expected-balance`, {
        params,
      })
      .pipe(catchError(() => of(0)));
  }

  deleteExpense(id: string) {
    const token = localStorage.getItem('token');

    const params = {
      token,
      page_id: id,
    };

    this.httpClient
      .get(`${environment.apiUrl}/expense`, {
        params,
      })
      .subscribe();
  }

  completeExpense(id: string) {
    const token = localStorage.getItem('token');

    const params = {
      token,
      page_id: id,
    };

    this.httpClient
      .get(`${environment.apiUrl}/complete-expense`, {
        params,
      })
      .subscribe();
  }
  createExpense(expense: Expense) {
    const token = localStorage.getItem('token');

    const params = {
      token,
    };

    return this.httpClient
      .post(`${environment.apiUrl}/expense`, expense, { params })
      .pipe(
        catchError((err) => {
          console.log(err);

          return of(null);
        })
      );
  }
}
