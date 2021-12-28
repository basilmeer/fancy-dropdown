/*
  TODO:
    * Allow support for custom values that is enabled through an option flag
    * Improve base styling and allow for easy customizable stylings
    * Insert a sleeve for adding the animated caret
*/

/**
 * Insert any missing required HTMLElements necessary for fancy dropdowns
 * @date 2021-12-28
 * @returns {any}
 */
const insertExtraHtmlElements = () => {
  // Chck if fancy-dropdown has a parent class of fancy-dropdown-wrapper
  // There can be multiple dropdowns on the page, so need to check dynamically
  $(".fancy-dropdown").each((i, el) => {
    const currentDropdown = $(el);
    const currDropOptions = currentDropdown.siblings('.fancy-dropdown-options');
    const nameAttr = currentDropdown.attr('name') || `fd_${i}`;

    // Remove name attr from input[type=text] to use on input[type=hidden]
    currentDropdown.removeAttr('name');

    if (!currentDropdown.parent().hasClass('fancy-dropdown-wrapper')) {
      currentDropdown.wrap("<div class='fancy-dropdown-wrapper'></div>");

      // Check if options-list is present; if so, move it in here
      // This scenario would only occur if the user manually adds the dropdown options
      if (currDropOptions.length) {
        currDropOptions.appendTo(currentDropdown.parent());
      }
    }

    if (!currentDropdown.siblings('input[type=hidden]').length) {
      currentDropdown.before(`<input type='hidden' value='' name='${nameAttr}' />`);
    }

    if (!currentDropdown.parent().find('.fancy-dropdown-options').length) {
      currentDropdown.after(`
        <div class="fancy-dropdown-options">
          <ul class="options-list">
          </ul>
        </div>
      `);
    }

    // if (!currentDropdown.parent().hasClass('fancy-dropdown-sleeve')) {
    //   currentDropdown.wrap("<div class='fancy-dropdown-sleeve'></div>");
    // }
  })
}

/**
 * Insert the dropdown options inside the dropdown wrapper for use
 * @date 2021-12-28
 * @returns {any}
 */
const insertDropdownOptions = () => {
  // There are 2 scenarios possible with the options: we are given 1) an Array, 2) a JSON
  // In (1), we will used the elements' indices as their values and the el itself as text
  // In (2), we will use the key as text, and value as value

  $(".fancy-dropdown").each((i, el) => {
    const currentDropdown = $(el);
    const currDropOptions = JSON.parse(currentDropdown.attr('data-fd-options').replace(/'/g, '"'));

    if (Array.isArray(currDropOptions)) {
      // We use indices as values if options are an array; otherwise
      $.each(currDropOptions, (i, el) => {
        currentDropdown.siblings('.fancy-dropdown-options').children('.options-list').append(
          `<li class="option-item" data-value="${i}">${el}</li>`)
      });
    } else {
      // We use keys as text, and their values as literal values
      $.each(currDropOptions, (key, val) => {
        currentDropdown.siblings('.fancy-dropdown-options').children('.options-list').append(
          `<li class="option-item" data-value="${val}">${key}</li>`)
      });
    }

    // Clean out the dropdown options once they've been used up
    currentDropdown.removeAttr('data-fd-options');
  })
}

/**
 * Update the values of the visible dropdown and the actual hidden input field
 * @date 2021-12-28
 * @param {string} ref - The element with respect to which the changes are made
 * @param {string} text - The 'value' shown to the user
 * @param {any} value - The actual value processed
 * @returns {any}
 */
  const setDropdownValues = (ref, text, value) => {
  // Update values
  if (value) $(ref).find("input[type=hidden]").val(value.trim());
  if (text) $(ref).find("input[type=text]").val(text.trim());

  // Trigger on change events in case needed
  $(ref).find("input[type=hidden]").trigger("change");
  $(ref).find("input[type=text]").trigger("change");

  // Updated the data-selected attr
  $(ref).find(".options-list").attr("data-selected", value);
};

/**
 * Handle the event for showing the dropdown options
 * @date 2021-12-28
 * @returns {any}
 */
const handleShowingOptions = () => {
  // Show the options when the user clicks on the dropdown
  $(document).on("click", "input.fancy-dropdown", (e) => {
    const dropdown = $(e.target);
    const dropdownOptions = dropdown
      .parents(".fancy-dropdown-wrapper")
      .find(".fancy-dropdown-options");

    $(".fancy-dropdown").removeClass("open");
    $(".fancy-dropdown-options").removeClass("show");
    dropdownOptions.addClass("show");
    dropdown.parents(".fancy-dropdown").addClass("open");
  });
}

/**
 * Handle the event for hiding the dropdown options
 * @date 2021-12-28
 * @returns {any}
 */
const handleHidingOptions = () => {
  // Hide the provider dropdown options if they are open
  $(document).on("click", (e) => {
    if (
      $(e.target).is(":not(.fancy-dropdown)") &&
      $(e.target).is(":not(.fancy-dropdown input)") &&
      $(e.target).is(":not(.custom-value-field)") &&
      $(e.target).is(":not(.proceed-btn)")
    ) {
      $(".fancy-dropdown-options").removeClass("show");
      $(".fancy-dropdown").removeClass("open");
    }
  });
}

/**
 * Handle the event when an option-item is selected
 * @date 2021-12-28
 * @returns {any}
 */
const handleOptionSelect = () => {
  // Provider dropdown option click handling
  $(document).on("click", ".fancy-dropdown-options .option-item", (e) => {
    const optionItem = $(e.target);
    const optionText = optionItem.text();
    const optionValue = optionItem.attr("data-value") || optionText; // fallback to text for value if not explicit

    // Update value of the 'dropdown' i.e. the text field
    setDropdownValues(
      optionItem.parents('.fancy-dropdown-wrapper'),
      optionText,
      optionValue,
    );
  });
}

// TODO: Fix this with the new implementation
const handleCustomValues = () => {
  // Update dropdown text depending on custom inputted value
  $(document).on("click", ".fancy-dropdown-options .custom-value-btn", (e) => {
    const saveButton = $(e.target);
    const customInputField = saveButton.siblings(".custom-value-field");
    const optionParent = saveButton
      .parents(".fancy-dropdown-wrapper")
      .find(".fancy-dropdown");
    const optionPrefix = saveButton.parents(".option-item")?.data("prefix");
    const optionSuffix = saveButton.parents(".option-item")?.data("suffix");

    // Update value of the 'dropdown' i.e. the text field
    if (customInputField.val().length == 0) return;

    setDropdownValues(
      `${optionPrefix}${customInputField.val()} ${optionSuffix}`,
      customInputField.val(),
    );

    // Wipe the custom input field and close the dropdown
    customInputField.val("");
    e.preventDefault();
  });
}

/**
 * Setup the fancy dropdowns in their initial state
 * @date 2021-12-28
 * @returns {any}
 */
const setInitialValues = () => {
  $('.fancy-dropdown').each((i, el) => {
    const options = $(el).siblings(".fancy-dropdown-options");
    const optionsList = options.find(".options-list");
    const firstOption = options.find(".option-item").first();
    let value = optionsList.data("selected");
    let text = firstOption.text();


    // Check if the selected attr has no value; if not then use the first available value
    if (!value?.length) {
      text = firstOption.text();
      value = firstOption.attr('data-value');
    }

    setDropdownValues($(el).parents('.fancy-dropdown-wrapper'), text, value);
  });
}

// Method in case there is a need to re-init dropdowns manually
const initializeFancyDropdown = () => {
  insertExtraHtmlElements();
  insertDropdownOptions();
  setInitialValues();
  handleShowingOptions();
  handleHidingOptions();
  handleOptionSelect();
  handleCustomValues();
}

// Start up the fancy dropdowns
$(function() {
  initializeFancyDropdown();
})
