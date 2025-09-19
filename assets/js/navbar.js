var newScript = document.createElement('script');
newScript.type = 'text/javascript';
newScript.src = 'http://code.jquery.com/jquery-latest.js'; // set the source of the script to your script
newScript.onload = function() {
  console.log("Script is ready!");
  $(document).ready(function() {
    console.log("JQuery is ready!");
  });
};
var head = document.getElementsByTagName("head")[0];
head.appendChild(newScript);

$( document ).ready(function() {
    $.get("navbar.html", function(data){
        $("#nav-container").replaceWith(data);
    });
});
