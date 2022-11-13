
var navToggle = document.querySelector('.main-nav__toggle');
var nav = document.querySelector('.site-list');
var navMain = document.querySelector('.main-nav');
var hambergerMenu = document.querySelector('.hamburger-menu');
var menu = "close";

navMain.classList.remove('main-nav--nojs');

navToggle.addEventListener('click', function(){
  if (menu === "close") {
    nav.style.transform = 'translate(0%, 0)';
    document.body.classList.add('overflow-hidden');
    menu = "open";
  } else {
    nav.style.transform = 'translate(100%, 0)';
    document.body.classList.remove('overflow-hidden');
    menu = "close";
  }
  hambergerMenu.classList.toggle('open');
})
