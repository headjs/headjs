---
layout: main
scripts: ["/site/assets/libs/jquery/jquery-1.10.0-beta1.min.js", "https://cdn.moot.it/latest/moot.min.js", "/site/assets/js/comments.js"]
---

<div class="group" style="border-bottom: 1px dotted black">
    <h2 class="float-l">Migrating to Jekyll</h2>
    <small class="float-r">May 20, 2013</small>
</div>

If you are reading this, then you found the new site :)

This site is in full migration, so don't take heed of any content you may come across
..chances are things are incomplete or mixed up.

But feel free to look around, there some nice features comming up.

* Migrating to [Jekyll](http://jekyllrb.com) engine for site generation
  - logical layouts
  - post generation
  - static content generation
* Testing HeadJS v2.0
* Comments integration with [moot.it](http://moot.it)
  * project on which the original creator of HeadJS now works on
  * check it out, it's pretty cool (beta)




<div class="group" style="border-top: 1px dotted black; padding: 10px;">                        
    <div class="float-l" style="width:100%">
        <button onclick="blog.loadComments(this)">Show Comments</button>   
        <div class="comments" data-forum='posts/2013/may' data-label="Leave a comment"></div>
    </div>
</div>
