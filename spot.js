/* ——————————————————————————————————————— /

                  jQuery Spot

    A performance optimized event plugin
    to track when an element is within the
    viewport or in proximity of it.


/* ——————————————————————————————————————— */


(function($){
    var eventHandlers = []
    var lastScrollY = null
    var intervalIsRunning = false

    var requestAnimationFrame = function(callback){
      var targetTime = 0

      if(!window.requestAnimationFrame){
        setTimeout(callback, 16)
      } else {
        window.requestAnimationFrame(callback)
      }
    }

    var interval = function(){
      var scrollY = window.scrollY || document.documentElement.scrollTop

      // Do not run this frame if same position as before
      if(scrollY === lastScrollY){
        requestAnimationFrame(interval)
        return false
      }

      // Stop interval completely if there's no event handlers
      if(!eventHandlers.length){
        intervalIsRunning = false
        return false
      }

      intervalIsRunning = true
      lastScrollY = scrollY

      for(var i = 0, length = eventHandlers.length; i < length; i++){
        var eventHandler = eventHandlers[i]
        var screenTop = -Math.floor(eventHandler.element.getBoundingClientRect().top)
        var elementHeight = eventHandler.element.offsetHeight
        var direction = screenTop > eventHandler.lastScreenTop ? 'down' : 'up'

        var aboveViewport = screenTop + window.innerHeight < 0
        var belowViewport = screenTop - elementHeight > 0
        var visible = !aboveViewport && !belowViewport

        var aboveProximity = screenTop + window.innerHeight + eventHandler.options.proximity < 0
        var belowProximity = screenTop - elementHeight - eventHandler.options.proximity > 0
        var withinProximity = !aboveProximity && !belowProximity

        var event = {
          screenTop: screenTop,
          elementHeight: elementHeight,
          direction: direction,
          visible: visible,
          aboveViewport: aboveViewport,
          belowViewport: belowViewport,
          element: eventHandler.element
        }

        if(eventHandler.eventName == 'onscreen' && withinProximity
        || eventHandler.eventName == 'enterscreen' && !eventHandler.wasWithinProximityLastFrame && withinProximity
        || eventHandler.eventName == 'leavescreen' && eventHandler.wasWithinProximityLastFrame && !withinProximity){
          eventHandler.callback(event)

          // Remove event handler if option is set to trigger once
          if(eventHandler.options.triggerOnce){
            eventHandlers.splice(i, 1)
            length -= 1
          }
        }

        eventHandler.wasWithinProximityLastFrame = withinProximity
        eventHandler.lastScreenTop = screenTop
      }

      requestAnimationFrame(interval)
    }

    var addEventHandler = function(eventName, callback, options){
      this.each(function(index, element){
        options = $.extend({
          proximity: 0,
          triggerOnce: false
        }, options)

        eventHandlers.push({
          eventName: eventName,
          element: element,
          callback: callback,
          options: options,
          lastScreenTop: 0,
          wasWithinProximityLastFrame: false
        })
      })

      if(!intervalIsRunning){
        requestAnimationFrame(interval)
      }
    }

    $.fn.spotlight = function(eventName, callback, options){
      addEventHandler.call(this, eventName, callback, options)
    }

    $.extend($.fn, {
      onscreen: function(callback, options){
        addEventHandler.call(this, 'onscreen', callback, options)
      },

      enterscreen: function(callback, options){
        addEventHandler.call(this, 'enterscreen', callback, options)
      },

      leavescreen: function(callback, options){
        addEventHandler.call(this, 'leavescreen', callback, options)
      }
    })


})(window.jQuery || window.Zepto)
