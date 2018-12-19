$(document).ready(function () {
  include("side");
  include("header");
  include("footer");
});

function include(template_name) {
  var template_dir = "../template/" + template_name + ".tpl";
  var selector = "#" + template_name;
  var get_template = $.get(template_dir, function (result) {
    $(selector).html(result);
  });
  $.when(get_template).done(function () {
    get_data();
  });
}

function get_data() {
  var items = [{
      item_name: "猜你喜欢",
      item_icon: "fa-thumbs-o-up",
      item_class: "item-like",
      url: "/home/"
    },
    {
      item_name: "排行榜",
      item_icon: "fa-list",
      item_class: "item-rank",
      url: "/rank/"
    },
    {
      item_name: "我的收藏",
      item_icon: "fa-shopping-bag",
      item_class: "item-collect",
      url: "/collect/"
    },
    {
      item_name: "提交作品",
      item_icon: "fa-paint-brush",
      item_class: "item-submit",
      url: "/submit/"
    }
  ];
  for (var i = 0, len = items.length; i < len; i++) {
    if (items[i]["url"] == location.pathname) {
      var selectors = [
        "." + items[i]["item_class"],
        ".header-title-icon>i",
        ".header-title-text"
      ];
      $(selectors[0]).addClass("active");
      $(selectors[1]).addClass(items[i]["item_icon"]);
      $(selectors[2]).html(items[i]["item_name"]);
    }
  }
}