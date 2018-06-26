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
import {AuthguardGuard} from './Authguards/authguard.guard';
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
import {AuthenticationService} from './services/authentication.service';
import { MatDialogModule} from '@angular/material/';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatProgressBarModule} from '@angular/material/progress-bar';
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
import { EmployeeDeleteDialogComponent } from './Components/employee/employee-delete-dialog/employee-delete-dialog.component';
import { AdministrationComponent } from './Components/administration/administration/administration.component';
import { WorkfreedaysCreateViewComponent } from './Components/workfreedays/workfreedays-create-view/workfreedays-create-view.component';
import { AdministrationViewComponent } from './Components/administration/administration/administration-view.component';
import {WorkfreedayService} from './services/workfreeday.service';
import { WorkfreedaysComponent } from './Components/workfreedays/workfreedays/workfreedays.component';
import { PublicHolidayComponent } from './Components/workfreedays/public-holiday/public-holiday.component';
import { WorkfreedayComponent } from './Components/workfreedays/workfreeday/workfreeday.component';
import {HolidayYearSpecService} from './services/holidayyearspec.service';
import { PublicholidaysCreateViewComponent } from './Components/workfreedays/publicholidays-create-view/publicholidays-create-view.component';
import {PublicholidayService} from './services/publicholiday.service';
import { WorkfreedayCreateErrorComponent } from './Components/Errors/workfreeday-create-error/workfreeday-create-error.component';
import { UniversalErrorCatcherComponent } from './Components/Errors/universal-error-catcher/universal-error-catcher.component';
import { PublicholidayCreateErrorComponent } from './Components/Errors/publicholiday-create-error/publicholiday-create-error.component';
import { HolidayyearCreateViewComponent } from './Components/holidayyear/holidayyear-create/holidayyear-create-view.component';
import { HolidayyearEmployeeCreateViewComponent } from './Components/holidayyear/holidayyear-employee-create-view/holidayyear-employee-create-view.component';
import { HolidayyearAdministrationComponent } from './Components/holidayyear/holidayyear-administration/holidayyear-administration.component';
import { HolidayyearAdministrationViewComponent } from './Components/holidayyear/holidayyear-administration/holidayyear-administration-view.component';
import { HolidayyearListComponent } from './Components/holidayyear/holidayyear-list/holidayyear-list.component';
import { HolidayyearRemainingEmployeeComponent } from './Components/holidayyear/holidayyear-remaining-employee/holidayyear-remaining-employee.component';
import { PublicHolidayViewComponent } from './Components/workfreedays/public-holiday/public-holiday-view.component';
import { HolidayyearEmployeeComponent } from './Components/holidayyear/holidayyear-employee/holidayyear-employee.component';
import { HolidayyearEmployeeViewComponent } from './Components/holidayyear/holidayyear-employee/holidayyear-employee-view.component';
import {DateformatingService} from './services/dateformating.service';
import { PublicCalendarComponent } from './Components/calendar/public-calendar/public-calendar.component';
import { PublicCalendarViewComponent } from './Components/calendar/public-calendar/public-calendar-view.component';
import { DepartmentDeleteDialogComponent } from './Components/department/department-delete-dialog/department-delete-dialog.component';
import {AdminGuard} from './Authguards/admin.guard';


const routes: Routes = [
  {path: 'employee/:id', component: EmployeeComponent, canActivate: [AuthguardGuard]},
  {path: 'employees', component: EmployeeListComponent, canActivate: [AuthguardGuard]},
  {path: 'department/create', component: DepartmentCreateComponent, canActivate: [AuthguardGuard, AdminGuard]},
  {path: 'employees/create', component: EmployeeCreateComponent, canActivate: [AuthguardGuard]},
  {path: 'employees/profile/:id', component: EmployeeEditComponent, canActivate: [AuthguardGuard]},
  {path: 'calendar/:id/:year/:month', component: CalendarComponent, canActivate: [AuthguardGuard]},
  //{path: 'overview/:id', component: OverviewComponent, canActivate: [AuthguardGuard]},
  //{path: 'month/:month/:yearStart/:yearEnd', component: MonthComponent, canActivate: [AuthguardGuard]},
  {path: 'public-calendar/:month', component: PublicCalendarComponent, canActivate: [AuthguardGuard]},
  {path: 'login', component: LoginComponent},
  {path: 'holidayyears', component: HolidayyearAdministrationComponent, canActivate: [AuthguardGuard, AdminGuard]},
  {path: 'stats/:yearStart', component: AdminOverviewComponent, canActivate: [AuthguardGuard, AdminGuard]},
  //{path: 'work', component: AdministrationComponent, canActivate: [AuthguardGuard]},
  {path: '**', redirectTo: 'login'}

];


@NgModule({
  declarations: [
    AppComponent,
    AbsenceOverviewComponent,
    AbsenceOverviewControllerComponent,
    AbsenceConfirmationComponent,
    AbsenceConfirmationViewComponent,
    AdminOverviewComponent,
    AdminOverviewViewComponent,
    CalendarComponent,
    CalendarViewComponent,
    DepartmentComponent,
    DepartmentCreateComponent,
    EmployeeComponent,
    EmployeeCreateComponent,
    EmployeeEditComponent,
    EmployeeListComponent,
    EmployeeStatisticsControllerComponent,
    EmployeeMonthStatisticsComponent,
    EmployeeYearStatisticsComponent,
    EmployeeDeleteDialogComponent,
    LoginComponent,
    MonthComponent,
    MonthViewComponent,
    OverviewComponent,
    StatusViewComponent,
    StatusControllerComponent,
    ToolbarComponent,
    AdministrationComponent,
    WorkfreedaysCreateViewComponent,
    AdministrationViewComponent,
    WorkfreedaysComponent,
    PublicHolidayComponent,
    WorkfreedayComponent,
    PublicholidaysCreateViewComponent,
    WorkfreedayCreateErrorComponent,
    UniversalErrorCatcherComponent,
    PublicholidayCreateErrorComponent,
    HolidayyearCreateViewComponent,
    HolidayyearEmployeeCreateViewComponent,
    HolidayyearAdministrationComponent,
    HolidayyearAdministrationViewComponent,
    HolidayyearListComponent,
    HolidayyearRemainingEmployeeComponent,
    PublicHolidayViewComponent,
    HolidayyearEmployeeComponent,
    HolidayyearEmployeeViewComponent,
    PublicCalendarComponent,
    PublicCalendarViewComponent,
    DepartmentDeleteDialogComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes),
    NgbModule.forRoot(),
    SidebarModule.forRoot(),
    MatDialogModule,
    MatProgressSpinnerModule,
    MatProgressBarModule
  ],
  entryComponents: [
    EmployeeDeleteDialogComponent,
    DepartmentDeleteDialogComponent,
    WorkfreedaysCreateViewComponent,
    PublicholidaysCreateViewComponent,
    UniversalErrorCatcherComponent,
    WorkfreedayCreateErrorComponent,
    PublicholidayCreateErrorComponent,
    HolidayyearCreateViewComponent,
    HolidayyearEmployeeCreateViewComponent
  ],
  providers: [
    EmployeeService,
    DepartmentService,
    AbsenceService,
    AuthguardGuard,
    AdminGuard,
    AuthenticationService,
    MonthService,
    HolidayyearService,
    HolidayYearSpecService,
    PublicholidayService,
    StatusService,
    WorkfreedayService,
    DateformatingService],
  bootstrap: [AppComponent]
})
export class AppModule { }
