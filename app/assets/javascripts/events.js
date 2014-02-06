var setEvents = function() {
  /*********************/
  /*** Options Event ***/
  /*********************/

  $('.container').on('click', '.fa-bars', function() {
    // Defining the value to set the width of the options to and animate the main and options views to and from
    var left = calculateOptionsWidth();
    // Setting the height of the options window based on the greater of the heights between the main view and the window
    setOptionsHeight();
    // Animating main and options view depending on which one is being displayed
    if($('.mainView').css('left') === '0px') {
      $('.optionsView').css('left', -left);
      $('.optionsView').css('width', left);
      $('.mainView').animate({ 'left': left });
      $('.optionsView').animate({ 'left': '0' });
    } else {
      $('.mainView').animate({ 'left': '0' });
      $('.optionsView').animate({ 'left': -left });
    }
  });

  $('.container').on('click', '.goToComplete', function(e) {
    e.preventDefault();
    changeLoc('#/complete');
  });

  $('.container').on('click', '.goToIncomplete', function(e) {
    e.preventDefault();
    changeLoc('#/incomplete');
  });

  /*******************/
  /*** Items Event ***/
  /*******************/

  $('.container').on('click', '.changeStatus', function() {
    var that = $(this);
    var id = that.parent().data('id');
    var listItem = that.parent().parent();

    if($(this).hasClass('complete')) {
      var status = true;
    } else {
      var status = false;
    }

    // $.ajax('/changeStatus', {
    //   method: 'PUT',
    //   data: {
    //     heading: 'ajax request',
    //     complete: status,
    //     item_id: id
    //   }
    // }).success(function(data) {
    //   that.next().toggleClass('crossedOut');
    //   listItem.animate({ 'left': listItem.width() }, { 'complete': function() {
    //       listItem.animate({ 'height': '0' }, { 'complete': function() {
    //           listItem.remove();
    //         }
    //       });
    //     }
    //   });
    // });
  });
};
