---
title: Getting started with the Web Animations Api
lang: en
keys: web animation api, javascript, css variables, 
date: 2017-08-19
---

# Let's move around some planets using the Web Animations Api
[PLANET CODEPEN](https://codepen.io/lisilinhart/full/dzNYKb/)

There is so many ways to animate things on the web today. From pure CSS animation to fancy libraries like GSAP.  The Web Animations Api (short WAAPI) tries to combine the power of CSS with the flexibility of Javascript in order to allow complex animation sequences. There are big differences between the WAAPI and for example libraries like GSAP, the biggest one being that the WAAPI is going to provide native browser support without needing to load an external library. 

Since I haven’t used the Api before, I just started playing around with it in this [pen.](https://codepen.io/lisilinhart/full/dzNYKb/). This post is gonna be about the core concepts I think are important, the resources I found helpful and learnings that I acquired. It’s not gonna be a detailed explanation of how every function of the Api works. 

### How I got started
The most useful resource for me was  the [Intro Series by Dan Wilson](http://danielcwilson.com/blog/2015/07/animations-intro/). Furthermore I found [Rachel Nabors Talk](https://vimeo.com/226736126) helpful to get a feeling for the Api and what it can do. Additionally this [CSS-tricks article](https://css-tricks.com/css-animations-vs-web-animations-api/) helped me get more into the differences to CSS animation and the options available. Once I had the basics down, I mostly used the official [MDN Docs](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API)  to dig deeper into the Api.

### Core Concepts
![](https://raw.githubusercontent.com/lisilinhart/lisilinhart.github.io/master/images/waapi-concepts.png)
I made a little illustration of the constructors that work together in the Web Animations Api. Everytime we animate something via `element.animate(..)` or `new Animation(...)` or `document.timeline.play(…)`  we get an animation object, which has different functions like `play() or pause()`.  

#### A KeyframeEffect inside Sequence- or GroupEffect
These are the core parts of how our animations are generated. It’s important to realise that these effects don’t do anything if we don’t add them to a `new Anmation(..)` or play them on the `document.timeline.play(..)`. If we use `element.animate(..)` it’s basically the same thing as creating a `KeyframeEffect` and wrapping it into a `new Animation(myEffect)`. 

The `KeyframeEffect` takes 3 arguments (the element itself, the animations frames array and the timing options object) and can be stored in a variable to be used in a `Sequence- or GroupEffect`.  The `SequenceEffect` will create an effect, that plays the `KeyframeEffects` after each other, whereas the `GroupEffect` will play them simultaneously.  

```javascript
const effectOne = new KeyframeEffect(target, frames, options);
const effectTwo = new KeyframeEffect(anotherTarget, frames, options);

const sequence = new SequenceEffect([
    effectOne,
	  effectTwo,
]);

const animation = document.timeline.play(sequence)
animation.pause();
```

#### How to structure Keyframes
For the [planets animation](https://codepen.io/lisilinhart/full/dzNYKb/) I had to loop over the particle elements, the radius and the background of each planet and create a `SequenceEffect`  out of the single `KeyframeEffects`. In order to keep an overview I created an object including all the keyframes arrays I needed. 

```javascript
const effects = {
  fadeInLeft: [
    { transform: "translate(-100%, 0%) scale(0.6)", opacity: 0 },
    { transform: "translate(0, 0)  scale(1)", opacity: 1 }
  ],
  fadeInRight: [
    { transform: "translate(100%, 0%) scale(0.6)", opacity: 0 },
    { transform: "translate(0, 0)  scale(1)", opacity: 1 }
  ],
}
```

This way I could just refer to them using `effects.fadeInLeft`, which I found more convenient than creating multiple variables for each effect.  I did the same thing for the options objects. 

```javascript
const timings = {
  background: {
    fill: "forwards",
    duration: 800,
    direction: "normal",
    easing: "cubic-bezier(0.2, 0, .3, 1.5)"
  },
  planet: {
    fill: "none",
    duration: 800,
    direction: "normal",
    easing: "cubic-bezier(.5, 0, .3, 1)"
  },
  ... 
};
```

##### The fill property
The `fill` property in the options object, does the same thing as the CSS [`animation-fill-mode`](https://developer.mozilla.org/de/docs/Web/CSS/animation-fill-mode). It defines whether the changes made by the animation are kept after the animations finishes or if it goes back to what it was before. For the planets animation this was important to use, because the fade in animation was different to the fade out animation. While the fade in animation animated all the children elements of the `div.planet`, the fade out animation only animated the parent `div.planet` changing it’s opacity and transform. When I wanted to animate the children elements for a second time, the parent wasn’t visible anymore, so you couldn’t see anything. Changing `fill: none` on the parent and using `animation.cancel()` on the fade in animation sequence of the children, basically reset all the changes made and made it possible to animate everything in again. 

##### cubic-bezier is your friend
Using `ease-in-out` is fine on a lot of animations, but it’s really worth it getting to know the `cubic-bezier` syntax, because it let’s you create more interesting animations. Setting the last property to a value higher than 1, gave the planet a little bounce on the fade in. I recommend Lea Verous [cubic-bezier tool](http://cubic-bezier.com/) to play around with it and get to know the syntax better. 

```javascript 
  easing: "cubic-bezier(0.2, 0, .3, 1.5)"
```

### Handling the direction when the slider updated
Since I wanted the planets to go either left or right, depending on which way one moved the slider thumb, I needed to create four different keyframe effects `fadeInLeft`, `fadeInRight`, `fadeOutLeft` and `fadeOutRight`. Since the labels for the slider were also animated and positioned slightly different, they got their own keyframes and options object with the matching effects. 

In order to register the update I added an `eventListener` to the `input`, which I debounced with the `lodash` debounce function in order to get rid of rapidly fired events in between. 
```javascript
range.addEventListener(
  "input",
  _.debounce(e => updateSlider(e.target.value), 300)
);
```

To find out if the planets needed to go left or right, the previous index was saved in a variable and on every update compared to the current index. If it was bigger the direction was `1` and the `document.timeline.play(fadeInLeft)`  for the planet at that index was played, after the old planets `document.timeline.play(fadeOutRight)` was finished. 

### Only animating when the other animation was finished 
Since I didn’t want the animations to be interrupted and broken off, I created and `isAnimating` that’s set to `false` in the beginning. When an animation is started, I set this variable to `true` and once it finishes, set it to `false` again.  This way, when we update the slider when an animation is still active, we can call a `setTimeout` and delay the update until the other animation finishes. 

```javascript
animation.onfinish = () => {
    isAnimating = false;
};
```

### Bonus: CSS Variables
Since I love CSS variables, I decided to use them in this pen aswell, since they make everything easier.  For the planets for example I only had to update the planet and particle color in the classes instead of reassigning all the `background` properties for the children. 

```css 
.planet {
	--planet-color: #ffd260;
}

.planet--1 {
	--planet-color: #3FB4C0;
	--particle-color: #FEDB82;
}

.background {
  background: var(--planet-color);
}

.particle {
  background: var(--particle-color);
}
```

#### Updating the Slide Thumb color with CSS variables
Since I wanted the thumb to update to the planet color once the slider changed, I also defined a `—planet-color` variable on the thumb. Once an updated happened I set this variable via Javascript.

```javascript
range.style.setProperty(`--planet-color`, planetColors[index]);
```

I could have defined the `—planet-color` on the `:root` level, but since I already set the planets colors in the CSS and only want to update the thumb color, I only set it on the input directly, since this is more performant. If you wanna know more about CSS Variables performance you can read [this article](https://lisilinhart.info/posts/css-variables-performance) I wrote some time ago. 

### Conclusion
I love using GSAP for doing sequenced animations, just because it’s so easy, supports all the browsers, works great with SVG and can do so many amazing things. So it took me a little bit to adapt to this different way the WAAPI works. In order to take advantage of the Api one still has to have a good knowledge of how CSS animations works, otherwise it will be really hard to use. Nevertheless I think it’s amazing to get more native animation options on the browser level without needing to load a whole library like GSAP.  

### Resources
* [WAAPI Resources - Rachel Nabors](http://rachelnabors.com/waapi)
* [Introduction to WAAPI - Dan Wilson](http://danielcwilson.com/blog/2015/07/animations-intro/)
* [Intro to WAAPI - Pawel Grzybek](https://pawelgrzybek.com/intro-to-the-web-animations-api/)
* [WAAPI Browser Support](https://codepen.io/danwilson/pen/xGBKVq)