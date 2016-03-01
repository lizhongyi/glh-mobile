//文章详细页面
$(document).ready(function() {
    article.start();
    console.log($(".main-content").html());
    //分享操作
    $("#share-btn").click(function(){
      $("#share-bar").slideToggle(100);
    })

    //滚动条显示分享菜单
    scroll(function(direction) {
        if(direction == 'down'){

            $("#share-bar").slideUp(0);
        }else{

            $("#share-bar").slideDown(0);
          }
     });

});
var article = {};

    article.postId = parseInt(window.location.hash.substr(1));
    //初始化
    article.start = function()
    {

        if( !this.postId )
        {

          console.log("缺少必要字段");
          //跳到错误提示
        }
        //初始化内容
        article.get_contents();
        //初始推荐阅读 滚动和到底部加载
        setTimeout(function(){

              article.get_recommend();
              article.get_comment();

        },1000);


        $("#load-comment-btn").click(function(){
            article.get_comment();
        })

    }

    //获得详细信息
    article.get_contents = function ()
    {
        var url = makeApiUrl(service.getApiUrl().getPost.url,{postId:article.postId});
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
                {   var detail =  response.result;
                    //作者信息
                    $("#author .avatar").attr('src',detail.avatar);
                    $("#nick-name").text(detail.nickname);

                    //文章内容
                     $(".content-title").html(detail.title+"-格隆汇");
                     $("title").html(detail.title+"-格隆汇");
                    document.title = detail.title+"-格隆汇";
                    document.getElementById('content-box').innerHTML=addLink(detail.content);
                    $(".create-date").text("发布于：" +getTime(detail.publishTime)+ "　阅读："+detail.postCount.read);

                    //显示文档
                    $("body").show();
                    //评论数量
                    $("#comment-count").text(detail.postCount.comment);

                }
            }
        });
    };

    //获得延伸阅读
    article.get_recommend = function()
    {
        var url = makeApiUrl(service.getApiUrl().recommendRead.url,{postId:article.postId,count:3});
        glhAjax.get
        ({
            url:url,
            success:function(response)
            {
                if(response.statusCode == 200)
                {
                    recommendList = response.result;
                    console.log(recommendList);
                    var li = "";
                    recommendList.map(function(list){
                        li += ' <div class="item">';
                        li += '<div class="content"><a onclick="setTimeout(function(){window.location.reload()},200)" href="#'+list.postId+'" class="description">'+list.title+'</a> <div class="date"><i class="user icon"></i>'+list.author+'　'+getTime(list.createTime)+'</div></div>';
                        li += '</div>';
                      });


                    $(".more-read .recommend").html(li);


                }
            },
            targets:$(".more-read")
        });
    };

    //获取文章评论
    article.get_comment = function ()
    {
          var url = makeApiUrl(service.getApiUrl().getPostComment.url,{postId:this.postId,page:1,count:10});
          glhAjax.get
          ({
              url:url,
              success:function(response)
              {
                  if(response.statusCode == 200)
                  {
                      commentList = response.result;
                      console.log(recommendList);
                      var li = "";
                      commentList.map(function(list){

                          li +=  '<div class="comment">';
                          li +=  '<a class="avatar"><img src="'+list.avatar+'"></a>';
                          li +=  '<div class="content">';
                          li +=  '<span class="author"> '+list.nickname+' </span><div class="metadata"> '+formatTime(list.createDate)+'</div>';
                          li +=  '<div class="text">'+list.content+'</div>';
                          li +=  '<div class="actions"><a href="javascript:goDownApp()">回复</a></div>'
                          li +=  '</div>';
                          li +=  '</div>';
                        });

                      $("#comment-list").html(li);
                  }
              },
              targets:$("#load-comment-btn")
          });
    };



  function scroll( fn ) {
    var beforeScrollTop = document.body.scrollTop,
        fn = fn || function() {};
    window.addEventListener("scroll", function() {
        var afterScrollTop = document.body.scrollTop,
            delta = afterScrollTop - beforeScrollTop;
        if( delta === 0 ) return false;
        fn( delta > 0 ? "down" : "up" );
        beforeScrollTop = afterScrollTop;
    }, false);
}
