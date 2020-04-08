'use strict';

/**
 * Run the animation functions.
 */
Banner.prototype.start = function () {
  this.banner = document.querySelector('.banner');

  this.bannerWidth = this.banner.offsetWidth;
  this.bannerHeight = this.banner.offsetHeight;

  // Image array for preloading
  this.images = [
    'images/headline.svg',
    'images/image-0.png',
    'images/image-1.png',
    'images/image-2.png',
    'images/image-3.png',
    'images/image-4.png',
    'images/image-5.png',
    'images/logo.svg',
  ];

  var _this = this;
  this.preloadImages(this.images, function () {
    _this.createElements();
    _this.setup();
    _this.hidePreloader();
    _this.animate();
    _this.bindEvents();
  });
};

/**
 * Create dom elements.
 */
Banner.prototype.createElements = function () {
  this.logo = this.smartObject({
    backgroundImage: 'images/logo.svg',
    width: 175,
    height: 150,
    parent: this.banner
  });

  this.headline = this.smartObject({
    backgroundImage: 'images/headline.svg',
    width: 129,
    top: 200,
    parent: this.banner
  });

  let imageNum = 6;

  for (let i = 0; i < imageNum; i += 1) {
    this[`image${i}`] = this.smartObject({
      backgroundImage: `images/image-${i}.png`,
      top: 300,
      retina: true,
      parent: this.banner
    });
  }

  this.tagline = this.smartObject({
    fontFamily: 'benton-sans, sans-serif',
    fontWeight: 400,
    fontStyle: 'normal',
    color: 'rgb(255, 255, 255)',
    innerHTML: 'Some Inspiring Tagline',
    top: 'none',
    bottom: 200,
    parent: this.banner
  });

  this.cta = this.smartObject({
    fontFamily: 'benton-sans, sans-serif',
    fontWeight: 500,
    fontStyle: 'normal',
    backgroundColor: 'rgb(242, 145, 145)',
    color: 'rgb(255, 255, 255)',
    padding: '0.2em 1.2em',
    innerHTML: 'Discover More',
    top: 'none',
    bottom: 150,
    parent: this.banner
  });
};

/**
 * Setup initial element states.
 */
Banner.prototype.setup = function () {
  this.logo.center();
  this.cta.centerHorizontal();
  this.tagline.centerHorizontal();
  this.headline.centerHorizontal();
};

/**
 * Hide the preloader.
 */
Banner.prototype.hidePreloader = function () {
  TweenLite.to('.preloader', 1, { autoAlpha: 0 });
};

/**
 * Animation timeline.
 */
Banner.prototype.animate = function () {
  let imageSet1 = [
    this.image0,
    this.image1,
    this.image2,
  ];

  let imageSet2 = [
    this.image3,
    this.image4,
    this.image5,
  ];

  let staggerCycle = [
    { x: -300, y: 0 },
    { x: 300, y: 0 },
    { x: 0, y: 600 },
  ];

  const imageAnim = (images, cycle, stagger, pause) => {
    let tl = new TimelineMax();
    let num = images.length;

    tl.staggerFrom(images, 0.6, { cycle: {
      x: function(index) {
        return cycle[index].x;
      },
      y: function(index) {
        return cycle[index].y;
      }
    }, ease: Power3.easeOut, }, (stagger / num), `-=${ stagger }`)
    .staggerTo(images, 0.6, { cycle: {
      x: function(index) {
        return Math.abs(cycle[index].x) * -1;
      },
      y: function(index) {
        return Math.abs(cycle[index].y) * -1;
      }
    }, ease: Power3.easeOut, }, (stagger / num), pause);

    return tl;
  };

  const mouseInteractions = () => {
    this.banner.addEventListener('mouseover', () => {
      TweenMax.to(this.cta, 0.4, { backgroundColor: '#f25252', ease: Power3.easeOut });
    });

    this.banner.addEventListener('mouseout', () => {
      TweenMax.to(this.cta, 0.4, { backgroundColor: '#f29191', ease: Power3.easeOut });
    });
  };

  this.timeline = new TimelineMax({ delay: 2 })
    .to(this.logo, 0.8, { y: -200, scale: 0.8, ease: Power3.easeInOut })
    .from(this.headline, 0.4, { autoAlpha: 0, ease: Power3.easeOut }, '+=0.2')
    .add(imageAnim(imageSet1, staggerCycle, 0.4, '+=2.0'), '-=0.4')
    .add(imageAnim(imageSet2, staggerCycle, 0.4, '+=2.0'), '-=0.4')
    .to(this.logo, 0.8, { y: 0, scale: (1 / 2), ease: Power3.easeInOut }, 'endFrame')
    .to(this.headline, 0.8, { y: 60, ease: Power3.easeInOut }, 'endFrame+=0.4')
    .from(this.tagline, 1.2, { autoAlpha: 0, ease: Power3.easeOut }, 'endFrame')
    .from(this.cta, 1.2, { autoAlpha: 0, ease: Power3.easeOut }, 'endFrame+=1.2')
    .to(this.cta, 0.6, { backgroundColor: '#f25252', ease: Power3.easeInOut }, 'endFrame+=2.2')
    .to(this.cta, 0.4, { backgroundColor: '#f29191', ease: Power3.easeOut, onComplete: () => {
      mouseInteractions();
    } }, 'endFrame+=2.9');
};
