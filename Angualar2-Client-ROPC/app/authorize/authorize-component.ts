import {Component, ViewChild,Input } from '@angular/core'
import {Http, Headers} from '@angular/http';
import {JwtHelper, AuthHttp, AuthConfig, AUTH_PROVIDERS} from 'angular2-jwt'
import {Router} from '@angular/router';
import {authervice} from './authoriza-service';
import { MODAL_DIRECTIVES, ModalComponent  } from 'ng2-bs3-modal/ng2-bs3-modal';
declare var System;
@Component({
    selector: 'authorize',
    templateUrl: '/app/authorize/authorize-component.html',
    directives: [MODAL_DIRECTIVES],
    providers: []
})

export class authorizeComponent{
    constructor(public jwtHelper: JwtHelper,
        private _http: Http,
        private _parentRouter: Router,
        private authentication: authervice) {
       
    }

    //@Input('log') log: boolean;
    @ViewChild('myModal')
    modal: ModalComponent;

    public mclose() {
        this.modal.close();
    }

   public mopen() {
        this.modal.open();
    }

   public logstatus() {
       this.isLoggedin = true; 
   }
    public token: any = "";
    public detoken: any = "";
    public isLoggedin: boolean;
    public logMsg: string;
    public pros: extprovider;
    public login: boolean;
    public register: boolean;
    public user: string;
    public loss: boolean;
    public externals: string;
    public authdata: any;
    public hodeModel: boolean = false;
    ngOnInit() {
       
        var instance = this;
         // check if auth key is present
        if (localStorage.getItem('auth_key')) {
            this.token = this.jwtHelper.decodeToken(localStorage.getItem("auth_key"));
           // this.authdata = localStorage.getItem('auth_key');
            if (!this.jwtHelper.isTokenExpired(localStorage.getItem('auth_key'))) // check if its not expired
            {
                instance.getUserFromServer();
                this._parentRouter.navigate(['/dashboard']);
                this.isLoggedin = true; // redirect from login page
            }
            else
            {
                if (localStorage.getItem('refresh_key')) { // check if refresh key is present it wont be present for external logged in users
                    this.refreshLogin(); // renew auth key and redirect
                }
            }

        } // logic to redirect user if already logged in
       // this.isLoggedin = false;
   
        this.pros = new extprovider();
        // below logic is for my login form snippet  to view login/register/loss password etc
        this.logMsg = "Type your credentials.";
        this.login = true;
        this.loss = false;
        this.register = false;
        //end of logic
    }
    // below logic is for my login form snippet to view login/register/loss password etc
    public callLogin() {
        this.login = true;
        this.register = false;
        this.loss = false;
    }
   

    public refreshLogin() {
    var instance = this;
        this.authentication.refreshLogin()
            .subscribe(
            Ttoken => {
                this.logMsg = "You are logged In Now , Please Wait ....";
                localStorage.setItem("auth_key", Ttoken.access_token);
                localStorage.setItem("refresh_key", Ttoken.refresh_token);
                this.isLoggedin = true;
                instance.getUserFromServer();
                this.mclose();
                this._parentRouter.navigate(['/dashboard']);
            },
            Error => {
                var error, key;
                key = Error.json();
                for (error in key) {
                    this.logMsg = "";
                    this.logMsg = this.logMsg + key[error] + "\n";
                }
            })

    }
    public getUserFromServer() {
        var instance = this;
        this.authentication.getUserInfo().subscribe(data => {
            instance.token = data;
        },
            error => { 
                instance.token = error;
            });
    }
    //open a popup for external login and set a interval function [API in Account Controller]
    public extLogin(provider: string) {
        var instance = this;
        var popup_window = window.open('http://localhost:52606/api/account/externalaccess?provider=' + provider + '&returnUrl=http://localhost:52606/connect/authorize?client_id=localApp%26response_type=code%26scope=offline_access%26nonce=12345%26resource=http://localhost:3000%26redirect_uri=http://localhost:3000/signin-oidc', '_blank', 'width=500, height=400');
        var intervalId=  setInterval(function () {
            if (localStorage.getItem('code')) {
                instance.authentication.getAuthorized(localStorage.getItem('code')).subscribe(data=>{
                localStorage.removeItem('code');
                localStorage.setItem("auth_key", data.access_token);
                localStorage.setItem("refresh_key", data.refresh_token);
                popup_window.close();//close external login popup
                instance.mclose();
                instance.getUserFromServer();
                instance.isLoggedin = true;// close login box
                instance._parentRouter.navigate(['/dashboard']);
                clearInterval(intervalId);// navigate to dashboard, we can use returnurls too
},error=>{});
               
            } }, 3000); //Check if the user has finished external login process after each 3 seconds.
    }


    public Logout() {
        this.authentication.logout().subscribe(data => {
            localStorage.removeItem("auth_key");
            localStorage.removeItem("refresh_key");
            this._parentRouter.navigate(['/']);
            this.isLoggedin = false;
        }, error => { this.logMsg = error });
    }

}
export class extprovider {
    public provider: string;
    public returnUrl: string;
}


export class token {
    public access_token: string;
    public expires_in: string;
    public refresh_token: string;
    public token_type: string;
}
