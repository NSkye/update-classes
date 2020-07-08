<p align="center">
  <img src="https://circleci.com/gh/NSkye/update-classes.svg?style=shield">
  <img src="https://img.shields.io/npm/v/update-classes">
  <img src="https://img.shields.io/bundlephobia/min/update-classes">
  <img src="https://img.shields.io/badge/typescript-%E2%89%A53.7-informational">
  <img src="https://img.shields.io/npm/dt/update-classes">
</p>  

<h1 align="center">update-classes</h1>  

A simple JavaScript utility for updating DOM-element's classlist  
  
A small wrapper built around `Element.classList` with support of multiple DOM-elements, conditional class application, several ways to specify updated classes, calls chaining and more  

#### [Changes in v1.1.0](https://github.com/NSkye/update-classes/pull/2)

<a id="contents"></a>
## Table of contents
* [Installation](#installation)
* [Description](#description)
* [When I should use it?](#when-to-use)
* [Usage](#usage)
  - [Applying classes to single or multiple targets](#applying)
  - [Specifying which classes to update](#specifying)
    - [Object notation](#object)
    - [String notation](#string)
    - [Array notation](#array)
  - [Chaining calls](#chaining)
  - [Chainable options](#chainable)
    - [`scope`](#scope)
    - [`target`](#target)
    - [`classes`](#classes)
    - [Note](#note)
    - [Under the hood](#under-the-hood)
  - [Working with BEM notation](#bem)
  - [Handling animations and transitions](#animations)
* [Browser support](#browser-support)
* [License](#license)

<a id="installation"></a>
## Installation
npm:
```
npm i update-classes
```
yarn:
```
yarn add update-classes
```
  
[To contents](#contents)  
<a id="description"></a>
## Description
This small utility is designed to provide convenient tooling for modifications of DOM-element's classList and help to get rid of large amounts of repetitive code when updating classLists of elements, such as:

```javascript
element1.classList.remove('active')
element2.classList.remove('active')
element1.classList.remove('selected')
element2.classList.remove('selected')
```
with this utility code above can be made much less repetitive and much more readable:
```javascript
updateClasses([ element1, element2 ], {
  active: false,
  selected: false
})
```
  
[To contents](#contents)  
<a id="when-to-use"></a>
## When should I use it?
When you are working on a small to medium scale project developed mostly with Vanilla JavaScript, or when you just playing in sandbox and don't want deal with complex UI frameworks and libraries. updateClasses also works great when combined with [Stimulus](https://github.com/stimulusjs/stimulus)
### Can I use it with React?
While you certainly can make it work with React using React's ref API, you probably should avoid such practice. React was designed for rendering data to the DOM, which means it has all this functionality by default. If you want more convenient conditional rendering of css-classes in React, [classnames](https://github.com/JedWatson/classnames) utility is exactly what you need
  
[To contents](#contents)  
<a id="usage"></a>
## Usage
Import updateClasses utility:
```javascript
import updateClasses from 'update-classes'
```
<a id="applying"></a>
  
[To contents](#contents)  
### Applying classes to single or multiple targets
You can use it with single or multiple targets, just be sure to wrap them in an array there're more than one:
```javascrpt
updateClasses(target1, { 'class-to-enable': true })
updateClasses([ target1, target2 ], { 'class-to-enable': true })
```
  
[To contents](#contents)  
<a id="specifying"></a>
### Specifying which classes to update
There're multiple ways to point out which classes to be updated and how. CSS-classes that should be updated are always specified in second argument.
<a id="object"></a>
#### Object notation
With object notation classes are specified in object, where keys are CSS-classes that should be updated and values represent how these classes will be updated, values can be either of boolean or string type:  
`true` - add  
`false` - remove  
`string` - replace with specified class
```javascript
updateClasses(target, { 
  'to-add': true, // this class will be added
  'to-remove': false, // this class will be removed
  'to-replace': 'replacement', // this class will be replaced by 'replacement' class,
  'to-toggle': '~toggle' // this class will be toggled
 })
 ```
This notation is very convenient when you want to replace multiple classes or apply them conditionally:
```javascript
const { currentScore } = this.state
updateClasses(this.scoreTarget, {
  'bg-red': currentScore < 40,
  'bg-yellow': currentScore >= 40 && currentScore < 70,
  'bg-green': currentScore >= 70
})
```
  
[To contents](#contents)  
<a id="string"></a>
#### String notation
In string notation updated classes are specified (surprise!) with a string, in which they should be separated with spaces and classes that are to be removed should have a `!` prefix:
```javascript
updateClasses(target, 'to-add') // with no prefix class will be added
updateClasses(target, '!to-remove') // with prefix '!' it will be removed
updateClasses(target, '~to-toggle') // with prefix '~' it will be toggled

// You're also free to specify as many classes as you want in a single string:
updateClasses(target, 'to-add-1 !to-remove-1 to-add-2 !to-remove-2 ~to-toggle')
```
This notation is convenient when you don't really need to replace or conditionally update classes and want to make your code as readable as possible.
  
[To contents](#contents)  
<a id="array"></a>
#### Array notation
Array allows to specify several class updates similar to string notation (`!` is also relevant):
```javascript
updateClasses(target, [ 'to-add', '!to-remove', '!another-to-remove', '~to-toggle'])
```
but it also allows to specify its elements with any other notation:
```javascript
updateClasses(target, [
  {
    'to-replace': 'replacement',
    'to-add': true
    'to-remove': true
    'to-toggle': '~toggle'
  },
  '!also-to-remove also-to-add',
  '!and-another-to-remove',
  '~also-to-toggle'
])
```
you can even specify classes in array inside another array ...and inside another array ...and inside another array
```javascript
updateClasses(target, [ [ [ [ '!class-that-should-be-removed-as-fast-as-possible' ] ] ] ])
```
<sub>*Even though I can't see why you would commit such atrocity, but if you feel like it keep in mind that you can!*</sub> 
    
[To contents](#contents)  
  
<a id="chaining"></a>
### Chaining calls
If you need to update multiple different classes on multiple elements and avoid repeating typing duplicate code, you can use call chaining. After every call `updateClasses` returns an object where methods `.also()` and `.and()` refer to itself so you can use this shorthand to avoid repeating yourself:
```javascript
updateClasses(target1, 'to-add')
  .also(target2, '!to-remove')
  .and(target3, '!another-to-remove')
```
  
[To contents](#contents)  
<a id="chainable"></a>
### Chainable options

It is now possible to create additional updateClasses instances, with specific presets. It is useful when you need to call it with same arguments multiple times or when you follow some rules involving class scoping (like [BEM](https://en.bem.info/)).

There're 3 methods for creating new instances of `updateClasses` function: `scope`, `target`, `classes`.
  
[To contents](#contents)  
<a id="scope"></a>
#### `scope`
Method `scope` creates new instance of updateClasses in which every passed class will be prefixed with provided string:
```javascript
const updateFoo = updateClasses.scope('foo__')

updateFoo(someElement1, 'button icon label')

someElement1.classList // -> [ 'foo__button', 'foo__icon', 'foo__label' ]


// If you decide to add another scope it will be added AFTER the current scope

const updateFooBar = updateFoo.scope('bar--')

updateFooBar(someElement2, 'active red left')

someElement2.classList // -> [ 'foo__bar--active', 'foo__bar--red', 'foo__bar--left' ]
```
  
[To contents](#contents)  
<a id="target"></a>
#### `target`
Method `target` creates new instance of updateClasses which will be binded to provided specific target:
```javascript
const updateMyElement = updateClasses.target(myElement)

updateMyElement(null, 'foo')

myElement.classList // -> [ 'foo' ]


// You still can pass other targets if you want, but binded target will always be modified

updateMyElement(otherElement, 'bar')

myElement.classList // -> [ 'foo', 'bar' ]
otherElement.classList // -> [ 'bar' ]
```
  
[To contents](#contents)  
<a id="classes"></a>
#### `classes`
Method `classes` creates new instance of updateClasses which will always add/remove/toggle provided classes from target:
```javascript
const makeFoo = updateClasses.classes('foo')

makeFoo(someElement)

someElement.classList // -> [ 'foo' ]
```
Classes can be provided in any notation.  
<a id="note"></a>
#### Note
Every instance created by `scope`, `target`, `classes` methods is immutable and completely independent from its parent
<a id="under-the-hood"></a>
#### Under the hood
Every instance of updateClasses now contains `options` object which is can't be accessed from outside and has following signature:
```typescript
interface IOptions {
  scope: string;
  ensureTargets: Element[];
  ensureClasses: Array<
    ClassesToUpdate.IStringNotation |
    ClassesToUpdate.IObjectNotation
  >;
}
```
If you really need to see `options` object, you can recieve its copy with `__extractOptions` method:

```javascript
// Default options object
updateClasses.__extractOptions() // -> { scope: '', ensureTargets: [], ensureClasses: [] }
```
Each updateClasses instance has separate options object. 
  
[To contents](#contents)  
<a id="bem"></a>
### Working with BEM notation
With chainable `scope` method you can now easily work using [BEM](https://en.bem.info/) (Block Element Modifier) methodology:  
  
HTML:
```html
<div id='my-block'>
  <button id='my-button'></button>
</div>
```
JS:
```javascript
const myBlock = document.querySelector('#my-block')
const myBlockButton = document.querySelector('#my-button')

const updateMyBlock = updateClasses.scope('my-block')

const updateMyBlockModifier = updateMyBlock.scope('--')
updateMyBlockModifier(myBlock, 'active')
myBlock.classList // -> [ 'my-block--active' ]

const makeMyBlockElement = updateMyBlock.scope('__')
updateMyBlockElement(myBlockButton, 'button')
myBlockButton.classList // -> [ 'my-block__button' ]

const updateMyBlockButtonModifier = makeMyBlockButton.scope('--')
updateMyBlockButtonModifier(myBlockButton, 'disabled')
myBlockButton.classList // -> [ 'my-block__button', 'my-block__button--disabled' ]
```
  
[To contents](#contents)  
<a id="animations"></a>
### Handling animations and transitions
CSS is also used a lot to animate things, and at lot of times after animation (or transition) you need to remove class that triggered animation (perhaps you want to animate this element again in the future) or add another class (to start a different animation sequence for example). For these cases the return object contains `.afterAnimation()` and `.afterTransition()` methods, which will not apply classes immediatly, but after animation or transition sequence on updating elements will end. They're also don't have target parameter, all targets are being inherited from an original call:
```javascript
updateClasses(target, 'fade-out-animation')
  .afterAnimation('display-none-utility-class')
  // here we apply class with display none after animation finishes to avoid interruptions
```
*Note: Don't use these methods for excessevly long animations as some browsers kill animation and transition sequences when user switches to another tab which will make `animationend` and `transitionend` events to never appear and listeners applied by these methods will continiously and pointlessly wait for them producing memeory leaks. Also don't interrupt animations with properties that cause repaint of elements (such as `display: none`) as this doesn't produce corresponding events and leads to same problem.  
Basically treat these methods as a shorthand for manually applying `animationend` and `transitionend` event listeners.*
  
[To contents](#contents)  
<a id="browser-support"></a>
## Browser support
### Full support of class updates
- Edge 12+
- Firefox 3.6+
- Chrome 8+
- Safari 5.1+
- Opera 11.5+
- iOS Safari/Chrome 5+
- Opera Mini

### Partial support of class updates
- Internet Explorer 10+ (does not support class replacement)  
  
Might work on older browsers with classList polyfill.

### Support of `.afterAnimation()` and `.afterTransition()` methods
Depends on browser's support of [`animationend`](https://caniuse.com/#search=animationend) and [`transitionend`](https://caniuse.com/#search=transitionend) events.
  
[To contents](#contents)  
<a id="license"></a>
## License
MIT
