const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const script = readFileSync(path.join(__dirname, 'main.js'), 'utf8');

const createElement = () => {
  const listeners = new Map();
  const attributes = new Map();
  const classes = new Set();

  return {
    clientWidth: 100,
    scrollBy: (options) => {
      this.lastScroll = options;
    },
    listeners,
    attributes,
    classes,
    addEventListener: (eventName, callback) => listeners.set(eventName, callback),
    getAttribute: (name) => attributes.get(name) || null,
    setAttribute: (name, value) => attributes.set(name, value),
    classList: {
      add: (name) => classes.add(name),
      remove: (name) => classes.delete(name),
      toggle: (name, force) => {
        const enabled = force === undefined ? !classes.has(name) : force;
        if (enabled) classes.add(name);
        else classes.delete(name);
        return enabled;
      },
    },
  };
};

const createPage = () => {
  const slider = createElement();
  const previousButton = createElement();
  const nextButton = createElement();
  const navigation = createElement();
  const navigationToggle = createElement();
  const menuIcon = createElement();
  const body = createElement();
  const elements = {
    '.slider__track': slider,
    '.slider__btn--prev': previousButton,
    '.slider__btn--next': nextButton,
    '.nav--header': navigation,
    '.nav__toggle': navigationToggle,
    '.menu-icon': menuIcon,
  };

  vm.runInNewContext(script, {
    document: {
      body,
      querySelector: (selector) => elements[selector] || null,
    },
  });

  return { slider, previousButton, nextButton, navigation, navigationToggle, menuIcon, body };
};

test('destination gallery controls scroll by a consistent viewport distance', () => {
  const page = createPage();
  const scrolls = [];
  page.slider.scrollBy = (options) => scrolls.push(options);

  page.previousButton.listeners.get('click')();
  page.nextButton.listeners.get('click')();

  assert.deepEqual(scrolls.map(({ left }) => left), [-80, 80]);
});

test('mobile navigation exposes its state and closes after a link is selected', () => {
  const page = createPage();

  page.navigationToggle.listeners.get('click')();
  assert.equal(page.navigationToggle.attributes.get('aria-expanded'), 'true');
  assert.equal(page.navigation.classes.has('nav--mobile'), true);
  assert.equal(page.body.classes.has('no-scroll'), true);

  page.navigation.listeners.get('click')({ target: { closest: () => true } });
  assert.equal(page.navigationToggle.attributes.get('aria-expanded'), 'false');
  assert.equal(page.navigation.classes.has('nav--mobile'), false);
  assert.equal(page.body.classes.has('no-scroll'), false);
});
