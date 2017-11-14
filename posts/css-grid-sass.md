---
title: CSS Grid with SASS
lang: en
keys: css, sass, layout
date: 2017-11-14
---

# CSS Grid with SASS
### Semantics
Before you start code your layout with CSS Grid, setup up your HTML so it makes sense. First and foremost your markup should be readable on screen readers and work without a fancy layout. When you’ve made sure your HTML is semantically correct, you can start thinking about the layout.

### A codepen exploration
I created [this pen](https://codepen.io/lisilinhart/full/OxGQXJ#slide-1) to explore the grid and how to improve my workflow with SASS. I wanted to dive deeper into the following properties: `grid-template-areas`, `grid-template-rows`, `grid-auto-rows` and `grid-area` and combine them with SASS in order to have to write less code. 

### Are the items overlapping? 
A central question to ask  before creating a CSS Grid, is if your grid-items are overlapping.

#### No overlap
![](https://raw.githubusercontent.com/lisilinhart/lisilinhart.github.io/master/images/grid-no-overlap.jpg)

If you don’t have overlapping items, you can create your grid quite simply with _named grid areas_. This is easy to adapt later, especially in media queries, because you can just rearrange all the parts for smaller screens, without having to redefine the grid-areas.

```css
.grid {
  grid-template-areas:
    'i1 i1 i1 i2 i2 i2'
    'i1 i1 i1 i3 i4 i4'
    'i5 i5 i5 i9 i9 i9'
    'i6 i7 i8 i9 i9 i9';
}
```

#### Overlapping items
![](https://raw.githubusercontent.com/lisilinhart/lisilinhart.github.io/master/images/grid-explicit.jpg)

If your items are overlapping, you’re gonna have a harder time using named grid areas to create this layout. It will be much simpler declaring items according to grid lines. You could for example create a 16x16 grid and define the items according to this grid. 

```css
.grid__item {
   grid-area: 4 / 5 / 5 / 9;
}
```

*Explicit: grid-template-rows/columns*
To define the grid, you could either define a fixed amount of grid items sized to the height and width of the grid. This means you will always have 16 rows and columns sized according to the dimensions of your container.
```css 
.grid {
	width: 100%;
	height: 100vh;
	grid-template-rows: repeat(16, 1fr);
	grid-template-columns: repeat(16, 1fr);
}
```

*Implicit: grid-auto-rows/columns*
The `grid-auto-rows` sets the implicit size of the grid items. Implicit sizing defines how big grid items should be once they aren’t within the explicitly set rows defined with `grid-template-rows`. 

```css 
.grid {
	--items: 16;
	grid-auto-rows: calc(100vh / var(--items));
  grid-auto-columns: calc(100% / var(--items));
}
```

By setting `grid-auto-rows` to the to the full height  divided by the amount of items we want to have, if we end up using 16 rows, it’s gonna look the same as the solution above. 

The difference is, if we end up only using 12 rows instead of 16, our grid is just going to have fewer rows and will still be centered. This isn’t the case if you explicitly set the grid rows using `grid-template-rows: repeat(16, 1fr);`. 

If we use implicit sizing, we also don’t have to define a fixed height, because we already defined how big each grid item is going to be. The height is going to be decided by how many rows of your grid you’re using. 

![](https://raw.githubusercontent.com/lisilinhart/lisilinhart.github.io/master/images/grid-implicit.jpg)


### Using SASS to write less code
Working with the grid is awesome and simple enough, but what’s tedious about it, is that you have to define where each item goes in the grid. This gets especially tedious if you have a lot of items to define.

```css
.header {
	grid-area: header;
}

.sidebar {
	grid-area: sidebar;
}
```

#### Loops with named grid-areas
The simplest way I found for myself would be to use SASS loops and data-attributes to assign the grid-areas, because I found it to be really readable and could still switch my HTML around to be correct when I changed the `display: block:` on smaller screens. 

So if I had 9 items like in the example like above, I’d just create a loop over 9 items and give them named grid-areas starting with i for item. 
```css
  @for $i from 1 through 9 {
    .grid__item[data-grid=#{"'i"+ $i + "'"}] {
      grid-area: unquote("i" + $i);
    }
  }
```

This compiles to 
```css
.grid__item[data-grid='i5'] {
  grid-area: i5;
}
```

and then in my HTML I could just set the data-attribute on each item to tell it where to go.

```HTML
<p class="grid__item" data-grid="i5">10:00</p>
```

#### Loops and grid-lines
If we’re using grid-lines to layout our items, I’ve found SASS lists to be helpful, because I’d have the layout of all items together in one place and could adapt it in a simple way. 

```css
$grid-items: (
  "5 / 4 / 10 / 9",
  "7 / 12 / 9 / 15",
  "1 / 1 / 3 / 16",
  "4 / 10 / 5 / 15",
  "9 / 3 / 13 / 6",
  "7 / 8 / 12 / 11",
  "11 / 13 / 13 / 16",
);
```

Then for putting the items in my layout I’d use a loop again, where the `[data-grid='8']` attribute would match the index of the item in my SASS list above.

```css
	@for $i from 1 through 9 {
    .grid__item[data-grid=#{"'"+ $i + "'"}] {
      grid-area: unquote(nth($grid-items, $i));
    }
  }
``` 

compiles to 
```css
.grid__item[data-grid='8'] {
  grid-area: 5 / 1 / 6 / 5;
}
```

```HTML
<h2 class="grid__item" data-grid="8">Cappucino</h2>
```

Now if I wanted to switch position between two items, I’d just have to adapt the data-attribute, without having the rewrite a lot of CSS. 

### Specificity
While this method is very handy, you have to be aware of specificity when using this, since adding a data-attribute is the same as adding an additional class.  If you don’t know how specificity works [this specificity calculator](https://specificity.keegan.st/) is a nice tool to check which CSS gets applied with different classes, ids and attributes. 

I’d only use the data-attribute to specify the `grid-area` property, since I never found myself wanting to overwrite it later. 

![](https://raw.githubusercontent.com/lisilinhart/lisilinhart.github.io/master/images/grid-specificity.jpg)

If you don’t want to use data attributes for this reason or because it doesn’t match up with your style of how you write your CSS, you could easily rewrite your SASS loops to use classes instead of data-attributes.

```css
	@for $i from 1 through 9 {
    .grid__item--{$i} {
      grid-area: unquote(nth($grid-items, $i));
    }
  }
``` 
```css
.grid__item--1 {
  grid-area: 5 / 1 / 6 / 5;
}
```

### Named grid-areas or grid-area by grid-lines
If your layout is quite simple without overlapping items, named grid-areas like `grid-area: item1;` are awesome, because on smaller screen it’s really easy to re layout everything by just adapting the `grid-template-areas` on the grid. 

If you have a more complicated layout, especially with overlapping items, it’s simpler to have a fixed column & row height. So you will define your areas with `grid-area: 5 / 1 / 6 / 5;`, but this also means on smaller screens you either will need to redefine those areas or have a different `display` property. 

### Conclusion 
For me personally using data-attributes in combination with SASS lists turned out really easy to read, because when I read through my HTML, I immediately knew which `grid-area` got applied to this element.  Not having to write out each `grid-area` property for each item is especially nice if you have a lot of items to define or if you find yourself often adapting the different `grid-area` properties for different items. 

At first, I started using `:nth-child(..)` to define my `grid-area` but this ended up being a problem when I wanted to switch around my HTML, which isn’t the case if you use data-attributes like `[data-grid='1']` or a specific class like `.grid__item--1`, because it’s not dependent on the position of the item in your HTML. 
divided by the amount of items we want to have, if we end up using 16 rows, it’s gonna look the same as the solution above. 

The difference is, if we end up only using 12 rows instead of 16, our grid is just going to have less rows and will still be centered. This isn’t the case if you explicitly set the grid rows using `grid-template-rows: repeat(16, 1fr);`. 

If we use implicit sizing, we also don’t have to define a fixed height, because we already defined how big each grid item is going to be. The height is going to be decided by how many rows of your grid you’re using. 

[image:34788DA8-BCB7-4FF2-A285-7F143EFB31AC-950-00000BE1C2B05382/Screen Shot 2017-11-13 at 12.37.08.png]


### Using SASS to write less code
Working with the grid is awesome and simple enough, but what’s tedious about it, is that you have to define where each item goes in the grid. This gets especially tedious if you have a lot of items to define.

```css
.header {
	grid-area: header;
}

.sidebar {
	grid-area: sidebar;
}
```

#### Loops with named grid-areas
The simplest way I found for myself would be to use SASS loops and data-attributes to assign the grid-areas, because I found it to be really readable and could still switch my HTML around to be correct when i changed the `display: block:` on smaller screens. 

So if I had 9 items like in the example like above, I’d just create a loop over 9 items and give them named grid-areas starting with i for item. 
```css
  @for $i from 1 through 9 {
    .grid__item[data-grid=#{"'i"+ $i + "'"}] {
      grid-area: unquote("i" + $i);
    }
  }
```

This compiles to 
```css
.grid__item[data-grid='i5'] {
  grid-area: i5;
}
```

and then in my HTML I could just set the data-attribute on each item to tell it where to go.

```HTML
<p class="grid__item" data-grid="i5">10:00</p>
```

#### Loops and grid-lines
If we’re using grid-lines to layout our items, I’ve found SASS lists to be helpful, because I’d have the layout of all items together in one place and could adapt it pretty simple. 

```css
$grid-items: (
  "5 / 4 / 10 / 9",
  "7 / 12 / 9 / 15",
  "1 / 1 / 3 / 16",
  "4 / 10 / 5 / 15",
  "9 / 3 / 13 / 6",
  "7 / 8 / 12 / 11",
  "11 / 13 / 13 / 16",
);
```

Then for putting the items in my layout I’d use a loop again, where the `[data-grid='8']` attribute would match the index of the item in my SASS list above.

```css
	@for $i from 1 through 9 {
    .grid__item[data-grid=#{"'"+ $i + "'"}] {
      grid-area: unquote(nth($grid-items, $i));
    }
  }
``` 

compiles to 
```css
.grid__item[data-grid='8'] {
  grid-area: 5 / 1 / 6 / 5;
}
```

```HTML
<h2 class="grid__item" data-grid="8">Cappucino</h2>
```

Now if I wanted to switch position between two items, I’d just have to adapt the data-attribute, without having the rewrite a lot of CSS. 

### Specificity
While this method is very handy, you have to be aware of specificity when using this, since adding a data-attribute is the same as adding an additional class.  If you don’t know how specificity works [this specificity calculator](https://specificity.keegan.st/) is a nice tool to check which CSS gets applied with different classes, ids and attributes. 

I’d only use the data-attribute to specify the `grid-area` property, since I never found myself wanting to overwrite it later. 

[image:C9082FAB-977F-4EB3-B0DF-E9AB537E7FE8-950-00000A8071F42820/Screen Shot 2017-11-13 at 12.11.59.png]

If you don’t want to use data attributes for this reason or because it doesn’t match up with your style of how you write your CSS, you could easily rewrite your SASS loops to use classes instead of data-attributes.

```css
	@for $i from 1 through 9 {
    .grid__item--{$i} {
      grid-area: unquote(nth($grid-items, $i));
    }
  }
``` 
```css
.grid__item--1 {
  grid-area: 5 / 1 / 6 / 5;
}
```

### Named grid-areas or grid-area by grid-lines
If your layout is quite simple without overlapping items, named grid-areas like `grid-area: item1;` are awesome, because on smaller screen it’s really easy to relayout everything by just adapting the `grid-template-areas` on the grid. 

If you have a more complicated layout, especially with overlapping items, it’s simpler to have a fixed column & row height. So you will define your areas with  `grid-area: 5 / 1 / 6 / 5;`, but this also means on smaller screens you either will need to redefine those areas or have a different `display` property. 

### Conclusion 
For me personally using data-attributes in combination with SASS lists turned out really easy to read, because when I read through my HTML, I immediately knew which `grid-area` got applied to this element.  Not having to write out each `grid-area` property for each item is especially nice if you have a lot of items to define or if you find yourself often adapting the different `grid-area` properties for different items. 

At first I started using `:nth-child(..)` to define my `grid-area` but this ended up being a problem when I wanted to switch around my HTML, which isn’t the case if you use data-attributes like `[data-grid='1']` or a specific class like `.grid__item--1`, because it’s not dependent on the position of the item in your HTML. 
