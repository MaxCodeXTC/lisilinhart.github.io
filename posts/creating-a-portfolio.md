---
title: Things to consider when creating a portfolio
lang: en
keys: tech, accessibility, animation, portfolio
date: 2017-07-11
---

# Things to consider when creating a portfolio
### Accessibility
It was important to me to create an portfolio that considered the most important aspects of accessibility.  The [Accessibility Checklist](http://a11yproject.com/checklist.html) is a good resource to start with. 

#### Make it fully accessible via keyboard
As many people only use the keyboard to navigate websites, it was important to me to be able to access every part of the site using only the keyboard. So how did I do this?
- Use `a` or `button` for navigational elements.
- Specify `role="navigation"`  on your `<nav>` element
- Use `tabindex `  for important navigational elements.
- For SVG Icons always use the `title` attribute if it doesn’t include text (e.g. social media icons)
```html
<a tabindex="0" class="active" href="/">About</a>
```

Since my side navigation is only shown on `:hover` ,  the `:focus` CSS didn’t get triggered on the parent, since it only happened on the child link. Since there aren’t any parent selectors in CSS yet ([CSS4 Parent Selectors](https://www.w3.org/TR/selectors4/) to the rescue ). I had to do add `onFocus` and `onBlur`  Event Listeners on the Links. When a link got focused via the keyboard I added an `.focused` class to the parent, which did the same thing as the `:hover`. When it lost focus, I removed this class again. 

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

I encourage everyone to take a look at the basic accessibility rules one should do as a developer, because we can make life so much easier for people using Screen Readers with not that much more effort. If you want to get a feel on how a Screen Reader works, just open up /VoiceOver/ on MacOs and try navigating a few websites. /[NVDA](https://www.nvaccess.org/)/ is free windows equivalent. 

### Animations
The first versions of my portfolio involved a lot more animations and interactive SVG things. Although I do love animations, I decided to reduce them a bit and only use them where they actually make sense and don’t /distract the user/ from what’s actually important. 

#### SVG text animations & multilanguage
I did a few text heading animations in SVG in my first version, which turned out to be a problem when I wanted to make the site German and English, because I would have to export every SVG in two languages, because it wasn’t made of a `text` element. 

#### CSS Animations
 I did keep a lot of small little CSS hover animations, because they are fun and easy to do, without having that much extra effort.

### Performance and Offline First
I decided to reduce the amount of images and external libraries I used to avoid bloat. If I used images, I only imported them in the size I actually needed to display them. I used [this boilerplate](https://github.com/react-boilerplate/react-boilerplate) because it already has a lot of great things included, like /Service Workers/, /Routing/ and /Internationalization/.  It’s pretty straight forward to use if you already now React and don’t have that much time to set up an entirely new project. Also `webpack` is hard and I haven’t gotten around to learn it yet. 

### Minimal Blog Setup
Being a developer I love Markdown and decided I just wanted a minimal Blog Setup, where I had a folder with markdown files, that then in turn where all loaded from the Github repo  and display on the `\writing` route. For each new post I wanted to define a heading that had all the information in it, so I could display the posts according to the language set and maybe even filter them by keys. 

```markdown
⏤⏤⏤
title: Creating a portfolio
lang: en
keys: tech, accessiblity, animation
date: 2017-07-09
⏤⏤⏤
```

I ended up writing a little node script that created a JSON with all posts heading information like `lang, keys, date`, that updated everytime I pushed a new post, so I didn’t have to go through all files when accessing the `\writing` route. 

Then I added dynamic routing to my React application and just loaded the correct markdown file once a link was clicked. I used [react-markdown](https://github.com/rexxars/react-markdown) to parse the markdown file and display it. 

### Lessons learned
As a creative person I constantly have new ideas about fun things to animate and mostly it’s hard to prioritise. I love [Codepen](https://codepen.io/lisilinhart/) for trying out new ideas and just prototype. But in the process of creating this portfolio, I also realised that it’s important to keep it simple and  concentrate on what the important information is a user is looking for when visiting your site. Once you have your minimal setup, you can always add more animations and little fun things. 
