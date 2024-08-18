import { HttpClient, HttpClientModule } from "@angular/common/http";
import { ComponentFixture, inject, TestBed, waitForAsync } from "@angular/core/testing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterTestingModule } from "@angular/router/testing";
import { By } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";
import { AccountService } from "@app/_services/account.service";
import { LoginComponent } from "./login.component";
import {Location} from '@angular/common';

let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let accountServiceSpy: jasmine.SpyObj<AccountService>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, RouterModule.forRoot([]), HttpClientModule,
      RouterTestingModule.withRoutes([
        { path: 'register', component: DummyComponent }
       ])],
      declarations: [LoginComponent]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.debugElement.componentInstance;
    accountServiceSpy = TestBed.inject(AccountService) as jasmine.SpyObj<AccountService>;

  });

it('should create Quote component', () => {
    expect(component).toBeTruthy();
  });

  it('click on submit username is leer field', waitForAsync(() => {
    fixture.detectChanges();

    let textfield = fixture.debugElement.query(By.css('input[formControlName="username"]'));
    let el = textfield.nativeElement;
    el.value = 'someValue';
    el.dispatchEvent(new Event('input'));

    let button = fixture.debugElement.nativeElement.querySelector('.btn-primary');
    button.click();
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      let p = fixture.debugElement.nativeElement.querySelector('#password-error');

      expect(p.textContent).toBe('Password is required');
    });
  }))

    it('click on submit password is leer field', waitForAsync(() => {
      fixture.detectChanges();
      let textfield = fixture.debugElement.query(By.css('input[formControlName="password"]'));

      let el = textfield.nativeElement;
      el.value = 'someValue';
      el.dispatchEvent(new Event('input'));

      let button = fixture.debugElement.nativeElement.querySelector('.btn-primary');
      button.click();
      fixture.detectChanges();

      fixture.whenStable().then(() => {
        let p = fixture.debugElement.nativeElement.querySelector('#username-error');

        expect(p.textContent).toBe('Username is required');
      });
    }))

      it('click on submit fields are set', waitForAsync(() => {
        fixture.detectChanges();

        spyOn(accountServiceSpy, 'login');

        let textfield = fixture.debugElement.query(By.css('input[formControlName="password"]'));
        let el = textfield.nativeElement;
        el.value = 'someValue';
        el.dispatchEvent(new Event('input'));

        textfield = fixture.debugElement.query(By.css('input[formControlName="username"]'));
        el = textfield.nativeElement;
        el.value = 'someValue';
        el.dispatchEvent(new Event('input'));

        let button = fixture.debugElement.nativeElement.querySelector('.btn-primary');
        button.click();
        fixture.detectChanges();

        fixture.whenStable().then(() => {
          expect(accountServiceSpy.login).toHaveBeenCalled();
        });
      }))

      it('click on submit password is leer field', waitForAsync(() => {
        fixture.detectChanges();
        let textfield = fixture.debugElement.query(By.css('input[formControlName="password"]'));

        let el = textfield.nativeElement;
        el.value = 'someValue';
        el.dispatchEvent(new Event('input'));

        let button = fixture.debugElement.nativeElement.querySelector('.btn-primary');
        button.click();
        fixture.detectChanges();

        fixture.whenStable().then(() => {
          let p = fixture.debugElement.nativeElement.querySelector('#username-error');

          expect(p.textContent).toBe('Username is required');
        });
      }))

      it('click on registration registration is shown', inject([Location], (location) => {
        fixture.detectChanges();


        let button = fixture.debugElement.nativeElement.querySelector('.btn-link');
        button.click();
        fixture.detectChanges();

        fixture.whenStable().then(() => {
          expect(location.path()).toBe('/register');

        });
      }))

      class MockAuthService {

        login() {

        }
      }

      class DummyComponent {}
