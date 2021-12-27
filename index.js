/*
  TODO:
    * Allow support for custom values that is enabled through an option flag
    * Improve base styling and allow for easy customizable stylings
    * Add dropdown wrapper and hidden input field through JS
    * Insert options list through a unique data attr
    * Add dynamically updating name attr if not explicitly specified
*/
function fancyDropdown() {
  // Update the values of the visible dropdown and the actual hidden input field
  const setDropdownValues = (
    text,
    value,
  ) => {
    const ref = $(".fancy-dropdown-wrapper");

    // Don't chonge the value if the selected is already set
    if (
      $(ref)
        .siblings(".fancy-dropdown-options")
        .find("ul.options-list")
        .data("selected") === value
    ) {
      return;
    }

    if (value) $(ref).find("input[type=hidden]").val(value);

    if (text) $(ref).find("input[type=text]").val(text.trim());

    $(ref).find("input[type=hidden]").trigger("change");
    $(ref).find("input[type=text]").trigger("change");

    // Updated data-selected
    $(ref)
      .siblings(".fancy-dropdown-options")
      .find(".options-list")
      .attr("data-selected", value);
  };

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

  const handleOptionSelect = () => {
    // Provider dropdown option click handling
    $(document).on("click", ".fancy-dropdown-options .option-item", (e) => {
      const optionLink = $(e.target);
      const optionItem = optionLink.parent();
      const optionText = optionLink.text();
      const optionValue = optionItem.attr("data-value") || optionText; // fallback to text for value if not explicit

      // Update value of the 'dropdown' i.e. the text field
      setDropdownValues(
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

  const initialize = (base) => {
    // Set initial values
    $(`${base} .fancy-dropdown`).each((i, el) => {
      const optionsList = $(el)
        .siblings(".fancy-dropdown-options")
        .find(".options-list");
      const firstOption = $(el)
        .siblings(".fancy-dropdown-options")
        .find(".option-item")
        .first();
      const selectedValue = optionsList.data("selected");
      const defaultText = firstOption.text();
      let text = "";

      // Check if the selected attr has any value, if not then use the first available value
      if (selectedValue) {
        // If the selected value does not have a corresponding option item then use the first option item
        optionsList.find(".option-item").each((i, ele) => {
          if (selectedValue === $(ele).data("value")) {
            text = $(ele).text();
          } else if (
            $(ele).data("href").length &&
            selectedValue?.includes($(ele).data("href"))
          ) {
            text = $(ele).text() || defaultText;
          }
        });
      } else {
        text = defaultText;
      }

      setDropdownValues(text, null);
    });
  }

  initialize(base='body');
  handleShowingOptions();
  handleHidingOptions();
  handleOptionSelect();
  handleCustomValues();
}

fancyDropdown();