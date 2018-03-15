import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { EmployeeComponent } from './Components/employee/employee/employee.component';
import {RouterModule, Routes} from '@angular/router';
import {EmployeeService} from './services/employee.service';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { EmployeeListComponent } from './Components/employee/employee-list/employee-list.component';
import {HttpClientModule} from '@angular/common/http';
import { EmployeeCreateComponent } from './Components/employee/employee-create/employee-create.component';
import {DepartmentService} from './services/department.service';
import { CalendarComponent } from './Components/calendar/calendar-view/calendar.component';
import {AbsenceService} from './services/absence.service';
import {AuthguardGuard} from './Authorization/authguard.guard';
import { LoginComponent } from './Components/login/login.component';
import { EmployeeEditComponent } from './Components/employee/employee-edit/employee-edit.component';
import { DepartmentCreateComponent } from './Components/department/department-create/department-create.component';
import { ToolbarComponent } from './Components/toolbar/toolbar.component';
import { AbsenceOverviewComponent } from './Components/absence-overview/absence-overview.component';
import { SidebarModule } from 'ng-sidebar';
import { AbsenceOverviewControllerComponent } from './Components/absence-overview/absence-overview-controller.component';
import { AbsenceConfirmationComponent } from './Components/absence-confirmation/absence-confirmation.component';
import { AbsenceConfirmationViewComponent } from './Components/absence-confirmation/absence-confirmation-view.component';
import { DepartmentComponent } from './Components/department/department/department.component';
import { CommonCalendarComponent } from './Components/calendar/common-calendar/common-calendar.component';
import { CommonCalendarViewComponent } from './Components/calendar/common-calendar/common-calendar-view.component';
import {AuthenticationService} from './services/authentication.service';

import { OverviewComponent } from './Components/holidayyear/overview/overview.component';
import { MonthComponent } from './Components/holidayyear/month/month.component';
import { MonthViewComponent } from './Components/holidayyear/month/month-view.component';
import { AdminOverviewComponent } from './Components/holidayyear/admin-overview/admin-overview.component';
import { AdminOverviewViewComponent } from './Components/holidayyear/admin-overview/admin-overview-view.component';
import { CalendarViewComponent } from './Components/calendar/calendar-view/calendar-view.component';
import {MonthService} from './services/month.service';
import {HolidayyearService} from './services/holidayyear.service';
import { StatusViewComponent } from './Components/status-view/status-view.component';
import { StatusControllerComponent } from './Components/status-view/status-controller.component';
import {StatusService} from './services/status.service';
import { EmployeeStatisticsControllerComponent } from './Components/employee/employee-statistics/employee-statistics-controller.component';
import { EmployeeMonthStatisticsComponent } from './Components/employee/employee-statistics/employee-month-statistics/employee-month-statistics.component';
import { EmployeeYearStatisticsComponent } from './Components/employee/employee-statistics/employee-year-statistics/employee-year-statistics.component';


const routes: Routes = [
  {path: 'employee/:id', component: EmployeeComponent},
  {path: 'employees', component: EmployeeListComponent},
  {path: 'employees/create', component: EmployeeCreateComponent},
  {path: 'employees/profile/:id', component: EmployeeEditComponent},
  {path: 'departments/create', component: DepartmentCreateComponent},
  {path: 'calendar/:id/:year/:month', component: CalendarComponent},
  {path: 'overview/:id', component: OverviewComponent},
  {path: 'month/:month/:yearStart/:yearEnd', component: MonthComponent},
  {path: 'common-calendar/:year/:month', component: CommonCalendarComponent},
  {path: 'login', component: LoginComponent},
  {path: 'test/:yearStart', component: AdminOverviewComponent},
  {path: ' ', redirectTo: 'login'}

];


@NgModule({
  declarations: [
    AppComponent,
    EmployeeComponent,
    EmployeeListComponent,
    EmployeeCreateComponent,
    CalendarComponent,
    LoginComponent,
    EmployeeEditComponent,
    DepartmentCreateComponent,
    ToolbarComponent,
    AbsenceOverviewComponent,
    AbsenceOverviewControllerComponent,
    AbsenceConfirmationComponent,
    AbsenceConfirmationViewComponent,
    DepartmentComponent,
    CommonCalendarComponent,
    CommonCalendarViewComponent,
    OverviewComponent,
    MonthComponent,
    MonthViewComponent,
    AdminOverviewComponent,
    AdminOverviewViewComponent,
    CalendarViewComponent,
    StatusViewComponent,
    StatusControllerComponent,
    EmployeeStatisticsControllerComponent,
    EmployeeMonthStatisticsComponent,
    EmployeeYearStatisticsComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes),
    NgbModule.forRoot(),
    SidebarModule.forRoot()
  ],
  providers: [EmployeeService, DepartmentService, AbsenceService, AuthguardGuard, AuthenticationService, MonthService, HolidayyearService, StatusService],
  bootstrap: [AppComponent]
})
export class AppModule { }
