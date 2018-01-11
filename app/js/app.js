var app = (function() {

  var assets = [
    // assets e.g. from css "url(___)"
  ];
  
  function init(){

    // register service worker
    if('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js', { scope: '/' }).then(function(registration) {
        console.log('Service Worker Registered');
      });
      navigator.serviceWorker.ready.then(function(registration) {
        console.log('Service Worker Ready');
        serviceWorkerRegistration = registration;

        var links = Array.prototype.slice.call( document.querySelectorAll('link') ).filter( (el)=>el.href ).map( (el)=>el.href );
        var scripts = Array.prototype.slice.call( document.querySelectorAll('script') ).filter( (el)=>el.src ).map( (el)=>el.src );
        assets = assets.concat(links).concat(scripts);
        console.log('Caching assets',assets);
        assets.forEach(function(url){
          fetch(url)
          .then( ()=>console.log('cached',url) )
          .catch( (e)=>console.error('error caching',url,e) );
        });
      });
    }

    // disable imagedrag, selection, rightclick, mouse cursor
    document.ondragstart = function() { return false; };
    document.onselectstart = function() { return false; };
    document.oncontextmenu = function() { return false; };
    document.onmousewheel = function(e) { e.preventDefault(); e.stopImmediatePropagation(); return false; };
    document.body.style.cursor = 'none';

    // event setup
    document.addEventListener('keydown',(event)=>{
      if ( document.querySelector('.dg.ac').contains(event.target) ) return; // don't steal keystrokes from dat.gui
      const keyName = event.key;
      switch (keyName){
        case 'm': document.body.style.cursor = document.body.style.cursor==='none' ? 'initial' : 'none';
        case 'd': debug.toggle(); break;
        case '!': debug.showPanel(0); break;
        case '@': debug.showPanel(1); break;
        case '#': debug.showPanel(2); break;
      }
    });

    // init DAT.GUI
    debug.init();
    var gui = debug.gui();
    var mainGui = debug.gui().addFolder('Main');
    var mainGuiConfigs = {
      get example(){ return idleTimeout/(60 * 1000); },
      set example(v){ 
        idleTimeout = 60 * 1000 * v; 
        if (idleTimer) clearTimeout(idleTimer)
        idleTimer = setTimeout( ()=>setState('ambient'), idleTimeout );
      },
    };
    gui.remember(mainGuiConfigs);

    // start animation
    animate();

  }

  function animate(time){
    requestAnimationFrame( animate );
    debug.begin();

    // ...

    debug.end();
  }

  function resize(){
    var width = window.innerWidth || 1;
    var height = window.innerHeight || 1;
    var devicePixelRatio = window.devicePixelRatio || 1;

    // ...
    
  }

  return {
    init: init,
    animate: animate,
    resize: resize,
  };

})();

window.addEventListener( 'load', app.init );
window.addEventListener( 'resize', app.resize );
