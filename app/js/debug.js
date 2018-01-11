var debug = (function(){
  
  var gui = new dat.GUI({ load: config });
  var stats = new Stats();
  var enabled = false;
  
  function init(o) {

    gui.useLocalStorage = true;

    // stats
    stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild( stats.dom );

    // hide first
    gui.domElement.setAttribute('hidden', true);
    stats.dom.setAttribute('hidden', true);

  }

  function toggle(){
    if (enabled){
      gui.domElement.setAttribute('hidden', true);
      stats.dom.setAttribute('hidden', true);
    }else{
      gui.domElement.removeAttribute('hidden');
      stats.dom.removeAttribute('hidden');
    }
    enabled = !enabled;
  }

  return {
    init: init,
    toggle: toggle,
    showPanel: stats.showPanel,
    begin: () => enabled && stats.begin(),
    end: () => enabled && stats.end(),
    gui: () => gui,
  };

})();