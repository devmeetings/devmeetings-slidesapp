(function(){
    var iframe = document.querySelector('iframe');

    window.addEventListener('hashchange', function(){
    	console.log("New hash", window.location.hash);
    	iframe.src = window.location.hash.replace('#', 'slides-')+".html";
    });
}());