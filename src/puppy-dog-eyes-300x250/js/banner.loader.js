'use strict';

/**
 * DoubleClick enabler events.
 */
Banner.prototype.loader = function () {
  var _this = this;

  function onVisible() {
    _this.onVisible();
  }

  function pageLoaded() {
    _this.onPolite();

    if (Enabler.isVisible()) {
      onVisible();
    } else {
      Enabler.addEventListener(studio.events.StudioEvent.VISIBLE, onVisible);
    }
  }

  function enablerInitialised() {
    _this.onInit();

    if (Enabler.isPageLoaded()) {
      pageLoaded();
    } else {
      Enabler.addEventListener(studio.events.StudioEvent.PAGE_LOADED, pageLoaded);
    }
  }

  if (Enabler.isInitialized()) {
    enablerInitialised();
  } else {
    Enabler.addEventListener(studio.events.StudioEvent.INIT, enablerInitialised);
  }
};

/**
 * DoubleClick polite load.
 */
Banner.prototype.politeLoad = function (urls, onComplete) {
  var loaded = 0;
  var checkProgress = function () {
    if (++loaded === urls.length && onComplete) {
      onComplete();
    }
  };
  for (var i = 0; i < urls.length; i++) {
    Enabler.loadScript(urls[i], checkProgress);
  }
};

/**
 * Bind Enabler events.
 */
Banner.prototype.bindEvents = function () {
  let myExitUrl = 'https://example.com/?utm_source=';

  function addSuffix(url) { 
    var exitSuffix = Enabler.getParameter('exit_suffix');
    var symbol = (url.indexOf('?') > -1) ? '&': '?';
    var _url = '';

    if (exitSuffix !== null) {
      if (url) { 
        if (exitSuffix) { 
          while (exitSuffix.charAt(0) == '?' || exitSuffix.charAt(0) == '&') { 
            exitSuffix = exitSuffix.substring(1); 
          } 
          if (exitSuffix.indexOf('?') > -1) { 
            exitSuffix = exitSuffix.replace(/\?/g, '&'); 
          } 
        } 
        _url = url + symbol + exitSuffix;
      } 
    } else {
      /**
       * Default Exit UTM values
       */
      _url = url + symbol + `utm_source=${ dynamicContent.cm_data[0].utm_source }&utm_medium=display&utm_campaign=${ dynamicContent.feed[0].variant_Disabled_banner }&utm_content=${ this.bannerWidth }x${ this.bannerHeight }`;
    }

    return _url; 
  } 
  
  let exitUrl = addSuffix(myExitUrl);

  this.banner.addEventListener('click', function () {
    Enabler.exitOverride('clickthrough', exitUrl);
  });
};
