angular.module('oneListApp').directive('removeItem', function() {
  return function(scope, element, attrs) {
    // When remove item is clicked the list item animates off the page, collapses then is removed from the scope
    element.bind('click', function(event) {
      event.stopImmediatePropagation();
      var listItem = $(this).parent().parent();
      listItem.animate({ 'left': listItem.width() }, { 'complete': function() {
          listItem.animate({ 'height': '0' }, { 'complete': function() {
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
    element.bind('click', function() {
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
    element.bind('click', function() {
      scope.$apply(attrs.showDetails);
      toggleOverlay();
      var width = calculateWidth(0.95);
      setHeight($('.detailsView'));
      $('.detailsView').css('right', -width);
      $('.detailsView').css('width', width);
      $('.detailsView').animate({ 'right': '0' });
    });
  }
});

angular.module('oneListApp').directive('back', function() {
  return function(scope, element, attrs) {
    element.bind('click', function() {
      toggleOverlay();
      hideDetails();
    });
  }
});

angular.module('oneListApp').directive('hide', function() {
  return function(scope, element, attrs) {
    element.bind('click', function() {
      toggleOverlay();
      if($('mainView').css('left') != '0px') {
        var width = calculateWidth(0.8);
        $('.mainView').animate({ 'left': '0' });
        $('.optionsView').animate({ 'left': -width });
      }
      if($('.detailsView').css('right') === '0px') {
        hideDetails();
      }
    });
  }
});

angular.module('oneListApp').directive('title', function() {
  return function(scope,element, attrs) {
    var populateField = function() {
      var val = attrs.placeholder;
      element.val(val);
    };

    element.bind('focus', populateField);
    element.bind('click', populateField);
  }
});

angular.module('oneListApp').directive('editTitle', function() {
  return function(scope, element, attrs) {
    element.bind('click', function() {
      $('.changeTitle').css('height', '75px');
      $(this).fadeOut(200);
    });
  }
});

angular.module('oneListApp').directive('doneTitle', function() {
  return function(scope, element, attrs) {
    element.bind('click', function() {
      scope.$apply(attrs.doneTitle);

      $('.changeTitle').css('height', '0px');
      setTimeout(function() {
        $('.editTitle').fadeIn(200);
      }, 300);
    });
  }
});

angular.module('oneListApp').directive('changePage', function() {
  return function(scope, element, attrs) {
    element.bind('click', function() {
      toggleOverlay();
      // When change page is clicked the options view is animated closed and then the new main view page is displayed
      var width = calculateWidth(0.8);
      $('.mainView').animate({ 'left': '0' });
      $('.optionsView').animate({ 'left': -width }, {'complete': function() {
          console.log(attrs.changePage)
          scope.$apply(attrs.changePage);
        }
      });
    });
  }
});