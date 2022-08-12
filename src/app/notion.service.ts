/* eslint-disable arrow-body-style */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { catchError, map } from 'rxjs/operators';
import { Expense } from './models/expense.model';

@Injectable({
  providedIn: 'root',
})
export class NotionService {
  constructor(private httpClient: HttpClient) {}

  getExpenses() {
    const params = {
      token: environment.apiToken,
    };
    return this.httpClient
      .get(`${environment.apiUrl}/expenses`, { params })
      .pipe(
        catchError((error) => {
          console.log(error);

          return null;
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
}
