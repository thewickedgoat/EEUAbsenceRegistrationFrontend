import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { EmployeeComponent } from './employee/employee/employee.component';
import {RouterModule, Routes} from '@angular/router';
import {EmployeeService} from './services/employee.service';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { EmployeeListComponent } from './employee/employee-list/employee-list.component';
import {HttpClientModule} from '@angular/common/http';
import { EmployeeCreateComponent } from './employee/employee-create/employee-create.component';
import {DepartmentService} from './services/department.service';
import { CalendarComponent } from './calendar/calendar/calendar.component';
import {AbsenceService} from './services/absence.service';
import {AuthguardGuard} from './Authorization/authguard.guard';
import { LoginComponent } from './Login/login/login.component';
import { EmployeeEditComponent } from './employee/employee-edit/employee-edit.component';
import { DepartmentCreateComponent } from './department/department-create/department-create.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { AbsenceOverviewComponent } from './absence/absence-overview/absence-overview.component';
import { SidebarModule } from 'ng-sidebar';
import { AbsenceOverviewControllerComponent } from './absence/absence-overview/absence-overview-controller.component';
import { AbsenceConfirmationComponent } from './absence/absence-confirmation/absence-confirmation.component';
import { AbsenceConfirmationViewComponent } from './absence/absence-confirmation/absence-confirmation-view.component';
import { DepartmentComponent } from './department/department/department.component';
import { CommonCalendarComponent } from './calendar/common-calendar/common-calendar.component';
import { CommonCalendarViewComponent } from './calendar/common-calendar/common-calendar-view.component';
import {AuthenticationService} from './services/authentication.service';
import { OverviewComponent } from './holidayyear/overview/overview.component';
import { OverviewViewComponent } from './holidayyear/overview/overview-view.component';
import { MonthComponent } from './holidayyear/month/month.component';
import { MonthViewComponent } from './holidayyear/month/month-view.component';
import { AdminOverviewComponent } from './holidayyear/admin-overview/admin-overview.component';
import { AdminOverviewViewComponent } from './holidayyear/admin-overview/admin-overview-view.component';


const routes: Routes = [
  {path: 'employee/:id', canActivate: [AuthguardGuard], component: EmployeeComponent},
  {path: 'employees', canActivate: [AuthguardGuard], component: EmployeeListComponent},
  {path: 'employees/create', canActivate: [AuthguardGuard], component: EmployeeCreateComponent},
  {path: 'employees/profile/:id', canActivate: [AuthguardGuard], component: EmployeeEditComponent},
  {path: 'departments/create', canActivate: [AuthguardGuard], component: DepartmentCreateComponent},
  {path: 'calendar/:id/:year/:month', canActivate: [AuthguardGuard], component: CalendarComponent},
  {path: 'overview/:id', canActivate: [AuthguardGuard], component: OverviewComponent},
  {path: 'month/:month/:yearStart/:yearEnd', canActivate: [AuthguardGuard], component: MonthComponent},
  {path: 'common-calendar/:year/:month', canActivate: [AuthguardGuard], component: CommonCalendarComponent},
  {path: 'login', component: LoginComponent},
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
    OverviewViewComponent,
    MonthComponent,
    MonthViewComponent,
    AdminOverviewComponent,
    AdminOverviewViewComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes),
    NgbModule.forRoot(),
    SidebarModule.forRoot()
  ],
  providers: [EmployeeService, DepartmentService, AbsenceService, AuthguardGuard, AuthenticationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
