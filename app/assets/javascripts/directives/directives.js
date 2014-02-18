/******************/
/*** Directives ***/
/******************/

angular.module('oneListApp').directive('removeItem', function() {
  return function(scope, element, attrs) {
    // When remove item is clicked the list item animates off the page, collapses then is removed from the scope
    element.bind('click', function(event) {
      // Preventing the show details event from firing
      event.stopImmediatePropagation();
      // Grabbing the current list item to animate
      var listItem = $(this).parent().parent();
      // Moving the list item off the page
      listItem.animate({ 'left': listItem.width() }, { 'complete': function() {
          // After the item moves off the page, the list item collapses
          listItem.animate({ 'height': '0' }, { 'complete': function() {
              // Invoking the removeItem function on the current scope to remove the item from the current scope
              scope.$apply(attrs.removeItem);
            }
          });
        }
      });
    });
  }
});

angular.module('oneListApp').directive('showOptions', function() {
  return function(scope, element, attrs) {
    // When options hamburger button is clicked, the options view show
    element.bind('click', function() {
      // Displaying the overlay
      toggleOverlay();
      // Defining the value to set the width of the options to and animate the main and options views to and from
      var width = calculateWidth(0.8);
      // Setting the height of the options window based on the greater of the heights between the main view and the window
      setHeight($('.optionsView'));
      // Animating options view
      $('.optionsView').css('left', -width);
      $('.optionsView').css('width', width);
      $('.mainView').animate({ 'left': width });
      $('.optionsView').animate({ 'left': '0' });
    });
  }
});

angular.module('oneListApp').directive('showDetails', function() {
  return function(scope, element, attrs) {
    // When current list item is clicked, the current item details are displayed
    element.bind('click', function() {
      // Invoking the getItem function to set the current item details
      scope.$apply(attrs.showDetails);
      // Display the overlay
      toggleOverlay();
      // Defining the value to set the width of the options to and animate the main and options views to and from
      var width = calculateWidth(0.95);
      // Setting the height of the options window based on the greater of the heights between the main view and the window
      setHeight($('.detailsView'));
      // console.log(scope)
      // // Setting the date and time input to today
      // var today = new Date();
      // var day = today.getFullYear() + '-' + ("0" + (today.getMonth() + 1)).slice(-2) + '-' + ("0" + today.getDate()).slice(-2);
      // var time = ("0" + today.getHours()).slice(-2) + ':' + ("0" + today.getMinutes()).slice(-2);
      // console.log(scope.item.due_date)
      // if(scope.item.due_date) {
      //   console.log()
        $('.time input').val('');
        $('.date input').val('');
      // } else {
      //   $('.time input').val(time);
      //   $('.date input').val(day);
      // }
      // Animating the details view
      $('.detailsView').css('right', -width);
      $('.detailsView').css('width', width);
      $('.detailsView').animate({ 'right': '0' });
    });
  }
});

angular.module('oneListApp').directive('hide', function() {
  return function(scope, element, attrs) {
    // Hiding the options or details view and displaying the main view when the overlay is clicked
    element.bind('click', function() {
      showMain();
      // Invoking the clear scope function to clear the current item attribute on the current scope
      setTimeout(function() {
        scope.$apply(attrs.hide);
      }, 300);
    });
  }
});

angular.module('oneListApp').directive('editTitle', function() {
  return function(scope, element, attrs) {
    // When the edit title button is clicked, the edit title button is hidden and the change title input is displayed
    element.bind('click', function() {
      $('.changeTitle').css('height', '75px');
      $(this).fadeOut(200);
    });
  }
});

angular.module('oneListApp').directive('doneTitle', function() {
  return function(scope, element, attrs) {
    // Whne the done title button is clicked, the title is updated, the edit title button is displayed, and the change title input is hidden
    element.bind('click', function() {
      // The doneTitle function is invoked to update the title, and update the title on the current scope
      scope.$apply(attrs.doneTitle);

      // Hiding the change title input amd showing the edit title button
      $('.changeTitle').css('height', '0px');
      setTimeout(function() {
        $('.editTitle').fadeIn(200);
      }, 300);
    });
  }
});

angular.module('oneListApp').directive('editNotes', function() {
  return function(scope, element, attrs) {
    var invertBackground = function() {
      element.css('background', '-webkit-radial-gradient(center, cover ellipse, #333333 0%, #333333 60%, #272822 100%)');
      element.css('color', 'white');
    };

    element.bind('click', invertBackground);
    element.bind('focus', invertBackground);
  }
});

angular.module('oneListApp').directive('addKeywords', function() {
  return function(scope, element, attrs) {
    element.bind('click', function() {
      scope.$apply(attrs.addKeywords);
    });
  }
});

angular.module('oneListApp').directive('changePage', function() {
  return function(scope, element, attrs) {
    // When the change button is clicked the page switches to the opposite view
    element.bind('click', function() {
      // The overlay is hidden
      toggleOverlay();
      // When change page is clicked the options view is animated closed and then the new main view page is displayed
      var width = calculateWidth(0.8);
      $('.mainView').animate({ 'left': '0' });
      $('.optionsView').animate({ 'left': -width }, {'complete': function() {
          // The changePage function of the current scope is invoked to change the page
          scope.$apply(attrs.changePage);
        }
      });
    });
  }
});

angular.module('oneListApp').directive('hideKeyword', function ($animate) {
  return function(scope, element, attrs) {
    element.bind('click', function() {
      // When the 'x' button is clicked for a keyword the keyword fades out
      $(this).parent().parent().css('opacity', '0');

      setTimeout(function() {
        // After 4/10 of a second, the delete keyword function is invoked to delete the current keyword
        scope.$apply(attrs.hideKeyword);
      }, 400);
    });
  }
});

angular.module('oneListApp').directive('editDuedate', function() {
  return function(scope, element, attrs) {
    // When the edit due_date button is clicked, the edit due_date button is hidden and the change due_date input is displayed
    element.bind('click', function() {
      $('.changeDueDate').css('height', '90px');
      $(this).fadeOut(200);
    });
  }
});

angular.module('oneListApp').directive('doneDuedate', function() {
  return function(scope, element, attrs) {
    // When the done due_date button is clicked, the due_date is updated, the edit due_date button is displayed, and the change due_date input is hidden
    element.bind('click', function() {
      // The addDueDate function is invoked to update the due_date, and update the due_date on the current scope
      scope.$apply(attrs.doneDuedate);

      // Hiding the change title input amd showing the edit title button
      $('.changeDueDate').css('height', '0px');
      setTimeout(function() {
        $('.editDueDate').fadeIn(200);
      }, 300);
    });
  }
});

angular.module('oneListApp').directive('searchItems', function() {
  return function(scope, element, attrs) {
    // When Search Item button is clicked the search item input is displayed and the add item input is hidden
    element.bind('click', function() {
      // Displaying the search overlay to prevent searchFilter buttons from being clicked
      $('.searchOverlay').css('height', $('.searchFilters').height());
      $('.searchOverlay').css('z-index', '200');
      // Hiding the add item input(if it is showing) and displaying the search item input
      if($('.addItem').css('visibility') === 'visible') {
        $('.addItem').animate({ 'height': '0px' }, { 'complete': function() {
            $('.addItem').css({ 'border-bottom': '0px' });
            $('.searchWindow').css({ 'border-bottom': '1px solid black' });
            $('.searchWindow').animate({ 'height': '78px' });
          }
        });
      } else {
        $('.searchWindow').css({ 'border-bottom': '1px solid black' });
        $('.searchWindow').animate({ 'height': '78px' });
      }
      // Hiding the filter labels title text
      $('.searchLabels p').css('opacity', '0');
    });
  }
});

angular.module('oneListApp').directive('doneSearching', function() {
  return function(scope, element, attrs) {
    // When x button is clicked the add item input is displayed and the search item input is hidden
    element.bind('click', function() {
      $('.searchOverlay').css('z-index', '-100');
      // Hiding the search item input and displaying the add item input
      $('.searchWindow').animate({ 'height': '0px' }, { 'complete': function() {
          $('.searchWindow').css({ 'border-bottom': '0px' });
          $('.addItem').css({ 'border-bottom': '1px solid black' });
          $('.addItem').animate({ 'height': '78px' });
          // Invoking the done searching function on current scope to clear the search filter results
          scope.$apply(attrs.doneSearching);
        }
      });
      // Displaying the filter labels title text
      $('.searchLabels p').css('opacity', '1');
    });
  }
});

angular.module('oneListApp').directive('filterLabels', function() {
  return function(scope, element, attrs) {
    // When filter label button is clicked the filter label input is displayed and the add item input is hidden
    element.bind('click', function() {
      // Invoking the createKeyword List to create a list of searchable keywords for filtering
      scope.$apply(attrs.filterLabels);
      // Displaying the search overlay to prevent searchFilter buttons from being clicked
      $('.searchOverlay').css('height', $('.searchFilters').height());
      $('.searchOverlay').css('z-index', '200');
      // Hiding the add item input(if it is being displayed) and displaying the filter label input
      if($('.addItem').css('visibility') === 'visible') {
        $('.addItem').animate({ 'height': '0px' }, { 'complete': function() {
            $('.addItem').css({ 'border-bottom': '0px' });
            $('.filterWindow').css({ 'border-bottom': '1px solid black' });
            $('.filterWindow').animate({ 'height': '78px' });
          }
        });
      } else {
        $('.filterWindow').css({ 'border-bottom': '1px solid black' });
        $('.filterWindow').animate({ 'height': '78px' });
      }
      // Hiding the search items title text
      $('.searchItems p').css('opacity', '0');
    });
  }
});

angular.module('oneListApp').directive('doneFiltering', function() {
  return function(scope, element, attrs) {
    // When x button is clicked the add item input is displayed and the filter label input is hidden
    element.bind('click', function() {
      $('.searchOverlay').css('z-index', '-100');
      $('.filterTagList').css('opacity', '0');
      $('.filterWindow').css('overflow', 'hidden');
      // Hiding the filter label input and displaying the add item input
      $('.filterWindow').animate({ 'height': '0px' }, { 'complete': function() {
          $('.filterWindow').css({ 'border-bottom': '0px' });
          $('.addItem').css({ 'border-bottom': '1px solid black' });
          $('.addItem').animate({ 'height': '78px' });
          // Invoking the done searching function on current scope to clear the filter label results
          scope.$apply(attrs.doneFiltering);
        }
      });
      // Displaying the search items title text
      $('.searchItems p').css('opacity', '1');
    });
  }
});

angular.module('oneListApp').directive('searchFilter', function() {
  return function(scope, element, attrs) {
    element.bind('keyup', function() {
      // If their is an input value then the filtered keyword list display is shown
      if(element.val() !== '') {
        $('.filterWindow').css('overflow', 'visible');
        $('.filterTagList').css('opacity', '1');
        // Removing the text shadow if there is nothing in the filtered keyword list
        if($('.filterTagList').children().length === 0) {
          $('.filterTagList').css('box-shadow', 'none');
        } else {
          $('.filterTagList').css('box-shadow', '0.5px 1px 1px #878787');
        }
      // If there is no input value then the filtered keyword list display is hidden
      } else {
        $('.filterTagList').css('opacity', '0');
        $('.filterWindow').css('overflow', 'hidden');
      }
    });
  }
});

angular.module('oneListApp').directive('setFilter', function() {
  return function(scope, element, attrs) {
    element.bind('click', function() {
      // If a keyword is selected the search field input is set to it
      $('.searchField').val(scope.this.keyword);
      // Invoking the set filter function to filter the list by the selected keyword
      scope.$apply(attrs.setFilter);
      // Hiding the filtered keyword list display
      $('.filterTagList').css('opacity', '0');
      $('.filterWindow').css('overflow', 'hidden');
    });
  }
});

angular.module('oneListApp').directive('changeView', function() {
  return function(scope, element, attrs) {
    element.bind('click', function() {
      // Showing the main view
      showMain();
      // Setting the new current view element
      var elem = element.hasClass('labels') ? $('.labelView') : $('.accountView');
      // Fading out list view and displaying new current view
      $('.listView').fadeOut(200, function() {
        // Invoking changeView function on current scope to display new current view
        scope.$apply(attrs.changeView);
        elem.fadeIn(200);
      });
    });
  }
});

angular.module('oneListApp').directive('backtoList', function() {
  return function(scope, element, attrs) {
    element.bind('click', function() {
      // Setting the current view element
      var elem = element.hasClass('labels') ? $('.labelView') : $('.accountView');
      // Fading out current view and displaying list view
      elem.fadeOut(200, function() {
        // Invoking changeView function on current scope to display current view
        scope.$apply(attrs.backtoList);
        $('.listView').fadeIn(200);
      });
    });
  }
});

angular.module('oneListApp').directive('checkInput', function() {
  return function(scope, element, attrs) {
    element.bind('keyup', function() {
      scope.$apply(attrs.checkInput);
    });
  }
});

angular.module('oneListApp').directive('showConfirmation', function() {
  return function(scope, element, attrs) {
    element.bind('click', function() {
      // Hiding the trash icon button and showing the confirmation window
      $(this).animate({ 'opacity': '0' }, {'complete': function() {
          $(this).css('display', 'none');
          $(this).prev().css('display', 'block');
          $(this).prev().animate({ 'opacity': '1' });
        }
      });
    });
  }
});

angular.module('oneListApp').directive('hideConfirmation', function() {
  return function(scope, element, attrs) {
    element.bind('click', function() {
      // Hiding the confirmation window and showing the trash icon button
      $(this).parent().animate({ 'opacity': '0' }, {'complete': function() {
          $(this).css('display', 'none');
          $(this).next().css('display', 'block');
          $(this).next().animate({ 'opacity': '1' });
        }
      });
    });
  }
});

angular.module('oneListApp').directive('showInput', function() {
  return function(scope, element, attrs) {
    element.bind('click', function() {
      // Hiding the magnifying glass search button and displaying the search input field
      $(this).fadeOut(300, function() {
        $('.searchLabelInput').animate({ 'height': '57' });
      });
    });
  }
});

angular.module('oneListApp').directive('hideInput', function() {
  return function(scope, element, attrs) {
    element.bind('click', function() {
      // Hiding the search input field and showing the search magnifying glass button
      $('.searchLabelInput').animate({ 'height': '0' }, { 'complete': function() {
          $('.searchGlass').fadeIn();
          // Invoking the deleteLabel function on the current scope
          scope.$apply(attrs.hideInput);
        }
      });
    });
  }
});


/***************************/
/*** Directive Functions ***/
/***************************/

var showMain = function() {
  // Hiding the overlay
  toggleOverlay();
  // If main view isnt currently displayed, then the main view is displayed and the options view is hidden
  if($('.optionsView').css('left') === '0px') {
    var width = calculateWidth(0.8);
    $('.mainView').animate({ 'left': '0' });
    $('.optionsView').animate({ 'left': -width });
  }
  // If details view is currently displayed, then the details view is hidden
  if($('.detailsView').css('right') === '0px') {
    var width = calculateWidth(0.95);
    $('.detailsView').animate({ 'right': -(width + 5) }, {'complete': function() {
        $('.changeTitle').css('height', '0px');
        $('.editTitle').fadeIn(200);
        $('.changeDueDate').css('height', '0px');
        $('.editDueDate').fadeIn(200);
        revertBackground();
      }
    });
  }
};

var toggleOverlay = function() {
  $('.overlay').toggleClass('invisible');
};

var revertBackground = function() {
  $('.notes').css('background', '-webkit-radial-gradient(center, cover ellipse, #ffffff 0%, #ffffff 60%, #dedede 100%)');
  $('.notes').css('color', '#878787');
};

