/*
This class simply takes new token from the server and saves it in localstorage for further usage
*/
import {Component } from '@angular/core'
@Component({
    selector: 'authorize',
    template: '<h3>Successfully authorized </h3><h4>Loading ...</h4>',
    directives: []
})
export class extauthorizeComponent {
    constructor() {
        //get id token from urls part 
        var frank_param = this.getParam( 'code' );
     /*   var x =  location.hash;
        alert(x);
        var extToken = x.replace("#code=", "");*/
        //save into localstorage
       localStorage.setItem("code", frank_param);
    }
 getParam( name )
{
 name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
 var regexS = "[\\?&]"+name+"=([^&#]*)";
 var regex = new RegExp( regexS );
 var results = regex.exec( window.location.href );
 if( results == null )
  return "";
else
 return results[1];
}


   
   


   

   

};