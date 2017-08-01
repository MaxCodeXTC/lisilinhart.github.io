---
title: Performance of CSS Variables
lang: en
keys: css variables, performance, javascript
date: 2017-07-27
---

# Performance of CSS Variables
CSS variables have been around for a while. Although they still lack some Browser Support (mainly IE and Edge), they provide a great new way to structure and interact with your CSS. In order to take a closer look at the performance impact of CSS variables one has to understand the basic principle of the scope, because it also applies to CSS variables.

## TL;DR
* be aware of style recalculations, since CSS Variables are inheritable — changing a variable on a parent can affect many children
* prefer using single classes for elements to make style calculations easier for the browser
* `calc()` has good performance with variables, but still has problems with browser support with certain units like `deg or ms`
* prefer using `setProperty`  rather than inline styles to set CSS variables in Javascript

## Global vs. local scope
The concept of scoping exists in most programming languages and essentially defines if a variable takes effect in the entire document or just in a subpart of the document (e.g. within a CSS class). For CSS variables this means, that we can define variables within the global scope like so:

```css
:root {
	--main-color: tomato;
}
```

If we want our variable to only be visible for a specific component, we can just define it in its local scope.

```css
.title {
	--title-color: aqua;
	color: var(--title-color);
}
```

What’s great about CSS variables is that they are dynamic, so they can be changed in different scopes and at runtime. So instead of defining a new variable like we did with `--title-color`, we could just change the existing global one and the change would only affect this specific component.

```
.title {
  --main-color: aqua;
	color: var(--main-color);
}
```

### Scope and Specificity 
> With tools like SASS it became quite popular to nest CSS, which often resulted in overly specific selectors like this:  

```css
.card .heading .title { ... }
```

To get rid of this problem class centric methods like [BEM](http://getbem.com/) have been introduced. It aims at reducing specificity by having a single class for every element.

```
	.card { ... }
	.card__heading { ... }
	.card__title { ... }
```

## Inheritance and Style Recalculations
In order to understand the influence of the scope on performance, we first have to understand how the browser handles style calculations.

> .. in order to know, for example, that the element is the last of its type, the browser must first know everything about all the other elements and whether the are any elements that come after it that would be the nth-last-child, which is potentially a lot more expensive than simply matching up the selector to the element because its class matches. ([Lewis 2017](https://developers.google.com/web/fundamentals/performance/rendering/reduce-the-scope-and-complexity-of-style-calculations))  

Using single classes like BEM aims to do, makes style calculation a lot easier for the browser, because it doesn’t need to compare elements to all its siblings to figure out what style to apply.

### Scope and CSS variables
Since CSS variables are inheritable, changing them will cause a style recalculation for all children. This doesn’t apply to CSS variables exclusively, but is also true for other inheritable properties like color or font.

> Typically CSS properties that default to inherit will in most cases cause a large recalc of styles. ... A good practice to avoid this is to animate CSS vari- ables at the most specific level (or deepest level), in order to prevent a multitude of children affected. ([Gaebel 2017](https://webdesign.tutsplus.com/tutorials/how-to-use-css-variables-for-animation--cms-28868))  

So if we change CSS variables dynamically we should do this in the local scope instead of the global scope to avoid large style recalculations.

### Style Recalculation Example

In order to measure the difference between setting the CSS variable on a parent element with 25000 child elements or setting the variable on the child only, a Codepen was created with the following HTML & CSS.

```html
<div class="container">
  <span class="el"></span>
... 25000 more elements
</div>
```

```css
.el {
	background: var(--bg, orange);
}
```

Via Javascript the `--bg` variable was first set on the `.container` parent element, which resulted in a fairly long duration of 76ms. Then the same variable was set on the first child .el , which only lasted about 1.9ms. So the more children a parent element has using this variable, the more expensive setting a CSS variable on this element gets.

![](https://raw.githubusercontent.com/lisilinhart/lisilinhart.github.io/master/images/css-variables-style-recalc.png)

## Using Calc() with CSS Variables
CSS variables get even more powerful, when we combine them with the `calc()` function. Particularly for transforms, preferring a single definition of a unitless variable with multiple properties, setting their values in relation to this variable in their own units is superior and makes adapting these transitions easier. ([Wilson 2017](https://css-tricks.com/making-custom-properties-css-variables-dynamic/)).
Until now, `calc()` was mostly used for calculating widths and heights of responsive elements. For example, if one wanted to make the width of a div `100px` shorter than `100%`, you could do the following:

```css
.container {
  width: calc(100% - 100px);
}
```

In combination with CSS variables, `calc()` can do much more.
Adding units to a unitless CSS variable can be done like so: 

```css
:root {
	--duration: 2000;
}

div {
  animation-duration: calc(var(--duration) * 1ms);
}
```

### Performance using calc()

When using `calc()` in combination with unitless CSS Variables, performance can become a problem. To find out more about performance issues, a [jsPerf test case](https://jsperf.com/css-variables-with-without-calc) was created to test several different options to set properties with and without `calc()` . The six tested approaches are listed below: 
1. variable + calc + px: a unitless CSS variable is multiplied by 1px using calc()
2. variable + px: a CSS variable containing a pixel value is set
3. px: a hard coded pixel value is set
4. variable + calc + percent: a unitless CSS variable is multiplied by 1% using calc()
5. variable + percent: a CSS variable containing a percent value is set
6. percent: a hard coded percent value is set

As it can be seen below, directly setting the hard coded value is fastest (approaches 3 and 6), followed by setting a CSS variable containing a value with a unit (approaches 2 and 5). Setting a unitless css variable with the help of `calc()` (approaches 1 and 4) is the slowest, but not much slower than the previous method.

![](https://raw.githubusercontent.com/lisilinhart/lisilinhart.github.io/master/images/css-variables-calc.png)


### Browser Support 

Some browser still have problems in supporting `calc()`. On the positive side, all browsers supporting CSS variables also support `calc()` if used with `px, vmin, rem` and other linear distance units. On the other side, Firefox and Edge have problems with other unit types like `%, deg` or `ms`. These issues with `calc()` are holding back development with CSS variables for many, but the use of progressive enhancement allows for using fallbacks in these affected browsers ([Wilson 2017](https://css-tricks.com/making-custom-properties-css-variables-dynamic/)).

## Setting CSS Variables with JS
David Khourshid created a [jsPerf test case](https://jsperf.com/css-variables-vs-inline-styles), in which he compares three different approaches of setting styles with JavaScript. By adapting the test we compared the following cases in this [jsPerf test](https://jsperf.com/css-variables-vs-inline):

First, the inline styles are set:
```javascript
element.style = ’color: green’; 
```

Secondly, the styles are set using the setProperty syntax:
```javascript
element.style.setProperty(’color’, ’green’); 
```

The third approach also uses setProperty, but for setting a CSS custom property:
```javascript
element.style.setProperty(’--color’, ’green’); 
```

The last test case sets the CSS variable inline:
```javascript
element.style = "--color: green";
```

The test cases were applied to 100 HTML elements several times. Safari is a lot faster in setting inline styles compared to the `element.style.setProperty` operation. In Chrome on the other hand there isn’t much difference between setting the CSS variable via inline styles or `setProperty`. Interestingly enough, Firefox is clearly lagging way behind in setting inline styles. So using the `setProperty` operation is preferred across browsers. In all three browsers setting the style directly is faster than setting the variable. 

## Conclusion
When working with CSS variables we always have to be aware in which scope our variable is defined and if changing it, will affect many children and thus create large amounts of style recalculation.

Using `calc()` in combination with CSS variables is a good way to gain more flexibility and limit the amount of variables we need to define. Testing `calc()` in combination with CSS variables in different browsers, didn’t show any big performance issues. However there is still limited support within some browsers for some units like deg or ms, so we have to keep that in mind.

If we compare the performance marks of setting variables in JavaScript via inline styles versus the `setProperty` method  there are some significant differences between the browsers. While setting properties via inline styles is very fast in Safari, it’s very slow in Firefox, so using `setProperty` to set a variable is preferred

Written in cooperation with [Marcel Freinbichler](www.freinbichler.me)

## Resources
[How to Use CSS Variables for Animation.](https://webdesign.tutsplus.com/tutorials/how-to-use-css-variables-for-animation--cms-28868) - Dennis Gaebel
[Reduce the Scope and Complexity of Style Calculations.](https://developers.google.com/web/fundamentals/performance/rendering/reduce-the-scope-and-complexity-of-style-calculations) - Paul Lewis
[Making Custom Properties (CSS Variables) More Dynamic](https://css-tricks.com/making-custom-properties-css-variables-dynamic/) — Dan Wilson