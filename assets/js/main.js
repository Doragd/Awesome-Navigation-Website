$(document).ready(function() {
  initHeaderSize();
  $(window).on("resize", function() {
    scaleHeaderContainer();
  });
});

function scaleHeaderContainer() {
  var height = $(window).height() + 5;
  var unitHeight = parseInt(height) + "px";
  $("header").css("height", unitHeight);
}

function initHeaderSize() {
  scaleHeaderContainer();
}
