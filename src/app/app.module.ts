import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import {  } from '@angular/material';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AlertComponent } from './_components/alert.component';
import { JwtInterceptor } from './_helpers/jwt.interceptor';
import { ErrorInterceptor } from './_helpers/error.interceptor';
import { PlacesComponent } from './places/places.component';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatTableModule} from '@angular/material/table';
import {LoginComponent} from '@app/auth/login/login.component';
import {RegisterComponent} from '@app/auth/register/register.component';
import {PasswordResetComponent} from '@app/auth/password-reset/password-reset.component';
import {UpdatePasswordComponent} from '@app/auth/update-password/update-password.component';
import {PlaceDialogBoxComponent} from '@app/places/dialogboxcomponent/place-dialog-box.component';
import {MatIcon} from '@angular/material/icon';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule, MatRippleModule} from '@angular/material/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSortModule} from '@angular/material/sort';
import {MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {MatSelectModule} from '@angular/material/select';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {FoodDialogBoxComponent} from '@app/home/dialogboxcomponent/food-dialog-box.component';

@NgModule({ declarations: [
        AppComponent,
        AlertComponent,
        HomeComponent,
        PlacesComponent,
      LoginComponent,
      RegisterComponent,
      PasswordResetComponent,
      UpdatePasswordComponent,
      PlaceDialogBoxComponent,
    FoodDialogBoxComponent
    ],
    bootstrap: [AppComponent],
    imports: [BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
      MatDatepickerModule,
      MatNativeDateModule,
      MatFormFieldModule,
      MatInputModule,
      MatNativeDateModule,
      MatRippleModule,
      MatDatepickerModule,
      MatSortModule,
      MatPaginatorModule,
      MatTableModule,
      MatDialogModule,
      MatButtonModule,
      MatSelectModule,
      MatAutocompleteModule,
      MatDatepickerModule,
      MatNativeDateModule,
    MatPaginatorModule,
    MatTableModule, MatIcon], providers: [
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
        provideHttpClient(withInterceptorsFromDi()),
        provideAnimationsAsync()
    ] })
export class AppModule { }
