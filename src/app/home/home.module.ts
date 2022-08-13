import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { NewExpenseComponent } from '../pages/home/new-expense/new-expense.component';
import { InfoComponent } from '../info/info.component';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, HomePageRoutingModule],
  declarations: [HomePage, NewExpenseComponent, InfoComponent],
})
export class HomePageModule {}
