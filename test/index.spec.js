'use strict';

const updateClasses = require('../src/index')

const defaultClasses = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6']
let mockHTMLElement = null
let mockHTMLElement1 = null
let mockHTMLElement2 = null

beforeEach(() => {
  mockHTMLElement = document.createElement('div')
  defaultClasses.forEach(className => mockHTMLElement.classList.add(className))

  mockHTMLElement1 = document.createElement('div')
  defaultClasses.forEach(className => mockHTMLElement1.classList.add(className))
  mockHTMLElement2 = document.createElement('div')
  defaultClasses.forEach(className => mockHTMLElement2.classList.add(className))
})

describe('Update classes with an object notation', () => {
  test('Add single class', () => {
    updateClasses(mockHTMLElement, {
      'test-class': true
    })

    expect(mockHTMLElement.classList).toContain('test-class')
  })

  test('Add multiple classes', () => {
    updateClasses(mockHTMLElement, {
      'test-class-1': true,
      'test-class-2': true
    })

    expect(mockHTMLElement.classList).toContain('test-class-1')
    expect(mockHTMLElement.classList).toContain('test-class-2')
  })

  test('Remove single class', () => {
    updateClasses(mockHTMLElement, {
      'c1': false
    })

    expect(mockHTMLElement.classList).not.toContain('c1')
  })

  test('Remove multiple classes', () => {
    updateClasses(mockHTMLElement, {
      'c1': false,
      'c2': false
    })

    expect(mockHTMLElement.classList).not.toContain('c1')
    expect(mockHTMLElement.classList).not.toContain('c2')
  })
  
  test('Replace single class', () => {
    updateClasses(mockHTMLElement, {
      'c1': 'c1-replacement'
    })

    expect(mockHTMLElement.classList).toContain('c1-replacement')
    expect(mockHTMLElement.classList).not.toContain('c1')
  })

  test('Replace multiple classes', () => {
    updateClasses(mockHTMLElement, {
      'c1': 'c1-replacement',
      'c2': 'c2-replacement'
    })

    expect(mockHTMLElement.classList).not.toContain('c1')
    expect(mockHTMLElement.classList).toContain('c1-replacement')
    expect(mockHTMLElement.classList).not.toContain('c2')
    expect(mockHTMLElement.classList).toContain('c2-replacement')
  })

  test('Update classes on multiple elements', () => {
    const classesToRemove = ['c1', 'c2', 'c3', 'c4']
    const classesToAdd = ['c1-replacement', 'c2-replacement', 'c7', 'c8']
    const classesToRemainUntouched = ['c5', 'c6']

    updateClasses([mockHTMLElement1, mockHTMLElement2], {
      c1: 'c1-replacement',
      c2: 'c2-replacement',
      c3: false,
      c4: false,
      c7: true,
      c8: true
    })

    classesToRemove.forEach(expect(mockHTMLElement1.classList).not.toContain)
    classesToRemove.forEach(expect(mockHTMLElement2.classList).not.toContain)
    classesToAdd.forEach(expect(mockHTMLElement1.classList).toContain)
    classesToAdd.forEach(expect(mockHTMLElement2.classList).toContain)
    classesToRemainUntouched.forEach(expect(mockHTMLElement1.classList).toContain)
    classesToRemainUntouched.forEach(expect(mockHTMLElement2.classList).toContain)
  })
})

describe('Update classes with a string notation', () => {
  test('Add single class', () => {
    updateClasses(mockHTMLElement, 'test-class')
    expect(mockHTMLElement.classList).toContain('test-class')
  })

  test('Add multiple classes', () => {
    const classesToAdd = ['test-class-1', 'test-class-2', 'test-class-3']
    updateClasses(mockHTMLElement, classesToAdd.join(' '))
    classesToAdd.forEach(expect(mockHTMLElement.classList).toContain)
  })

  test('Remove single class', () => {
    updateClasses(mockHTMLElement, '!c1')
    expect(mockHTMLElement.classList).not.toContain('c1')
  })

  test('Remove multiple classes', () => {
    const classesToRemove = ['c1', 'c2', 'c3']
    updateClasses(mockHTMLElement, classesToRemove.map(cssClass => `!${cssClass}`).join(' '))
    classesToRemove.forEach(expect(mockHTMLElement.classList).not.toContain)
  })

  test('Toggle single class', () => {
    const classesToRemove = ['c1', 'c2', 'c3']
    const classesToAdd = ['c7']

    updateClasses(mockHTMLElement, '~c1 ~c2 ~c3 ~c7')
    classesToRemove.forEach(expect(mockHTMLElement.classList).not.toContain)
    classesToAdd.forEach(expect(mockHTMLElement.classList).toContain)
  })

  test('Update classes on multiple elements', () => {
    const classesToRemove = ['c1', 'c2', 'c3', 'c4']
    const classesToAdd = ['c7', 'c8']
    const classesToRemainUntouched = ['c5', 'c6']

    updateClasses([mockHTMLElement1, mockHTMLElement2], '!c1 !c2 ~c3 ~c4 c7 c8')

    classesToRemove.forEach(expect(mockHTMLElement1.classList).not.toContain)
    classesToRemove.forEach(expect(mockHTMLElement2.classList).not.toContain)
    classesToAdd.forEach(expect(mockHTMLElement1.classList).toContain)
    classesToAdd.forEach(expect(mockHTMLElement2.classList).toContain)
    classesToRemainUntouched.forEach(expect(mockHTMLElement1.classList).toContain)
    classesToRemainUntouched.forEach(expect(mockHTMLElement2.classList).toContain)
  })
})

describe('Update classes with an array notation', () => {
  test('Update classes on multiple elements with mixed notations', () => {
    const classesToRemove = ['c1', 'c2', 'c3', 'c4']
    const classesToAdd = ['a1', 'a2', 'a3', 'a4', 'a5', 'a6']
    const classesToRemainUntouched = ['c5', 'c6']

    updateClasses([mockHTMLElement1, mockHTMLElement2], [
      '!c1 !c2 a1 a2',
      { c3: 'a3', c4: false, a4: true },
      ['a5', { a6: true }]
    ])

    classesToRemove.forEach(expect(mockHTMLElement1.classList).not.toContain)
    classesToRemove.forEach(expect(mockHTMLElement2.classList).not.toContain)
    classesToAdd.forEach(expect(mockHTMLElement1.classList).toContain)
    classesToAdd.forEach(expect(mockHTMLElement2.classList).toContain)
    classesToRemainUntouched.forEach(expect(mockHTMLElement1.classList).toContain)
    classesToRemainUntouched.forEach(expect(mockHTMLElement2.classList).toContain)
  })
})

describe('Call chaining', () => {
  test('Chain updateClasses calls with "also" method', () => {
    updateClasses(mockHTMLElement1, '!c1 r1')
      .also(mockHTMLElement2, '!c2 r2')

    expect(mockHTMLElement1.classList).not.toContain('c1')
    expect(mockHTMLElement2.classList).not.toContain('c2')
    expect(mockHTMLElement1.classList).toContain('r1')
    expect(mockHTMLElement2.classList).toContain('r2')
  })

  test('Chain updateClasses calls with "and" method', () => {
    updateClasses(mockHTMLElement1, '!c1 r1')
      .and(mockHTMLElement2, '!c2 r2')

    expect(mockHTMLElement1.classList).not.toContain('c1')
    expect(mockHTMLElement2.classList).not.toContain('c2')
    expect(mockHTMLElement1.classList).toContain('r1')
    expect(mockHTMLElement2.classList).toContain('r2')
  })
})

describe('Advanced chaining', () => {
  test('Scopes & prefixes', () => {
    const updateFoo = updateClasses
      .scope('foo__')

    const updateFooBar = updateFoo
      .scope('bar--')

    updateFoo(mockHTMLElement, 'c7')
    expect(mockHTMLElement.classList).toContain('foo__c7')

    updateFooBar(mockHTMLElement, 'c8')
    expect(mockHTMLElement.classList).toContain('foo__bar--c8')

    updateFoo(mockHTMLElement, 'c9')
    expect(mockHTMLElement.classList).toContain('foo__c9')
  })

  test('Targets & classes', () => {
    const updateMockElement = updateClasses
      .target(mockHTMLElement)
    updateMockElement(null, 'c7')
    expect(mockHTMLElement.classList).toContain('c7')

    const updateMockElementC7 = updateMockElement
      .classes('~c7')
    updateMockElementC7()
    expect(mockHTMLElement.classList).not.toContain('c7')
    updateMockElementC7()
    expect(mockHTMLElement.classList).toContain('c7')

    updateMockElement(null, 'c8')
    expect(mockHTMLElement.classList).toContain('c7')
    expect(mockHTMLElement.classList).toContain('c8')
  })

  test('With call chaining', () => {
    updateClasses(mockHTMLElement, 'my-block')
    const myBlockScope = updateClasses.scope('my-block')
    const updateMyBlockModifier = myBlockScope.scope('--')

    updateMyBlockModifier(mockHTMLElement, 'foo')
      .also(mockHTMLElement, 'bar')

    expect(mockHTMLElement.classList).toContain('my-block')
    expect(mockHTMLElement.classList).toContain('my-block--foo')
    expect(mockHTMLElement.classList).toContain('my-block--bar')

    const updateMyCertainBlockModifier = updateMyBlockModifier
      .target(mockHTMLElement1)
      .classes('active')

    updateMyCertainBlockModifier()
      .also(null, 'foo')
      .also(null, 'bar')

    expect(mockHTMLElement1.classList).toContain('my-block--active')
    expect(mockHTMLElement1.classList).toContain('my-block--foo')
    expect(mockHTMLElement1.classList).toContain('my-block--bar')
  })
})

describe('Animation and transition handling', () => {
  test('"afterAnimation" method', done => {
    updateClasses(mockHTMLElement, 'some-animation-class')
      .afterAnimation('!some-animation-class')

    setTimeout(() => mockHTMLElement.dispatchEvent(new Event('animationend')), 0)

    expect(mockHTMLElement.classList).toContain('some-animation-class')

    mockHTMLElement.addEventListener('animationend', () => {
      expect(mockHTMLElement.classList).not.toContain('some-animation-class')
      done()
    })
  })

  test('"afterTransition" method', done => {
    updateClasses(mockHTMLElement, 'some-transition-class')
      .afterTransition('!some-transition-class')

    setTimeout(() => mockHTMLElement.dispatchEvent(new Event('transitionend')), 0)

    expect(mockHTMLElement.classList).toContain('some-transition-class')

    mockHTMLElement.addEventListener('transitionend', () => {
      expect(mockHTMLElement.classList).not.toContain('some-transition-class')
      done()
    })
  })

  test('With advanced chaining', done => {
    const example = updateClasses
      .scope('scope--')
      .target(mockHTMLElement)
      .classes('dummy')

    example()
      .afterAnimation('foo')

    setTimeout(() => mockHTMLElement.dispatchEvent(new Event('animationend')), 0)

    expect(mockHTMLElement.classList).toContain('scope--dummy')

    mockHTMLElement.addEventListener('animationend', () => {
      expect(mockHTMLElement.classList).toContain('scope--foo')
      done()
    })
  })
})
