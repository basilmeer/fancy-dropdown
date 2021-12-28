# FancyDropdown

A small jQuery-based library that allows you to create a relatively more style-able dropdown.

[Demo](https://basilmeer.github.io/fancy-dropdown/)

# Usage

Pretty much all you need is a readonly input field with the class `fancy-dropdown` and the options passed like so:

```html
<input type='text' class='fancy-dropdown' data-fd-options="['foo', 'bar']" readonly />
```

This gets transformed into a slightly fancier looking dropdown that looks something like:

```html
<div class="fancy-dropdown-wrapper">
  <input type='hidden' name='fd_0' /> <!-- Contains the actual value -->
  <input type='text' class='fancy-dropdown' readonly /> <!-- Contains the visible value -->
  <div class="fancy-dropdown-options"> <!-- Contains the options -->
    <ul class="options-list">
      <li class="option-item" data-value="0">foo</li>
      <li class="option-item" data-value="1">bar</li>
    </ul>
  </div>
</div>
```

# Dropdown Options

The options can be passed through the `data-fd-options` that can either be an array or a JSON object like so:

```html
<input type='text' class='fancy-dropdown' data-fd-options="{'top': 'teemo', 'mid': 'gangplank'}" name="favorite-champions" readonly />
```

Which converts the input field to:

```html
<div class="fancy-dropdown-options">
  <ul class="options-list">
    <li class="option-item" data-value="teemo">top</li>
    <li class="option-item" data-value="gangplank">mid</li>
  </ul>
</div>
```

# Name Attribute

By default, FD sets a unique name attribute for the hidden input field that can be processed through a form but you can also set one explicitly by giving the input text field a name:

```html
<input type='text' class='fancy-dropdown' data-fd-options="['arcane', 'cowboy bebop']" name="favorite-shows" readonly />
```

Which sets the hidden input field's name attribute:

```html
<input type='hidden' name='favorite-shows' />
```
