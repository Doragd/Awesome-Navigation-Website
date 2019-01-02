$(document).ready(function () {
  include("side");
  include("header");
  include("footer");

  var get_data = fetch_data();
  $.when(get_data).done(function () {
    render_home();
    render_page();
    render_rank();
  });
});



function include(template_name) {
  var template_dir = "../template/" + template_name + ".tpl";
  var selector = "#" + template_name;
  var get_template = $.get(template_dir, function (result) {
    $(selector).html(result);
  });
  $.when(get_template).done(function () {
    render_data();
    $(".fa-share-alt").on("mouseover mouseout", function (event) {
      if (event.type == "mouseover") {
        $(".pop-wechat-code").removeAttr("style");
      } else if (event.type == "mouseout") {
        $(".pop-wechat-code").attr("style", "display:none");
      }
    })
    $(".card-add").on("click", function () {
      $(".card-input").removeAttr("style");
      $(".card-add").attr("style", "display:none");
    });
    $(".fa-close, .fa-check").on("click", function () {
      $(".card-add").removeAttr("style");
      $(".card-input").attr("style", "display:none");
    });
  });
}

function render_data() {
  var items = [{
      item_name: "猜你喜欢",
      item_icon: "fa-thumbs-o-up",
      item_class: "item-like",
      url: "home"
    },
    {
      item_name: "排行榜",
      item_icon: "fa-list",
      item_class: "item-rank",
      url: "rank"
    },
    {
      item_name: "我的收藏",
      item_icon: "fa-shopping-bag",
      item_class: "item-collect",
      url: "collect"
    },
    {
      item_name: "提交作品",
      item_icon: "fa-paint-brush",
      item_class: "item-submit",
      url: "submit"
    }
  ];
  var pathname = location.pathname.split('/');
  for (var i = 0, len = items.length; i < len; i++) {
    if (items[i]["url"] == pathname[pathname.length - 2]) {
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


function fetch_data() {
  var get_data = $.ajax({
    url: "http://blog.doragd.cn/create/submit/getdata.php",
    async: false,
    success: function (result) {
      var github_info = JSON.parse(result);
      if (Object.keys(github_info).length != sessionStorage.length) {
        for (i in github_info) {
          var site_url = "https://raw.githubusercontent.com/" + github_info[i]["user_name"] + '/' + github_info[i]["git_name"] + '/master/site.json';
          var git_url = "https://api.github.com/repos/" + github_info[i]["user_name"] + '/' + github_info[i]["git_name"];
          $.ajax({
            url: site_url,
            async: false,
            success: function (info) {
              var flag = true;
              try {
                var arr_info = JSON.parse(info);
              } catch (e) {
                flag = false;
                console.log('json format error:' + site_url);
              }
              if (flag) {
                $.ajax({
                  url: git_url,
                  async: false,
                  success: function (info_add) {
                    arr_info["avatar"] = info_add["owner"]["avatar_url"];
                    arr_info["star"] = info_add["stargazers_count"];
                    arr_info["full_name"] = info_add["full_name"];
                    sessionStorage.setItem(i, JSON.stringify(arr_info));
                  },
                  error: function () {
                    console.log(git_url + ' 404');
                  }
                });
              }
            },
            error: function () {
              console.log(site_url + ' 404');
            }
          });
        }
      }
    }
  });
}


function compare(property) {
  return function (a, b) {
    var value1 = a[property];
    var value2 = b[property];
    return value2 - value1;
  }
}

function render_rank() {
  if (location.pathname != "/create/rank/") {
    return;
  }
  var template_dir = "../template/rank-item.tpl";
  var rank_res;
  var get_rank_tpl = $.get(template_dir, function (result) {
    rank_res = result.split('$');
  });
  $.when(get_rank_tpl).done(function () {
    var res_arr = [];
    for (i = 0; i < sessionStorage.length; i++) {

    }
    for (i in sessionStorage) {
      if (sessionStorage.getItem(i) === null) {
        continue;
      }
      var res = get_rank(rank_res, i);
      res_arr.push(res);
    }
    res_arr.sort(compare("star"));
    for (i in res_arr) {
      $(".rank-list").append(res_arr[i]["tpl"]);
      $(".data-v" + res_arr[i]["sid"] + " .rank-value").html(i);
    }
  });
}

function get_rank(rank_res, i) {
  var rank_res = JSON.parse(JSON.stringify(rank_res));
  var data = JSON.parse(sessionStorage.getItem(i));
  var sid = data["sid"];
  var name = data["name"];
  var title = data["title"];
  var star = data["star"];
  var thumbnail = data["thumbnail"];
  var url = "https://github.com/" + data["full_name"];
  var arr_rank = [sid, thumbnail, title, name, url, star, sid]; /*需要填充的参数*/
  var ix = 0;
  var rank_tpl = "";
  for (i in rank_res) {
    if (rank_res[i] == "") { /*空串表示该位置是填充位置*/
      rank_res[i] = arr_rank[ix];
      ix += 1;
    }
    rank_tpl += rank_res[i];
  }
  var res = {
    tpl: rank_tpl,
    /* 已填充好数据的模板*/
    star: star,
    /*单独返回star方便排序 */
    sid: sid
  };
  return res;
}

function getQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]);
  return null;
}

function get_page(page_res, info) {
  var page_res = JSON.parse(JSON.stringify(page_res));
  var image = info["image"];
  var sid = info["sid"];
  var title = info["title"];
  var introduction = info["introduction"];
  var star = info["star"];
  var summary = info["summary"];
  var avatar = info["avatar"];
  var demo = info["demo"];
  var full_name = info["full_name"];
  var name = info["name"];
  var arr_page = [image, sid, title, introduction, avatar, name, summary, full_name, star, demo];
  var ix = 0;
  var page_tpl = "";
  for (i in page_res) {
    if (page_res[i] == "") { /*空串表示该位置是填充位置*/
      page_res[i] = arr_page[ix];
      ix += 1;
    }
    page_tpl += page_res[i];
  }
  return page_tpl;
}

function render_page() {
  var sid = getQueryString('id');
  if (sid == null) {
    return;
  }
  var template_dir = "../template/page.tpl";
  var page_res;
  var get_page_tpl = $.get(template_dir, function (result) {
    page_res = result.split('$');
  });
  $.when(get_page_tpl).done(function () {
    for (i in sessionStorage) {
      if (sessionStorage.getItem(i) === null) {
        continue;
      }
      var info = JSON.parse(sessionStorage.getItem(i));
      if (info["sid"] == sid) {
        var page_tpl = get_page(page_res, info);
        $(".content").html(page_tpl);
      }
    }
  });
}

function get_home(home_res, i) {
  var home_res = JSON.parse(JSON.stringify(home_res));
  var data = JSON.parse(sessionStorage.getItem(i));
  var sid = data["sid"];
  var thumbnail = data["thumbnail"];
  var summary = data["summary"];
  var avatar = data["avatar"];
  var title = data["title"];
  var arr_home = [sid, thumbnail, avatar, sid, title, summary];
  var ix = 0;
  var home_tpl = "";
  for (i in home_res) {
    if (home_res[i] == "") { /*空串表示该位置是填充位置*/
      home_res[i] = arr_home[ix];
      ix += 1;
    }
    home_tpl += home_res[i];
  }
  return home_tpl;
}

function render_home() {
  if (location.pathname != "/create/home/" && location.pathname != '/home/index.html') {
    return;
  }
  var template_dir = "../template/home.tpl";
  var home_res;
  var get_home_tpl = $.get(template_dir, function (result) {
    home_res = result.split('$');
  });
  $.when(get_home_tpl).done(function () {
    for (i in sessionStorage) {
      if (sessionStorage.getItem(i) === null) {
        continue;
      }
      var res = get_home(home_res, i);
      $(".carousel-content").append(res);
    }
  });
}