---
layout: main
title: Migrating to Jekyll
excerpt: Now testing Jekyll for static stite generation, including blog & comments
scripts: ["/site/assets/libs/jquery/jquery.min.js", "https://cdn.moot.it/latest/moot.min.js", "/site/assets/js/comments.min.js"]
---

#{{ page.title }} ({{ page.date | date_to_string }})

<hr />

If you are reading this, then you found the new site :)

This site is in full migration, so don't take heed of any content you may come across
..chances are things are incomplete or mixed up.

But feel free to look around, some nice features are comming up.

* Migrating to [Jekyll](http://jekyllrb.com) engine for site generation
  - logical layouts
  - post generation
  - static content generation
* Testing HeadJS v2.0
* Comments integration with [moot.it](http://moot.it)
  * project on which the original creator of HeadJS now works on
  * check it out, it's pretty cool (beta)


<div onclick="blog.loadComments(this, 'posts/2013/may', 'Leave a comment')" style="cursor: pointer;">
    <h2>Show Comments</h2>
</div>
<div id="moot">&nbsp;</div>