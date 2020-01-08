
$(document).ready(function() {
    $('.sidenav').sidenav();
    $('.carousel').carousel({
        indicators: true
    });

    setInterval(function(){
        $('.carousel').carousel('next');
    }, 2000);
});