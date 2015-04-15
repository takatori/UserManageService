$(function(){
    'use strict';
    var pathname = location.pathname;
    var param = location.search;
    param = param.split('=')[1];

    console.log(param);
    
    switch (pathname) {
    case '/':
        $('#navbar-home').addClass('active');
        break;
    case '/users':
        $('#navbar-users').addClass('active');        
        break;
    case '/register':
        $('#navbar-register').addClass('active');        
        break;
    }


    switch (param) {
    case 'current':
        $('#nav-tab-current').addClass('active');
        break;
    case 'Staff':
        $('#nav-tab-staff').addClass('active');        
        break;
    case 'D':
        $('#nav-tab-d').addClass('active');                
        break;
    case 'M2':
        $('#nav-tab-m2').addClass('active');                
        break;
    case 'M1':
        $('#nav-tab-m1').addClass('active');                
        break;
    case 'B4':
        $('#nav-tab-b4').addClass('active');                
        break;        
    default:
        $('#nav-tab-all').addClass('active');                
        break;
    }
});
