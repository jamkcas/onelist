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
};
