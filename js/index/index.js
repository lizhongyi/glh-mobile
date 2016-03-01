/**首页逻辑***/
$(document).ready(function() {

     homePage.homeStart();
      $(".column .menu .item").tab();
      $('.ui.menu .ui.dropdown').dropdown({
        on: 'click'
      });

      $('.ui.menu a.item')
        .on('click', function() {
          $(this)
            .addClass('active')
            .siblings()
            .removeClass('active')
          ;
        })
      ;
});

//点击分页
$("#index-page-bar>.p-bar").click(function(event)
 {
  getList(10,parseInt($(this).text()),'GLH');
});


//选择栏目

$(".home.menu>a.item").click(function(event) {
  /* Act on the event */
    $("#home-selecet-text").text($(this).text());
    homePage.getList(10,1,$(this).attr('href').substr(1));
    homePage.hash = $(this).attr('href').substr(1);
    $(window).scrollTop(0);

});

//检测滚动条翻页
setTimeout(function(){

  $(window).scroll(function() {

      var wh =  $(window).height();
      var dh =  $(document).height();
      //当内容滚动到底部时加载新的内容
      if ($(this).scrollTop() + wh + 2 >= dh && wh > 500) {
         console.log("加载分页");
         homePage.LoadPage();
      }
      console.log($(this).scrollTop()+"xxx"+wh+"asda"+dh);
  });

},1000);



var homePage={};

    homePage.hash = window.location.hash.substr(1);
    homePage.setPageTotal = 10;
    homePage.nowPage = 1;
    homePage.homeStart = function (columnCode) {
      if(columnCode)
      {
        this.getList(22,1,columnCode);
        return;
      }
      var hash =    this.hash;
      if(hash == ""){
          this.getList(22,1,'GLH');
      }else{
          //设置默认选项
          var hashArr = new Array();
              hashArr['GLH'] = "格隆汇";
              hashArr['RD'] = "热点";
              hashArr['GG'] = "港股";
              hashArr['MG'] = "美股";
              hashArr['IPO'] = "IPO";
              console.log(hashArr)
          $("#home-selecet-text").text(hashArr[hash]);
           this.getList(22,1,hash);
          }

    };
    homePage.getList = function (count,page,columnCode)
    {

         //请求列表数据
         glhAjax.get({
            url : makeApiUrl(service.getApiUrl().getArticleList.url,{columnCode:columnCode,limit:count,page:page}),
            beforeSend : function () {
                $("#list-loader").addClass('active');
                return {};
           },
          evt:'now',
           success : function (response)
           {
              var li =  "";
              var list = response.result.articleList;
              if($.isArray(list))
              {
                  $("#list-loader").removeClass('active');
                  console.log(list);
                  list.map(function(list)
                  {
                       li +='<div class="item event ">';
                       li +='<div style="float:left;width:14%;  margin-left:1%;"><img class="image avatar" style="width:100%;border-radius:50%;" src="'+list.authorAvatar+'"></div>';
                       li +='<div class="content" style="float:right;width:80%">';
                       li += '<a href="article.html#'+list.postId+'" class="header ">' +list.articleTitle +'</a>';
                      // li += '<div class="extra"><div class="ui  label"><i class="tag icon"></i>'+list.columnCode+'</div><div class="ui label">'+list.columnCode+'</div><div class="ui label">其他市场</div></div> ';
                      // li += '<div class="summary">'+list.articleSummary+'</div>';

                       li += '<div class="description"> '+list.author+' · <span class="date">' +getTime(list.publishTime)+'　评论： '+list.commentCount+'</span></div>';
                       li += '</div>';
                       li += '</div>';
                  });
              //判断重载何追加
                  if(page > 1)
                  {
                      $(li).appendTo($("#a-list"));
                      homePage.nowPage += 1;
                  }else{
                      $(window).scrollTop(0);
                      homePage.nowPage = 1;
                      $("#a-list").html(li);
                  }
           }
           },
           targets:$("#a-list")
         });

    };
    //加载分页
    homePage.LoadPage = function () {
             if(this.nowPage>20){
                  console.log("已经超过20页游点卡了就不加载了吧");
                  return;
             }
             homePage.getList(this.setPageTotal,this.nowPage+1,this.hash);
    };
