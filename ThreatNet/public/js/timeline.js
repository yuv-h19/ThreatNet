$(document).ready(function(){

  // Iterate over each timeline step
  $(".timeline-step").each(function(index){
    // Apply staggered delay and fade-in animation
    $(this).delay(600 * index).fadeIn(500);
  });

});