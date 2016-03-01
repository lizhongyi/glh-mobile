!function(){
    "use strict";
     var stock = {};
        //股票代码
        stock.stockCode = window.location.hash.substr(1) || "hk00700";
        stock.setPageTotal = 10;
        stock.nowPage = 1;
        stock.listModule = 'article';

        stock.init = function ()
        {

        }

        //获取股票信息
        stock.get_stock_content = function ()
        {
            var url = makeApiUrl(service.getApiUrl().stockDetail.url,{stocks:stock.stockCode,detail:true});


            glhAjax.get
            ({
                url:url,
                beforeSend:function()
                {
                  $("body").hide();
                  return {};
                },
                success:function(response)
                {
                    if(response.statusCode == 200)
                    {
                      //渲染页面基本信息
                      var result =response.result[0];
                      $(".stock-content .stock-name").text(result.name+'（'+result.type+result.code+'）');
                      $(".stock-content .stock-price").text("HK$"+result.price);
                      $(".stock-content .stock-change").text(result.change);
                      $(".stock-content .stock-netchange").text(result.netChange+"%");

                      //扩展信息
                      var extInfo = result.extInfo;
                      var li = "";
                      var j=0;
                      for(var i in extInfo){
                          j++;
                          if(i % 2 == 0){
                          li +="<div class='column'>"+extInfo[i]+"<br />"+extInfo[j]+"</div>";
                          }
                      }
                          li +="<div class='column' style='width:40%'>市值<br />"+result.mkValue+"</div>";
                      $(".ext-info").html(li);
                      if(parseInt(result.change) > 0){
                            $(".stock-content .price-box").addClass("reds");
                      }else{
                            $(".stock-content .price-box").addClass("greens");
                      }
                      //console.log(result[0].type);
                        $("body").show();
                    }
                }
            });
        }

        //获取股票精华的帖子
        stock.get_stock_article = function (page,count)
        {
            var page = page || 1;
            var count = count || 10;
            var url = makeApiUrl(service.getApiUrl().getStockPost.url,{page:page,stockCode:stock.stockCode,count:count,cream:true});
            stock.listModule = 'article';


            glhAjax.get
            ({
                url:url,
                beforeSend:function()
                {
                  return {};
                },
                evt:'now',
                success:function(response)
                {
                    if(response.statusCode == 200)
                    {

                      var li =  "";
                      var list = response.result;
                      if($.isArray(list))
                      {
                          //$("#list-loader").removeClass('active');
                          console.log(list);
                          list.map(function(list)
                          {
                               li +='<div class="item event ">';
                               li +='<div style="float:left;width:14%;  margin-left:1%;"><img class="image avatar" style="width:100%;border-radius:50%;border:1px solid #ddd" src="'+list.avatar+'"></div>';
                               li +='<div class="content" style="float:right;width:80%">';
                               li += '<a href="article.html#'+list.postId+'" class="header ">' +list.title +'</a>';
                              //li += '<div class="extra"><div class="ui  label"><i class="tag icon"></i>'+list.columnCode+'</div><div class="ui label">'+list.columnCode+'</div><div class="ui label">其他市场</div></div> ';
                              // li += '<div class="summary">'+list.articleSummary+'</div>';

                               li += '<div class="description"> '+list.nickname+' · <span class="date">' +getTime(list.publishTime)+'　评论： '+list.postCount.comment+'</span></div>';
                               li += '</div>';
                               li += '</div>';
                          });



                          //判断重载何追加
                           if(page > 1)
                           {
                              $(li).appendTo($(".tab.article .a-list"));
                               stock.nowPage += 1;
                           }else{
                               $(window).scrollTop(0);
                               stock.nowPage = 1;
                               $(".tab.article .a-list").html(li);
                           }

                    }


                }

              }
              ,targets:$(".article-tab-btn"),

            });
        }
        //获取讨论
        //获取股票精华的帖子
        stock.get_stock_talk = function (page,count)
        {
            var page = page || 1;
            var count = count || 10;
            var url = makeApiUrl(service.getApiUrl().getStockPost.url,{page:page,stockCode:stock.stockCode,count:count,cream:false});
            stock.listModule = 'talk';
            console.log(url);

            glhAjax.get
            ({
                url:url,
                beforeSend:function()
                {
                  return {};
                },
                evt:'now',
                success:function(response)
                {
                    if(response.statusCode == 200)
                    {

                      var li =  "";
                      var list = response.result;
                      if($.isArray(list))
                      {
                          //$("#list-loader").removeClass('active');
                          console.log(list);
                          list.map(function(list)
                          {
                               li +='<div class="item event ">';
                               li +='<div style="float:left;width:14%;  margin-left:1%;"><img class="image avatar" style="width:100%;border-radius:50%;border:1px solid #ddd" src="'+list.avatar+'"></div>';
                               li +='<div class="content" style="float:right;width:80%">';
                               li += '<a href="article.html#'+list.postId+'" class="header ">' +list.title +'</a>';
                              //li += '<div class="extra"><div class="ui  label"><i class="tag icon"></i>'+list.columnCode+'</div><div class="ui label">'+list.columnCode+'</div><div class="ui label">其他市场</div></div> ';
                              // li += '<div class="summary">'+list.articleSummary+'</div>';

                               li += '<div class="description"> '+list.nickname+' · <span class="date">' +getTime(list.publishTime)+'　评论： '+list.postCount.comment+'</span></div>';
                               li += '</div>';
                               li += '</div>';
                          });



                          //判断重载何追加
                           if(page > 1)
                           {

                               $(li).appendTo($(".tab.talk .a-list"));
                               stock.nowPage += 1;
                           }else{

                               $(window).scrollTop(0);
                               stock.nowPage = 1;
                               $(".tab.talk .a-list").html(li);
                           }

                    }


                }

              }
              ,targets:$(".talk-tab-btn")

            });
        }


        //获取公告
        stock.get_notice = function(page,count)
        {

              var page = page || 1;
              var count = count || 10;
              var url = makeApiUrl(service.getApiUrl().stockNotice.url,{page:page,stockCode:stock.stockCode,count:count,cream:true});

              stock.listModule = 'notice';
              glhAjax.get
              ({
                  url:url,
                  beforeSend:function()
                  {
                    return {};
                  },
                  evt:"now",
                  success:function(response)
                  {
                      if(response.statusCode == 200)
                      {

                        var li =  "";
                        var list = response.result;
                        if($.isArray(list))
                        {
                            //$("#list-loader").removeClass('active');
                            console.log(list);
                            list.map(function(list)
                            {
                                 li +='<div class="item event ">';

                                 li += '<a href="'+list.fileUrl+'" class="header" style="line-height:1.5em;margin-bottom:10px"><i class="file pdf outline icon"></i>' +list.title +'</a>';
                                //li += '<div class="extra"><div class="ui  label"><i class="tag icon"></i>'+list.columnCode+'</div><div class="ui label">'+list.columnCode+'</div><div class="ui label">其他市场</div></div> ';
                                //li += '<div class="summary">'+list.articleSummary+'</div>';

                                 li += '<div class="description"> '+list.stockName+' · <span class="date">' +getTime(list.publishTime)+'</span></div>';
                                 li += '</div>';
                                 li += '</div>';
                            });



                            //判断重载何追加
                             if(page > 1)
                             {

                                 $(li).appendTo($(".tab.notice .a-list"));
                                 stock.nowPage += 1;
                             }else{

                                 $(window).scrollTop(0);
                                 stock.nowPage = 1;
                                 $(".tab.notice .a-list").html(li);
                             }

                      }


                  }

                }
                ,targets:$(".notice-tab-btn"),

              });
        }



        //列表分页
        stock.loadPage = function () {

            if(this.listModule == 'article')
            {

              this.get_stock_article(this.nowPage+1,stock.setPageTotal);

            }

            if(this.listModule == 'talk')
            {

              this.get_stock_talk(this.nowPage+1,stock.setPageTotal);

            }

            if(this.listModule == 'notice')
            {
              console.log("fenye");
              this.get_notice(this.nowPage+1,stock.setPageTotal);

            }
        }

        stock.get_stock_content();
        stock.get_stock_article();




        //检测滚动条翻页
        setTimeout(function(){

          $(window).scroll(function() {

              var wh =  $(window).height();
              var dh =  $(document).height();
              //当内容滚动到底部时加载新的内容
              if ($(this).scrollTop() + wh + 2 >= dh && wh > 500) {
                 //值加载精华和讨论还有公告
                 console.log(stock.listModule);
                 stock.loadPage();
              }
              if($(this).scrollTop()>200){
                  $("#list-tab").addClass('fixed');
              }else{
                  $("#list-tab").removeClass('fixed');
              }

              console.log($(this).scrollTop()+"xxx"+wh+"asda"+dh);
          });

        },1000);

        //控制tab导航的显示位置
        $("#list-tab a.item").click(function(){
            $("#list-tab").removeClass('fixed');
        })

        //点击几个tab执行加载
        $(".article-tab-btn").click(function(event) {
          /* Act on the event */
          stock.get_stock_article();
        });

        $(".talk-tab-btn").click(function(event) {
          /* Act on the event */
          stock.get_stock_talk();
        });

        $(".notice-tab-btn").click(function(event) {
          /* Act on the event */
          stock.get_notice();
        });


        $(".f10-tab-btn").click(function(event) {
          /* Act on the event */
            $("#f10iframe").attr('src','/f10webview/#/'+stock.stockCode);
        });

}();
$(".menu .item").tab();
