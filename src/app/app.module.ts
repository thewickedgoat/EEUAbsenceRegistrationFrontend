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
import {RegistrationService} from './services/registration.service';
import {AuthguardGuard} from './Authorization/authguard.guard';
import { LoginComponent } from './Login/login/login.component';
import { EmployeeEditComponent } from './employee/employee-edit/employee-edit.component';
import { DepartmentCreateComponent } from './department/department-create/department-create.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { AbsenceOverviewComponent } from './absence-overview/absence-overview.component';
import { SidebarModule } from 'ng-sidebar';


const routes: Routes = [
  {path: 'employee/:id', canActivate: [AuthguardGuard], component: EmployeeComponent},
  {path: 'employees', canActivate: [AuthguardGuard], component: EmployeeListComponent},
  {path: 'employees/create', canActivate: [AuthguardGuard], component: EmployeeCreateComponent},
  {path: 'employees/edit/:id', canActivate: [AuthguardGuard], component: EmployeeEditComponent},
  {path: 'departments/create', canActivate: [AuthguardGuard], component: DepartmentCreateComponent},
  {path: 'calendar/:id', canActivate: [AuthguardGuard], component: CalendarComponent},
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
    AbsenceOverviewComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes),
    NgbModule.forRoot(),
    SidebarModule.forRoot()
  ],
  providers: [EmployeeService, DepartmentService, AbsenceService, RegistrationService, AuthguardGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
