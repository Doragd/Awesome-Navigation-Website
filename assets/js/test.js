  $(document).ready(function () {
      $.ajax({
          url: "http://blog.doragd.cn/create/data.txt",
          success: function (data) {
              console.log(data.split("\n"));
          }
      });
  });