$(function() {
})
$(".menu__hassub").click(function(event) {
  event.preventDefault();
  $(".menu__hassub").not($(this)).removeClass("menu__show");
  $(this).toggleClass("menu__show");
});
$(".sidebar__toggle").click(function(event) {
  $(this).parent().toggleClass("closed").toggleClass("opened");
});
$(".sidebar__toggle.opened").click(function(event) {
  $(this).parent().toggleClass("opened").toggleClass("closed");
})
