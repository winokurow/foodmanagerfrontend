import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { User } from "@app/_models/user";
import { AccountService } from "@app/_services/account.service";
import { Observable } from "rxjs";

export class TokenInterceptor implements HttpInterceptor {

  public user: User;

  constructor(private accountService: AccountService) {

    this.accountService.user.subscribe(x => this.user = x);
  }


  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${this.auth.getToken()}`
      }
    });    return next.handle(request);
  }
}
