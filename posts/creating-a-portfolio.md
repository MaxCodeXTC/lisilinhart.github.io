---
title: Things to consider when creating a portfolio
lang: en
keys: portfolio, accessibility, animation
date: 2017-07-11
---

# Things to consider when creating a portfolio
### Accessibility
I wanted to create an portfolio that considered the most important aspects of accessibility.  The [Accessibility Checklist](http://a11yproject.com/checklist.html) is a good resource to start with. 

#### Make it fully accessible via keyboard
As many people only use the keyboard to navigate websites, i wanted to enable to access every part of the site using only the keyboard. So how did I do this?
- Use `a` or `button` for navigation elements.
- Specify `role="navigation"`  on your `<nav>` element
- For SVG Icons always use the `title` attribute if it doesn’t include text (e.g. for social media icons)
- Use `tabindex `  for important navigation elements.
```html
<a tabindex="0" class="active" href="/">About</a>
```

Since my side navigation is only shown on `:hover` ,  the `:focus` CSS didn’t get triggered on the parent, since it only happened on the child link. Since there aren’t any parent selectors in CSS yet ([CSS4 Parent Selectors](https://www.w3.org/TR/selectors4/) to the rescue ). I had to do add `onFocus` and `onBlur`  Event Listeners on the Links directly. When a link got focused via the keyboard I added an `.focused` class to the parent, which did the same thing as the `:hover`. When it lost focus, I removed this class again. 

```javascript
const parent = document.querySelector('.navigation');
const linkElements = [...parent.querySelectorAll('a')];

linkElements.map((link) => {
	link.addEventListener('focus', () => {
		parent.classList.add('focused');
	});
});
```
 
#### Essential accessibility things to do 
- Define the `role` attribute on important parts of your 
- Define the document language `<html lang="en">`
- Provide texts for all navigation elements and links
- Provide  `alt`  texts for all images
- make sure the color contrast  is appropriate

I encourage everyone to take a look at the basic accessibility guidelines, because we can make life so much easier for people using Screen Readers with not that much more effort. If you want to get a feel on how a Screen Reader works, just open up _VoiceOver_ on MacOs and try navigating a few websites. _[NVDA](https://www.nvaccess.org/)_ is free windows equivalent. 

### Animations
The first versions of my portfolio involved a lot more interactive SVG animations. Although I do love animations, I decided to reduce them a bit and only use them where they actually make sense, are accessible and _don’t distract the user_ from what’s actually important. 

#### SVG text animations & Multilanguage support
I did a few text heading animations in SVG in my first versions, which turned out to be a problem when I wanted to make the site German and English, since the headings were made of `path` elements rather than the `text` elements. So in order to use them I would have needed to export them multiple times. 

#### CSS Animations
 I did keep a lot of small little CSS hover animations, because they are fun and easy to do, without having that much extra effort. Getting a bit more into CSS the past few months, I discovered so many great ways to add small interactions to elements in a eays way. 

### Performance and Offline First
I decided to reduce the amount of images and external libraries I used, because it can bloat things. If I used images, I only imported them in the size I actually needed to display them. The `picture` element is really useful for performant images to load only the sizes you actually need. I used [this boilerplate](https://github.com/react-boilerplate/react-boilerplate) because it already has a lot of great things included, like _Service Workers_, _Routing_ and _Internationalization_.  It’s pretty straight forward to use if you already now React and don’t have that much time to set up an entirely new project or learn a new framework. Also I still consider `webpack` kinda hard to get into and I haven’t gotten around to learn it yet. 

### Minimal Blog Setup
Being a developer I love Markdown and decided I just wanted a minimal Blog Setup, where I had a folder with markdown files, that then in turn where all loaded from the Github repo  and display on the `\writing` route. 

For each new post I wanted to define a heading that had all the information in it, so I could display the posts according to the language set and maybe even filter them by keys. 

```markdown
title: Things to consider when creating a portfolio
lang: en
keys: portfolio, accessibility, animation
date: 2017-07-11
```

I ended up writing a little node script that created a JSON with all posts meta information like `lang, keys, date` and sorted them by date. This JSON was automatically updated everytime I pushed a new post with a `precommit hook`. Doing it this way, I didn’t have to go through all markdown files when accessing the `\writing` route. 

Then I added dynamic routing to my React application and just loaded the correct markdown file once a link was clicked. I used [react-markdown](https://github.com/rexxars/react-markdown) to parse the markdown file and display it. 

### Lessons learned
As a creative person I constantly have new ideas about fun things to animate and sometimes it’s hard to prioritise. I love [Codepen](https://codepen.io/lisilinhart/) for trying out new ideas and just do some quick prototypes. But in the process of creating this portfolio, I also realised that it’s important to keep it simple and concentrate on what the important information is a user is looking for when visiting your site. Once you have your minimal setup, you can always add more animations and little fun things. 
