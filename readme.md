# jQuery Spot.js
A performance optimized event plugin to track when an element is within the viewport or in proximity of it.

## Why?
It's a common practice to bind a tracking function to the scroll event to get the position of the viewport and it's relation to tracked elements. A drawback to this technique is this forces the browser to execute your code no matter what, resulting in jag and studder in the scroll flow.

Spot uses requestAnimationFrame which tries to fire 60 times per second, which the browser only fires when it think it has the capacity.

## API
``` javascript

  $(element).enterscreen(callback, options)
  $(element).leavescreen(callback, options)
  $(element).onscreen(callback, options)

  $(element).spot('onscreen', function(event) {
    …
  }, {
    proximity: 200,
    triggerOnce: true
  })
```

## Options
__proximity:__
Offsets the trigger area both above and below of the element

__triggerOnce:__
If set to true, the callback will only be called once in it's lifetime


## Event properties
__screenTop:__
Returns offset from the top of the element and the viewport.

__elementHeight:__
returns the height of the element which the event was attached.

__direction:__
Return the direction the scroll which is either up or down.

__visible:__
Returns if the element is visible on the screen. This could be useful if proximity is so large the event fires without the element visible.

__aboveViewport:__
Returns if the element is above the viewport. This could be useful if proximity is so large the event fires without the element visible.

__belowViewport:__
Same as above.

__element:__
Returns the element which the event was attached.

