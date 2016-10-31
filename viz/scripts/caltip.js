/** CalTip - Another jQuery ToolTip
 * version 0.1.0
 * http://journalism.berkeley.edu
 * created by: Jeremy Rue @jrue
 *
 * Copyright (c) 2012 The Regents of the University of California
 * Released under the GPL Version 2 license
 * http://www.opensource.org/licenses/gpl-2.0.php
 * This program is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 */
;(function(window, $) {
 "use strict";

 //some constants
 var W    = $(window).width(),
     H    = $(window).height();
  
  /**
   * This function enclosure is called for each DOM element the plugin
   * is attached to. 
   *
   * @param {object} element The DOM element that will be receiving the tooltip
   * @param {object|string|undefined} options Optional user-overrides of the default options
   * @param {string|undefined} optsec Optional parameter for the tooltip title
   */
 $.caltip = function(element, options, optsec){
   
  //declare vars 
  var plugin    = this,
      flag      = false,
      clickflag = false,
      $element  = $(element), //jquery DOM element
      element   = element,    //js core DOM element
      defaults  = {
       titlefont   : 'bold 16px/18px raleway,Helvetica,sans-serif',
       font        : 'normal 12px/16px raleway,Helvetica,sans-serif',
       padding     : '10px',
       titlecolor  : '#000000',
       bodycolor   : '#787878',
       border      : '1px solid #999',
       background  : '#ffffff',
       boxshadow   : '0 2px 4px rgba(0, 0, 0, 0.3)',
       borderRadius: '0px',
       zindex      : 99999,
       width       : 400,
       height      : 'auto',
       offsetleft  : 25,
       offsettop   : 0,
       title       : null,
       content     : '',
       notch       : true,
       dataAttr    : false,
       mouseevent  : 'mouseover',
       callback    : function(){}
      }
         
  //create box
  var box = $('<div />');
        
  plugin.settings = {}

  plugin.init = function() {
      
   if(typeof options !== 'undefined'){
        
    //if they pass in a string, change to object
    options = options.constructor == String ? { content:options } : options;
        
    //if there is a second parameter, use for title (make sure it's a string)
    if(typeof optsec !== 'undefined' && optsec.constructor == String){
     options.title = optsec;
    }
        
    //if dataAttr is true, then use content from data attribute
    if(options.hasOwnProperty('dataAttr') && typeof $element.attr('data-tooltip') !== 'undefined' && options.dataAttr){
     if(options.dataAttr.constructor == String && typeof $element.attr(options.dataAttr) !== 'undefined'){
      options.content = $element.attr(options.dataAttr);
     } else {
      options.content = $element.attr('data-tooltip');
     }
    }
        
   } else { //options is undefined
  
    if(typeof $element.attr('data-tooltip') !== 'undefined'){
     options = { content: $element.attr('data-tooltip') };
    } else {
     options = { content: $element.text().substring(0, 200) };
    }
   }
      
   //make parent element's CSS position relative as long as it doesn't affect any other positioning
   if($element.parent().css('position') == 'static'){
    $element.parent().css({'position':'relative'});
   }
      
   //merge settings from user to the defaults
   plugin.settings = $.extend({}, defaults, options);
      
   box.css({
    'position'             : 'fixed',
    'font'                 : plugin.settings.font,
    'color'                : plugin.settings.bodycolor,
    'padding'              : plugin.settings.padding,
    'border'               : plugin.settings.border,
    'background'           : plugin.settings.background,
    '-moz-box-shadow'      : plugin.settings.boxshadow ? plugin.settings.boxshadow : 'none',
    '-webkit-box-shadow'   : plugin.settings.boxshadow ? plugin.settings.boxshadow : 'none',
    'box-shadow'           : plugin.settings.boxshadow ? plugin.settings.boxshadow : 'none',
    '-moz-border-radius'   : plugin.settings.borderRadius ? plugin.settings.borderRadius : '0px',
    '-webkit-border-radius': plugin.settings.borderRadius ? plugin.settings.borderRadius : '0px',
    'border-radius'        : plugin.settings.borderRadius ? plugin.settings.borderRadius : '0px',
    'max-width'            : plugin.settings.width,
    'z-index'              : plugin.settings.zindex,
    'word-wrap'            : 'break-word',
    'text-align'           : 'left',
    'width'                : '400px',
    'opacity'              : '0'
   });
    
   //set optional title
   if(plugin.settings.title !== null && plugin.settings.title.constructor == String){
    var title = $('<h2 />')
       .css({
        'font'      : plugin.settings.titlefont,
        'color'     : plugin.settings.titlecolor,
        'display'   : 'block',
        'margin'    : '0',
        'padding'   : '0',
        'text-align': 'left'
       })
       .html(plugin.settings.title)
       .appendTo(box);
   }
    
   //put content in
   box.append(plugin.settings.content.toString());

   //on touchscreen devices, if they touch anywhere other than the tooltip, we should remove tooltip
   $(document).on('touchstart touchcancel', plugin.destroyToolTip);
      
   //if there is a click event, create a toggle
   if(plugin.settings.mouseevent == 'click'){
    $(element).css({'cursor':'pointer'});
    $(element).on(plugin.settings.mouseevent + ' touchstart', function(e){
     if(clickflag == false){
      clickflag = true;
      plugin.activateToolTip($(element), e); 
     } else {
      clickflag = false;
      plugin.destroyToolTip();
     }
    });
   }
      
   //if mouseover event, then attach events for both mouse over and mouseout.
   if(plugin.settings.mouseevent == 'mouseover'){
    $(element).on(plugin.settings.mouseevent + ' touchstart', function(e){
     clickflag == false;
     plugin.activateToolTip($(element), e); 
    });
    $(element).on('mouseout', plugin.destroyToolTip);
   }
  }
   
  /**
   * This this a PUBLIC function displays tooltip box
   *
   * @param {object} Jquery DOM element that was hovered
   * @param {event} Mouse or touch even passed in
   */
  plugin.activateToolTip = function(elm, evt) {

   elm.parent().append(box);
              
   box.css({
    'opacity' : '1',
    'display' : 'block',
    'left'    : repositionLeftBound(),
    'top'     : respositionTopBound()
   });
     
   evt = !evt ? window.event : evt;
   evt.cancelBubble = true;
   evt.stopPropagation();

   //get all events, and see if user added a click event
   var events = $._data(elm.get(0), 'events'); 
   var hasEvents = (events.click != null);
                       
   //remove touch event if there is an <a> tag, or there is already a click event
   if(((elm.attr('href') != null && elm.attr('href') != '#') || hasEvents) && clickflag == false){
    elm.off('touchstart');
    elm.on('click', function(e){plugin.destroyToolTip(elm, e)});
    clickflag = true;
   }
     
   //call callback
   plugin.settings.callback();
     
   return false;
  }
   
  /**
   * This function removes tooltip from DOM. It's called by
   * an event of some kind, like mouse or touch event.
   *
   * @param {object} elm The DOM element this event is attached to
   * @param {object} e Mouse or touch even passed in
   */
  plugin.destroyToolTip = function(elm, e){
   box.stop().fadeOut(300, function(){
    box.remove();
   });
  }
  
  /**
   * This this a PUBLIC function to change the title.
   *
   * @example element.data('caltip').changeTitle("Some New Title")
   * @param {string} new title
   */
  plugin.changeTitle = function(newtitle){
   $('h2', box).html(newtitle);
  }
  
  /**
   * This this a PUBLIC function to change the content
   *
   * @example element.data('caltip').changeContent("Some New Title")
   * @param {string} new content
   */
  plugin.changeContent = function(newcontent){
   var storeTitle = $('h2', box);
   box.empty();
   box.append(storeTitle).append(newcontent.toString());
  }
   
  /**
   * Repositions the tooltip (box) based on the element's location. It also 
   * checks to see if the box is sticking out of the browser window, if so
   * it will return the correct CSS left position value to stay in the window
   *
   * @return {Number} left position relative to element
   */
  var repositionLeftBound = function(){
   var boxwidth   = box.outerWidth(),
       boxheight  = box.outerHeight(),
       boxleft    = (($element.outerWidth()/2) + $element.offset().left) - (boxwidth/2),
       left       = (($element.outerWidth()/2) + $element.position().left) - (boxwidth/2) + plugin.settings.offsetleft;

   if(boxleft + boxwidth > W){
    left -= (boxleft + boxwidth) - W + 3;
   }
 
   if(boxleft < 0){
    left = 3;
   }

   return left;
  }

  /**
   * Repositions the tooltip (box) based on the element's location. It also 
   * checks to see if the box is sticking out of the browser window. If the
   * element is too high, it will place the tooltip underneith it.
   *
   * @return {Number} new CSS top position
   */
  var respositionTopBound = function(){
   var boxheight   = box.outerHeight(),
       top         = $element.position().top - boxheight + plugin.settings.offsettop;
         
   if(top + $element.parent().offset().top < 0){
    top = $element.position().top + $element.outerHeight();
   }
         
   return top;   
  }
 
  //kick things off
  plugin.init(); 
 }
  
 $.fn.caltip = function(options, optsec) {
  return this.each(function() {

   // if plugin has not already been attached to the element
   if (undefined == $(this).data('caltip')) {

    // create a new instance of the plugin
    var plugin = new $.caltip(this, options, optsec);

    $(this).data('caltip', plugin);
   }
  });
 }
})( window, jQuery );