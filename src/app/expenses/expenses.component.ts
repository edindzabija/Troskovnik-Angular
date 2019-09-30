import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { HttpSendService } from '../http-send.service';

interface AppState {
  appState: {
    access_token: string;
    incomes: object;
    expenses: object;
    income_categories: object;
    expense_categories: object;
  };
}

@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.scss']
})
export class ExpensesComponent implements OnInit {
  displayedColumns: string[] = [
    'category',
    'description',
    'entryDate',
    'amount'
  ];

  constructor(
    private store: Store<AppState>,
    private httpSendService: HttpSendService
  ) {}

  expenseTotal: number = 0;
  expenseArray: object[];
  loading: boolean = true;

  trackByFn(item, index) {
    return index;
  }

  deleteExpense($event) {
    this.httpSendService.deleteExpense($event.target.id);
  }

  handleMessage(message) {
    this.expenseTotal = 0;
    for (let item in message) {
      this.expenseTotal += parseFloat(message[item].amount);
    }
    let result = Object.keys(message).map(key => {
      return [Number(key), message[key]];
    });
    this.expenseArray = result;
    this.loading = false;
  }

  ngOnInit() {
    this.store
      .select(state => state.appState.expenses)
      .subscribe(message => (message ? this.handleMessage(message) : null));
  }
}
