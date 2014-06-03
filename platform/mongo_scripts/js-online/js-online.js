[
    {
      "id": "opening",
      "name": "Hello World",
      "title": "JavaScript 4 Programmers - Quick Introduction",
      "left": {
        "text": "<h3>\n  Hello <span class=\"user-name\"></span>!\n</h3>\n<h2>\n  <a href=\"http://devmeetings.pl\"><img src=\"http://devmeetings.pl/assets/logo-18db74aab9d40e85fddffe7608edd756.jpg\"></a>\n  rocks!\n</h2>\n",
        "code": {
          "small": true,
          "hideOutput": true,
          "content": "var username = localStorage.getItem('name');\nwhile (!username) {\n  username = prompt(\"Please provide your name\");\n}\nlocalStorage.setItem('name', username);\ndocument.querySelector('.user-name').innerText = username;\n",
          "mode": "javascript"
        },
        "jsrunner" : true
      },
      "right": {
        "text": ">\n<div class=\"text-center\">\n  <a href=\"http://pl.tinypic.com?ref=oa2mbk\" target=\"_blank\">\n    <img src=\"http://i39.tinypic.com/oa2mbk.png\" alt=\"Image and video hosting by TinyPic\" width=\"400\">\n  </a>\n</div>\n"
      },
      "notes": "What will we learn today:\n  - Introduction to HTML and CSS\n  - JavaScript basics\n"
    },
    {
      "id": "run",
      "name": "Run",
      "title": "Tell that you are ready!",
      "jsrunner" : true,
      "code": {
        "mode" : "javascript",
        "hideOutput": true,
        "small": true,
        "content": "var ready = false;\n"
      },
      "microtasks": [
        {
          "description": "Change <code>ready</code> value to <code>true</code>",
          "hint": "Write <code>ready=true</code> inside code editor.",
          "js_assert": "return ready === true\n",
          "monitor": "ready"
        }
      ]
    },
    {
      "id": "basics1",
      "name": "JS Basics",
      "title": "JS Essentials in 5 minutes",
      "monitor": "todos",
      "jsrunner" : true,
      "code": {
        "mode" : "javascript",
        "content": "var todos = [{\n  title: \"Checkout project from github\",\n  completed: true\n}, {\n  title: \"Learn JS essentials\",\n  completed: false\n}];\n\nfor (var k in todos) {\n  console.log(todos[k]);\n}\n"
      },
      "microtasks": [
        {
          "monitor" : "todos",
          "description": "Change <code>completed</code> state of second todo",
          "hint": "Change false to true in second todos in array",
          "js_assert": "return todos[1].completed\n"
        },
        {
          "monitor" : "todos",
          "description": "Add another todo to \"todos\" variable",
          "hint": "Just copy the object and paste after a comma",
          "js_assert": "return todos[2].title && todos[2].completed !== undefined\n"
        }
      ],
      "notes": "0. JS is:\n  * interpreted\n  * dynamically typed\n  * awesome\n1. Keyword `var`\n2. Assignment\n3. String literal, Array literal\n  - Say something about auto-execution\n  - Show how to use object inspector\n4. Opening Chrome Dev Tools / Firebug\n  - F12 / Ctrl+Shift+I\n  - Go to \"Console\" tab.\n  - Show where to search for errors\n  - Mention about Debugging\n"
    },
    {
      "id": "html",
      "name": "HTML",
      "title": "HTML - old style",
      "notes": "Point out problems with this approach\n",
      "microtasks": [
        {
          "description": "Change page title to <code>HTML5 Rocks</code>",
          "hint": "Locate tag <code>&lt;title&gt;</code> and change it's value",
          "html": "<TITLE>HTML5 Rocks</TITLE>"
        },
        {
          "description": "Add <code>deprecated</code> class to HTML element.",
          "hint": "Change tag &lt;html&gt; at top to &lt;html class=\"deprecated\"&gt;",
          "html": "<HTML class=\"deprecated\">"
        }
      ],
      "fiddle": {
        "pure": true,
        "big": true,
        "html": "<!DOCTYPE HTML PUBLIC \"-//W3C//DTD HTML 3.2 Final//EN\">\n<HTML>\n<HEAD>\n <base href=\"https://web.archive.org/web/19990208011032/http://wp.pl/\">\n <META HTTP-EQUIV=\"KeyWords\" CONTENT=\"Wirtualna Polska, Katalog stron WWW, Wyszukiwarka, Serwisy, Firmy, Encyklopedia, Pogoda,Wiadomości, Kalendarz, Wirtualny Sklep, Wirtualna Kawiarenka, Forum, Netscape\">\n <META  name=\"description\"  content=\"Wirtualna Polska , Katalog Stron WWW, Wyszukiwarka, Serwisy, Encyklopedia\">\n <META Name=\"Language\" CONTENT=\"Polski\">\n <TITLE>Wirtualna Polska</TITLE>\n<STYLE TYPE=\"text/css\">\n TD { font-family: Arial ,Helvetica;  font-size: 10pt; color: #013E87;}\n .s { font-size: 10pt; color: #FFFFFF; }\n .t   { font-size: 10pt;}\n .st  { font-size: 10pt;}\n .s2 { font-size: 10pt;}\n  .sm { font-size: 8pt;}\n .ss { font-size: 5pt; }\n .sn { font-size: 10pt; text-decoration: none;}\n</STYLE>\n</HEAD>\n<BODY BGCOLOR=\"White\" LINK=\"#013E87\" VLINK=\"#013E87\" TEXT=\"#013E87\" ALINK=\"#C2010B\">\n<CENTER>\n<TABLE ALIGN=\"Center\" BORDER=\"0\" CELLSPACING=\"0\" CELLPADDING=\"0\" WIDTH=\"600\" BGCOLOR=\"#FFFFFF\">\n<TR BGCOLOR=\"#D3E1ED\">\n <TD VALIGN=\"Middle\" WIDTH=\"288\" COLSPAN=2><NOBR><IMG SRC=\"/web/19990117091402im_/http://img.wp.pl/sl_wp.gif\" BORDER=0><IMG SRC=\"/web/19990117091402im_/http://img.wp.pl/wp_wp.gif\" ALT=\"Wirtualna Polska\" BORDER=\"0\"></NOBR></TD>\n  <TD  VALIGN=\"Middle\" WIDTH=\"140\" ALIGN=\"Left\">\n   <FONT FACE=\"Arial CE\"  COLOR=\"#1A3C73\" SIZE=-2 class=\"st\">\n <A HREF=\"/web/19990117091402/http://www.ws.pl/\" onMouseOver=\"window.status='Wirtualny Sklep'; return true\" onMouseOut=\"window.status=''; return true\"><FONT COLOR=\"#1A3C73\">Wirtualny&nbsp;Sklep</Font></A><BR>\n  <A HREF=\"/web/19990117091402/http://kawiarenka.wp.pl/\" onMouseOver=\"window.status='Wirtualna Kawiarenka'; return true\" onMouseOut=\"window.status=''; return true\"><FONT COLOR=\"#1A3C73\">Wirtualna&nbsp;Kawiarenka</FONT></A><BR>\n  <A HREF=\"/web/19990117091402/http://encyklopedia.wp.pl/\"><FONT COLOR=\"#1A3C73\">Encyklopedia</FONT></A><BR>\n  <A HREF=\"/web/19990117091402/http://firmy.wp.pl/\"><FONT COLOR=\"#1A3C73\">Firmy</FONT></A></FONT></TD>\n <TD  VALIGN=Middle WIDTH=\"140\" ALIGN=\"Right\" HEIGHT=85>\n<!--Reklama prawa start-->\n<A HREF=\"/web/19990117091402/http://reklama.wp.pl/click_lx.ads/reklama.wp.pl/wp/Strona_Glowna/TopRight/973733938/TopRight/jtt/y2k-ver3-3.gif/63333735323633333336613161393030\" target=\"_top\"><IMG SRC=\"/web/19990117091402im_/http://reklama.wp.pl/adstream_lx.ads/reklama.wp.pl/wp/Strona_Glowna/TopRight/973733938/TopRight/jtt/y2k-ver3-3.gif/63333735323633333336613161393030\"  ALT=\"Powered by Adax\" border=0 width=140 height=75 ALIGN=Left></A>\n<!--Reklama stop-->\n</TD>\n  </TR>\n <TR>\n  <TD HEIGHT=2 COLSPAN=4><IMG SRC=\"/web/19990117091402im_/http://img.wp.pl/pixel.gif\"  WIDTH=\"1\" HEIGHT=\"1\" BORDER=\"0\"></TD>\n </TR>\n  <TR>\n     <TD  ALIGN=\"Center\" COLSPAN=4>\n     <NOBR>\n     <A HREF=\"/web/19990117091402/http://www.wp.pl/pomoc/\"><IMG SRC=\"/web/19990117091402im_/http://img.wp.pl/pomoc.gif\"  Alt=\"Pomoc\" BORDER=\"0\"></A>\n     <IMG SRC=\"/web/19990117091402im_/http://img.wp.pl/pixel.gif\"  WIDTH=\"40\" HEIGHT=\"1\" BORDER=\"0\">\n     <A HREF=\"/web/19990117091402/http://www.wp.pl/nowa/index.html\"><IMG SRC=\"/web/19990117091402im_/http://img.wp.pl/nowa_wirtualna.gif\" Alt=\"Nowa Wirtualna Polska\" BORDER=\"0\"></A>\n     <IMG SRC=\"/web/19990117091402im_/http://img.wp.pl/pixel.gif\"  WIDTH=\"40\" HEIGHT=\"1\" BORDER=\"0\">\n     <A HREF=\"/web/19990117091402/http://poczta.wp.pl/\"><IMG SRC=\"/web/19990117091402im_/http://img.wp.pl/poczta1.gif\"  Alt=\"moja poczta\" BORDER=\"0\"></A>\n   <IMG SRC=\"/web/19990117091402im_/http://img.wp.pl/pixel.gif\"  WIDTH=\"40\" HEIGHT=\"1\" BORDER=\"0\">\n     <A HREF=\"/web/19990117091402/http://kawiarenka.wp.pl/\"><IMG SRC=\"/web/19990117091402im_/http://img.wp.pl/wirt_kaw.gif\"   Alt=\"Wirtualna Kawiarenka\" BORDER=\"0\"></A></NOBR></TD>\n  </TR>\n</TABLE>\n<TABLE ALIGN=\"Center\" BORDER=\"0\" CELLSPACING=\"0\" CELLPADDING=\"0\" WIDTH=\"600\" BGCOLOR=\"#FFFFFF\">\n<!-- Srodek -->\n<TR>\n<TD COLSPAN=\"3\" VALIGN=Top>\n     <!--1 kolumna -->\n              <!-- Servis-->\n             <TABLE BORDER=\"0\" CELLSPACING=\"4\" CELLPADDING=\"0\" WIDTH=\"134\" BGCOLOR=\"#FFFFFF\">\n              <TR BGCOLOR=\"#49A6C5\">\n               <TD  ALIGN=\"center\"><FONT FACE=\"Arial,Helvetica\" COLOR=\"#49A6C5\" SIZE=-2><B CLASS=\"s\">Serwisy</B></FONT></TD>\n              </TR>\n              <TR BGCOLOR=\"#FFFFFF\">\n                <TD HEIGHT=1><IMG SRC=\"/web/19990117091402im_/http://img.wp.pl/pixel.gif\"  WIDTH=\"1\" HEIGHT=\"1\" BORDER=\"0\"></TD>\n              </TR>\n              <TR BGCOLOR=\"#FFFFFF\">\n                <TD ALIGN=\"Center\">\n                  <MAP NAME=\"serwis\">\n  <AREA SHAPE=\"rect\" COORDS=\"2,0,120,29\" HREF=\"/web/19990117091402/http://kapital.wp.pl/\" onmouseover=\"window.status='Serwis kapitałowy';return true\" alt=\"Serwis kapitałowy\">\n  <AREA SHAPE=\"rect\" COORDS=\"2,33,120,52\" HREF=\"/web/19990117091402/http://firmy.wp.pl/\" onmouseover=\"window.status='Firmy';return true\" alt=\"Firmy\">\n  <AREA SHAPE=\"rect\" COORDS=\"2,57,120,74\" HREF=\"/web/19990117091402/http://encyklopedia.wp.pl/\" onmouseover=\"window.status='Encyklopedia';return true\" alt=\"Encyklopedia\">\n  <AREA SHAPE=\"rect\" COORDS=\"2,79,120,98\" HREF=\"/web/19990117091402/http://wiadomosci.wp.pl/\" onmouseover=\"window.status='Wiadomości';return true\" alt=\"Wiadomości\">\n  <AREA SHAPE=\"rect\" COORDS=\"2,102,120,120\" HREF=\"/web/19990117091402/http://pogoda.wp.pl/\" onmouseover=\"window.status='Pogoda';return true\" alt=\"Pogoda\">\n  <AREA SHAPE=\"rect\" COORDS=\"2,125,120,143\" HREF=\"/web/19990117091402/http://bg.wp.pl/\" onmouseover=\"window.status='Ból Głowy';return true\" alt=\"Ból Głowy\">\n  <AREA SHAPE=\"rect\" COORDS=\"2,148,120,167\" HREF=\"/web/19990117091402/http://dzieci.wp.pl/\" onmouseover=\"window.status='Dla Dzieci';return true\" alt=\"Dla Dzieci\">\n  </MAP>\n<IMG ismap SRC=\"/web/19990117091402im_/http://img.wp.pl/serwis1_1.gif\" BORDER=\"0\" usemap=\"#serwis\">\n</TD>\n  </TR>\n  <TR BGCOLOR=\"#49A6C5\">\n         <TD ALIGN=Center BGCOLOR=\"#49A6C5\"><FONT FACE=\"Arial,Helvetica\" COLOR=\"#FFFFFF\" SIZE=-1><B CLASS=\"s\">Polecamy</B></FONT></TD>\n   </TR >\n   <!--reklama 1-->\n   <TR>\n      <TD HEIGHT=\"36\">\n      <!--Reklama lewa3 start-->\n      <A HREF=\"/web/19990117091402/http://reklama.wp.pl/click_lx.ads/reklama.wp.pl/wp/Strona_Glowna/Left3/588246689/Left3/dlaczego/dlaczego_wp.gif/63333735323633333336613161393030\" target=\"_top\"><IMG SRC=\"/web/19990117091402im_/http://reklama.wp.pl/adstream_lx.ads/reklama.wp.pl/wp/Strona_Glowna/Left3/588246689/Left3/dlaczego/dlaczego_wp.gif/63333735323633333336613161393030\"  ALT=\"\" border=0 width=134 height=36></A>\n      <!--Reklama stop-->\n      </TD>\n   </TR>\n   <TR>\n      <TD ALIGN=Center HEIGHT=\"36\">\n     <!--Reklama lewa2 start-->\n      <A HREF=\"/web/19990117091402/http://reklama.wp.pl/click_lx.ads/reklama.wp.pl/wp/Strona_Glowna/Left2/1988136203/Left2/sun/sun3.jpg/63333735323633333336613161393030\" target=\"_top\"><IMG SRC=\"/web/19990117091402im_/http://reklama.wp.pl/adstream_lx.ads/reklama.wp.pl/wp/Strona_Glowna/Left2/1988136203/Left2/sun/sun3.jpg/63333735323633333336613161393030\"  ALT=\"\" border=0 width=134 height=36></A>\n      <!--Reklama stop-->\n      </TD>\n   </TR>\n    <!--1 menu 1.4 -->\n   <TR  BGCOLOR=\"#F9FAD6\">\n         <TD HEIGHT=\"36\"><A HREF=\"/web/19990117091402/http://www.wp.pl/Konferencja/\"><IMG SRC=\"/web/19990117091402im_/http://img.wp.pl/konf1.gif\"BORDER=\"0\"></A></TD>\n   </TR>\n    <!--1 menu 1.2 -->\n    <TR  BGCOLOR=\"#F4F3E8\">\n         <TD HEIGHT=\"36\"><IMG SRC=\"/web/19990117091402im_/http://img.wp.pl/s5.gif\" ALIGN=\"Left\" WIDTH=\"12\" HEIGHT=\"13\" BORDER=\"0\" VSPACE=\"3\" HSPACE=\"3\"><A HREF=\"/web/19990117091402/http://forum.wp.pl/\">\n          <FONT COLOR=\"#004080\" SIZE=\"2\" FACE=\"Arial CE\">Forum&nbsp;Wirtualnej Polski</FONT></A></TD>\n    </TR>\n    <!--1 menu 1.3 -->\n   <TR BGCOLOR=\"#FFF2DE\">\n        <TD HEIGHT=\"36\"><IMG SRC=\"/web/19990117091402im_/http://img.wp.pl/s6.gif\" ALIGN=\"Left\" WIDTH=\"12\" HEIGHT=\"13\" BORDER=\"0\" VSPACE=\"3\" HSPACE=\"3\"><A HREF=\"/web/19990117091402/http://kg.wp.pl/\"><FONT COLOR=\"#004080\" SIZE=\"2\" FACE=\"Arial CE\">Księga&nbsp;Gości</FONT></A></TD>\n   </TR>\n    <!--1 menu 1.5 -->\n    <TR  BGCOLOR=\"#DCF4DB\">\n         <TD HEIGHT=\"36\"><IMG SRC=\"/web/19990117091402im_/http://img.wp.pl/s4.gif\" ALIGN=\"Left\" WIDTH=\"12\" HEIGHT=\"13\" BORDER=\"0\" VSPACE=\"3\" HSPACE=\"3\"><A HREF=\"/web/19990117091402/http://www.wp.pl/Netscape/\"><FONT COLOR=\"#004080\" SIZE=\"2\" FACE=\"Arial CE\">Netscape</FONT></A></TD>\n    </TR>\n    </TABLE>\n </TD>\n </TR>\n<TR BGCOLOR=\"#D3E1ED\">\n    <TD VALIGN=\"Middle\" ALIGN=\"Left\" HEIGHT=\"30\" COLSPAN=4>\n      <FONT COLOR=\"#1A3C73\" SIZE=\"-1\" FACE=\"Arial CE\" CLASS=\"st\">&nbsp;Copyright&nbsp;&copy;&nbsp;1995-1998&nbsp;<A HREF=\"/web/19990117091402/http://www.wp.pl/\"><FONT COLOR=\"#1A3C73\">Wirtualna&nbsp;Polska</FONT></A>&nbsp;Sp.&nbsp;z&nbsp;o.o.<!--Reklama Position1 start-->\n<A HREF=\"/web/19990117091402/http://reklama.wp.pl/click_lx.ads/reklama.wp.pl/wp/Strona_Glowna/Position1/744609359/Position1/stat_wp_glowna/pixel.gif/63333735323633333336613161393030\" target=\"_top\"><IMG SRC=\"/web/19990117091402im_/http://reklama.wp.pl/adstream_lx.ads/reklama.wp.pl/wp/Strona_Glowna/Position1/744609359/Position1/stat_wp_glowna/pixel.gif/63333735323633333336613161393030\"  ALT=\"\" border=0 height=1 width=1></A>\n<!--Reklama stop-->\n</FONT></TD>\n<TD VALIGN=\"Middle\" ALIGN=\"Center\" HEIGHT=\"30\">\n      <FONT COLOR=\"#1A3C73\" SIZE=\"-1\" FACE=\"Arial CE\" CLASS=\"st\"><A HREF=\"/web/19990117091402/http://www.wp.pl/nowa/\"><FONT COLOR=\"#1A3C73\">O&nbsp;serwisie&nbsp;i&nbsp;firmie</FONT></A></FONT></TD>\n</TR>\n</TABLE>\n</CENTER>\n</BODY>\n</HTML>\n"
      }
    },
    {
      "id": "htmlvs",
      "name": "HTML",
      "title": "HTML - old vs new",
      "left": {
        "fiddle": {
          "hideOutput": true,
          "big": true,
          "active": "html",
          "html": "<!DOCTYPE html>\n<html>\n  <head>\n    <title>Slider</title>\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <link href=\"components/bootstrap/dist/css/bootstrap.css\" rel=\"stylesheet\">\n    <link href=\"css/styles.css\" rel=\"stylesheet\">\n  </head>\n  <body>\n    <nav>Navigation</nav>\n    <section role=\"main\" class=\"container-fluid\">\n      <div class=\"row\">\n        <div class=\"col-lg-10 col-lg-offset-1\">\n          <h1>Slide content</h1>\n        </div>\n      </div>\n    </section>\n    <aside class=\"slide-controls\">\n      <a target=\"slowmo\" data-toggle=\"tooltip\" title=\"Show code in Slowmo.js\" class=\"btn btn-success slide-control ctrl-slowmo\">\n        <span class=\"glyphicon glyphicon-dashboard\"></span>\n      </a>\n      <button data-toggle=\"tooltip\" title=\"Toggle projector mode\" class=\"btn btn-danger slide-control ctrl-proj\">\n        <span class=\"glyphicon glyphicon-bullhorn\"></span>\n      </button>\n      <br>\n      <button data-toggle=\"tooltip\" title=\"Previous\" class=\"btn btn-info slide-control ctrl-prev\">\n        <span class=\"glyphicon glyphicon-arrow-left\"></span>\n      </button>\n      <button data-toggle=\"tooltip\" title=\"Next\" class=\"btn btn-info slide-control ctrl-next\">\n        <span class=\"glyphicon glyphicon-arrow-right\"></span>\n      </button>\n    </aside>\n    <script src=\"components/jquery/jquery.js\"></script>\n    <script src=\"components/bootstrap/dist/js/bootstrap.js\"></script>\n  </body>\n</html>\n",
          "css": ".inspector-json, .output-ace, .editor {\n    font-size: 14px;\n    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro', monospace;\n}\n    font-size: 20px;\n}\n.slide-controls {\n    position: fixed;\n    right: 15px;\n    bottom: 50px;\n    opacity: 0.5;\n    transition: all 1s;\n}\n.slide-controls:hover {\n    opacity: 0.9;\n}\n.slide-controls .slide-control {\n    width: 48px;\n    height: 48px;\n    font-size: 24px;\n    line-height: 36px;\n    text-align: center;\n    display: inline-block;\n    margin: 3px;\n    transition: all .7s;\n    /*-webkit-filter: blur(1px) grayscale(.9);*/\n    -webkit-filter: grayscale(.95);\n}\n.slide-controls:hover .slide-control {\n    -webkit-filter: grayscale(.1);\n}\n.slide-controls .slide-control:hover {\n    -webkit-filter: none;\n}\n",
          "js": "// Controls handling\nvar changeSlide = function(mod) {\n  console.log(\"Changing slide.\", mod);\n};\n(function() {\n    var next = $('.ctrl-next'),\n        previous = $('.ctrl-prev');\n    var projector = $('.ctrl-proj');\n    var slowmo = $('.ctrl-slowmo');\n\n    projector.on('click', function() {\n        $('body').toggleClass('projector');\n    });\n\n    var changeSlide = function(mod) {\n        console.log(\"Changing slide.\", mod);\n    };\n    var nextSlide = changeSlide.bind(null, 1);\n    var prevSlide = changeSlide.bind(null, -1);\n    next.on('click', nextSlide);\n    previous.on('click', prevSlide);\n\n    var $doc = $(document);\n    $doc.bind('keyup', 'right', nextSlide);\n    $doc.bind('keyup', 'space', nextSlide);\n    $doc.bind('keyup', 'down', nextSlide);\n    $doc.bind('keyup', 'pagedown', nextSlide);\n\n    $doc.bind('keyup', 'up', prevSlide);\n    $doc.bind('keyup', 'pageup', prevSlide);\n    $doc.bind('keyup', 'left', prevSlide);\n}());\n"
        }
      },
      "right": {
        "text": "<br><br>",
        "code": {
          "big": true,
          "language": "html",
          "content": "<!DOCTYPE HTML PUBLIC \"-//W3C//DTD HTML 3.2 Final//EN\">\n<HTML>\n<HEAD>\n <base href=\"https://web.archive.org/web/19990208011032/http://wp.pl/\">\n <META HTTP-EQUIV=\"KeyWords\" CONTENT=\"Wirtualna Polska, Katalog stron WWW, Wyszukiwarka, Serwisy, Firmy, Encyklopedia, Pogoda,Wiadomości, Kalendarz, Wirtualny Sklep, Wirtualna Kawiarenka, Forum, Netscape\">\n <META  name=\"description\"  content=\"Wirtualna Polska , Katalog Stron WWW, Wyszukiwarka, Serwisy, Encyklopedia\">\n <META Name=\"Language\" CONTENT=\"Polski\">\n <TITLE>Wirtualna Polska</TITLE>\n<STYLE TYPE=\"text/css\">\n TD { font-family: Arial ,Helvetica;  font-size: 10pt; color: #013E87;}\n .s { font-size: 10pt; color: #FFFFFF; }\n .t   { font-size: 10pt;}\n .st  { font-size: 10pt;}\n .s2 { font-size: 10pt;}\n  .sm { font-size: 8pt;}\n .ss { font-size: 5pt; }\n .sn { font-size: 10pt; text-decoration: none;}\n</STYLE>\n</HEAD>\n<BODY BGCOLOR=\"White\" LINK=\"#013E87\" VLINK=\"#013E87\" TEXT=\"#013E87\" ALINK=\"#C2010B\">\n<CENTER>\n<TABLE ALIGN=\"Center\" BORDER=\"0\" CELLSPACING=\"0\" CELLPADDING=\"0\" WIDTH=\"600\" BGCOLOR=\"#FFFFFF\">\n<TR BGCOLOR=\"#D3E1ED\">\n <TD VALIGN=\"Middle\" WIDTH=\"288\" COLSPAN=2><NOBR><IMG SRC=\"/web/19990117091402im_/http://img.wp.pl/sl_wp.gif\" BORDER=0><IMG SRC=\"/web/19990117091402im_/http://img.wp.pl/wp_wp.gif\" ALT=\"Wirtualna Polska\" BORDER=\"0\"></NOBR></TD>\n  <TD  VALIGN=\"Middle\" WIDTH=\"140\" ALIGN=\"Left\">\n   <FONT FACE=\"Arial CE\"  COLOR=\"#1A3C73\" SIZE=-2 class=\"st\">\n <A HREF=\"/web/19990117091402/http://www.ws.pl/\" onMouseOver=\"window.status='Wirtualny Sklep'; return true\" onMouseOut=\"window.status=''; return true\"><FONT COLOR=\"#1A3C73\">Wirtualny&nbsp;Sklep</Font></A><BR>\n  <A HREF=\"/web/19990117091402/http://kawiarenka.wp.pl/\" onMouseOver=\"window.status='Wirtualna Kawiarenka'; return true\" onMouseOut=\"window.status=''; return true\"><FONT COLOR=\"#1A3C73\">Wirtualna&nbsp;Kawiarenka</FONT></A><BR>\n  <A HREF=\"/web/19990117091402/http://encyklopedia.wp.pl/\"><FONT COLOR=\"#1A3C73\">Encyklopedia</FONT></A><BR>\n  <A HREF=\"/web/19990117091402/http://firmy.wp.pl/\"><FONT COLOR=\"#1A3C73\">Firmy</FONT></A></FONT></TD>\n <TD  VALIGN=Middle WIDTH=\"140\" ALIGN=\"Right\" HEIGHT=85>\n<!--Reklama prawa start-->\n<A HREF=\"/web/19990117091402/http://reklama.wp.pl/click_lx.ads/reklama.wp.pl/wp/Strona_Glowna/TopRight/973733938/TopRight/jtt/y2k-ver3-3.gif/63333735323633333336613161393030\" target=\"_top\"><IMG SRC=\"/web/19990117091402im_/http://reklama.wp.pl/adstream_lx.ads/reklama.wp.pl/wp/Strona_Glowna/TopRight/973733938/TopRight/jtt/y2k-ver3-3.gif/63333735323633333336613161393030\"  ALT=\"Powered by Adax\" border=0 width=140 height=75 ALIGN=Left></A>\n<!--Reklama stop-->\n</TD>\n  </TR>\n <TR>\n  <TD HEIGHT=2 COLSPAN=4><IMG SRC=\"/web/19990117091402im_/http://img.wp.pl/pixel.gif\"  WIDTH=\"1\" HEIGHT=\"1\" BORDER=\"0\"></TD>\n </TR>\n  <TR>\n     <TD  ALIGN=\"Center\" COLSPAN=4>\n     <NOBR>\n     <A HREF=\"/web/19990117091402/http://www.wp.pl/pomoc/\"><IMG SRC=\"/web/19990117091402im_/http://img.wp.pl/pomoc.gif\"  Alt=\"Pomoc\" BORDER=\"0\"></A>\n     <IMG SRC=\"/web/19990117091402im_/http://img.wp.pl/pixel.gif\"  WIDTH=\"40\" HEIGHT=\"1\" BORDER=\"0\">\n     <A HREF=\"/web/19990117091402/http://www.wp.pl/nowa/index.html\"><IMG SRC=\"/web/19990117091402im_/http://img.wp.pl/nowa_wirtualna.gif\" Alt=\"Nowa Wirtualna Polska\" BORDER=\"0\"></A>\n     <IMG SRC=\"/web/19990117091402im_/http://img.wp.pl/pixel.gif\"  WIDTH=\"40\" HEIGHT=\"1\" BORDER=\"0\">\n     <A HREF=\"/web/19990117091402/http://poczta.wp.pl/\"><IMG SRC=\"/web/19990117091402im_/http://img.wp.pl/poczta1.gif\"  Alt=\"moja poczta\" BORDER=\"0\"></A>\n   <IMG SRC=\"/web/19990117091402im_/http://img.wp.pl/pixel.gif\"  WIDTH=\"40\" HEIGHT=\"1\" BORDER=\"0\">\n     <A HREF=\"/web/19990117091402/http://kawiarenka.wp.pl/\"><IMG SRC=\"/web/19990117091402im_/http://img.wp.pl/wirt_kaw.gif\"   Alt=\"Wirtualna Kawiarenka\" BORDER=\"0\"></A></NOBR></TD>\n  </TR>\n</TABLE>\n<TABLE ALIGN=\"Center\" BORDER=\"0\" CELLSPACING=\"0\" CELLPADDING=\"0\" WIDTH=\"600\" BGCOLOR=\"#FFFFFF\">\n<!-- Srodek -->\n<TR>\n<TD COLSPAN=\"3\" VALIGN=Top>\n     <!--1 kolumna -->\n              <!-- Servis-->\n             <TABLE BORDER=\"0\" CELLSPACING=\"4\" CELLPADDING=\"0\" WIDTH=\"134\" BGCOLOR=\"#FFFFFF\">\n              <TR BGCOLOR=\"#49A6C5\">\n               <TD  ALIGN=\"center\"><FONT FACE=\"Arial,Helvetica\" COLOR=\"#49A6C5\" SIZE=-2><B CLASS=\"s\">Serwisy</B></FONT></TD>\n              </TR>\n              <TR BGCOLOR=\"#FFFFFF\">\n                <TD HEIGHT=1><IMG SRC=\"/web/19990117091402im_/http://img.wp.pl/pixel.gif\"  WIDTH=\"1\" HEIGHT=\"1\" BORDER=\"0\"></TD>\n              </TR>\n              <TR BGCOLOR=\"#FFFFFF\">\n                <TD ALIGN=\"Center\">\n                  <MAP NAME=\"serwis\">\n  <AREA SHAPE=\"rect\" COORDS=\"2,0,120,29\" HREF=\"/web/19990117091402/http://kapital.wp.pl/\" onmouseover=\"window.status='Serwis kapitałowy';return true\" alt=\"Serwis kapitałowy\">\n  <AREA SHAPE=\"rect\" COORDS=\"2,33,120,52\" HREF=\"/web/19990117091402/http://firmy.wp.pl/\" onmouseover=\"window.status='Firmy';return true\" alt=\"Firmy\">\n  <AREA SHAPE=\"rect\" COORDS=\"2,57,120,74\" HREF=\"/web/19990117091402/http://encyklopedia.wp.pl/\" onmouseover=\"window.status='Encyklopedia';return true\" alt=\"Encyklopedia\">\n  <AREA SHAPE=\"rect\" COORDS=\"2,79,120,98\" HREF=\"/web/19990117091402/http://wiadomosci.wp.pl/\" onmouseover=\"window.status='Wiadomości';return true\" alt=\"Wiadomości\">\n  <AREA SHAPE=\"rect\" COORDS=\"2,102,120,120\" HREF=\"/web/19990117091402/http://pogoda.wp.pl/\" onmouseover=\"window.status='Pogoda';return true\" alt=\"Pogoda\">\n  <AREA SHAPE=\"rect\" COORDS=\"2,125,120,143\" HREF=\"/web/19990117091402/http://bg.wp.pl/\" onmouseover=\"window.status='Ból Głowy';return true\" alt=\"Ból Głowy\">\n  <AREA SHAPE=\"rect\" COORDS=\"2,148,120,167\" HREF=\"/web/19990117091402/http://dzieci.wp.pl/\" onmouseover=\"window.status='Dla Dzieci';return true\" alt=\"Dla Dzieci\">\n  </MAP>\n<IMG ismap SRC=\"/web/19990117091402im_/http://img.wp.pl/serwis1_1.gif\" BORDER=\"0\" usemap=\"#serwis\">\n</TD>\n  </TR>\n  <TR BGCOLOR=\"#49A6C5\">\n         <TD ALIGN=Center BGCOLOR=\"#49A6C5\"><FONT FACE=\"Arial,Helvetica\" COLOR=\"#FFFFFF\" SIZE=-1><B CLASS=\"s\">Polecamy</B></FONT></TD>\n   </TR >\n   <!--reklama 1-->\n   <TR>\n      <TD HEIGHT=\"36\">\n      <!--Reklama lewa3 start-->\n      <A HREF=\"/web/19990117091402/http://reklama.wp.pl/click_lx.ads/reklama.wp.pl/wp/Strona_Glowna/Left3/588246689/Left3/dlaczego/dlaczego_wp.gif/63333735323633333336613161393030\" target=\"_top\"><IMG SRC=\"/web/19990117091402im_/http://reklama.wp.pl/adstream_lx.ads/reklama.wp.pl/wp/Strona_Glowna/Left3/588246689/Left3/dlaczego/dlaczego_wp.gif/63333735323633333336613161393030\"  ALT=\"\" border=0 width=134 height=36></A>\n      <!--Reklama stop-->\n      </TD>\n   </TR>\n   <TR>\n      <TD ALIGN=Center HEIGHT=\"36\">\n     <!--Reklama lewa2 start-->\n      <A HREF=\"/web/19990117091402/http://reklama.wp.pl/click_lx.ads/reklama.wp.pl/wp/Strona_Glowna/Left2/1988136203/Left2/sun/sun3.jpg/63333735323633333336613161393030\" target=\"_top\"><IMG SRC=\"/web/19990117091402im_/http://reklama.wp.pl/adstream_lx.ads/reklama.wp.pl/wp/Strona_Glowna/Left2/1988136203/Left2/sun/sun3.jpg/63333735323633333336613161393030\"  ALT=\"\" border=0 width=134 height=36></A>\n      <!--Reklama stop-->\n      </TD>\n   </TR>\n    <!--1 menu 1.4 -->\n   <TR  BGCOLOR=\"#F9FAD6\">\n         <TD HEIGHT=\"36\"><A HREF=\"/web/19990117091402/http://www.wp.pl/Konferencja/\"><IMG SRC=\"/web/19990117091402im_/http://img.wp.pl/konf1.gif\"BORDER=\"0\"></A></TD>\n   </TR>\n    <!--1 menu 1.2 -->\n    <TR  BGCOLOR=\"#F4F3E8\">\n         <TD HEIGHT=\"36\"><IMG SRC=\"/web/19990117091402im_/http://img.wp.pl/s5.gif\" ALIGN=\"Left\" WIDTH=\"12\" HEIGHT=\"13\" BORDER=\"0\" VSPACE=\"3\" HSPACE=\"3\"><A HREF=\"/web/19990117091402/http://forum.wp.pl/\">\n          <FONT COLOR=\"#004080\" SIZE=\"2\" FACE=\"Arial CE\">Forum&nbsp;Wirtualnej Polski</FONT></A></TD>\n    </TR>\n    <!--1 menu 1.3 -->\n   <TR BGCOLOR=\"#FFF2DE\">\n        <TD HEIGHT=\"36\"><IMG SRC=\"/web/19990117091402im_/http://img.wp.pl/s6.gif\" ALIGN=\"Left\" WIDTH=\"12\" HEIGHT=\"13\" BORDER=\"0\" VSPACE=\"3\" HSPACE=\"3\"><A HREF=\"/web/19990117091402/http://kg.wp.pl/\"><FONT COLOR=\"#004080\" SIZE=\"2\" FACE=\"Arial CE\">Księga&nbsp;Gości</FONT></A></TD>\n   </TR>\n    <!--1 menu 1.5 -->\n    <TR  BGCOLOR=\"#DCF4DB\">\n         <TD HEIGHT=\"36\"><IMG SRC=\"/web/19990117091402im_/http://img.wp.pl/s4.gif\" ALIGN=\"Left\" WIDTH=\"12\" HEIGHT=\"13\" BORDER=\"0\" VSPACE=\"3\" HSPACE=\"3\"><A HREF=\"/web/19990117091402/http://www.wp.pl/Netscape/\"><FONT COLOR=\"#004080\" SIZE=\"2\" FACE=\"Arial CE\">Netscape</FONT></A></TD>\n    </TR>\n    </TABLE>\n </TD>\n </TR>\n<TR BGCOLOR=\"#D3E1ED\">\n    <TD VALIGN=\"Middle\" ALIGN=\"Left\" HEIGHT=\"30\" COLSPAN=4>\n      <FONT COLOR=\"#1A3C73\" SIZE=\"-1\" FACE=\"Arial CE\" CLASS=\"st\">&nbsp;Copyright&nbsp;&copy;&nbsp;1995-1998&nbsp;<A HREF=\"/web/19990117091402/http://www.wp.pl/\"><FONT COLOR=\"#1A3C73\">Wirtualna&nbsp;Polska</FONT></A>&nbsp;Sp.&nbsp;z&nbsp;o.o.<!--Reklama Position1 start-->\n<A HREF=\"/web/19990117091402/http://reklama.wp.pl/click_lx.ads/reklama.wp.pl/wp/Strona_Glowna/Position1/744609359/Position1/stat_wp_glowna/pixel.gif/63333735323633333336613161393030\" target=\"_top\"><IMG SRC=\"/web/19990117091402im_/http://reklama.wp.pl/adstream_lx.ads/reklama.wp.pl/wp/Strona_Glowna/Position1/744609359/Position1/stat_wp_glowna/pixel.gif/63333735323633333336613161393030\"  ALT=\"\" border=0 height=1 width=1></A>\n<!--Reklama stop-->\n</FONT></TD>\n<TD VALIGN=\"Middle\" ALIGN=\"Center\" HEIGHT=\"30\">\n      <FONT COLOR=\"#1A3C73\" SIZE=\"-1\" FACE=\"Arial CE\" CLASS=\"st\"><A HREF=\"/web/19990117091402/http://www.wp.pl/nowa/\"><FONT COLOR=\"#1A3C73\">O&nbsp;serwisie&nbsp;i&nbsp;firmie</FONT></A></FONT></TD>\n</TR>\n</TABLE>\n</CENTER>\n</BODY>\n</HTML>\n"
        }
      }
    },
    {
      "id": "dom1",
      "name": "HTML",
      "title": "HTML5 webpage",
      "microtasks": [
        {
          "description": "Change color of header using <code>class=\"text-success\"</code>",
          "hint": "Locate &lt;h1&gt; header in HTML code and add class to it.",
          "html": "<h1 \\s*class=\"text-success\">.*?</h1>"
        },
        {
          "description": "Change <code>opacity</code> of <code>slide-controls</code> to <code>0.1</code>",
          "hint": "Go to CSS tab, locate .slide-controls and change opacity to 0.1",
          "css": "\\.slide\\-controls\\s*{[^}]*?opacity:\\s*0\\.1;"
        }
      ],
      "fiddle": {
        "big": true,
        "active": "html",
        "html": "<!DOCTYPE html>\n<html>\n  <head>\n    <title>Slider</title>\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <link href=\"components/bootstrap/dist/css/bootstrap.css\" rel=\"stylesheet\">\n    <link href=\"css/styles.css\" rel=\"stylesheet\">\n  </head>\n  <body>\n    <nav>Navigation</nav>\n    <section role=\"main\" class=\"container-fluid\">\n      <div class=\"row\">\n        <div class=\"col-lg-10 col-lg-offset-1\">\n          <h1>Slide content</h1>\n        </div>\n      </div>\n    </section>\n    <aside class=\"slide-controls\">\n      <a target=\"slowmo\" data-toggle=\"tooltip\" title=\"Show code in Slowmo.js\" class=\"btn btn-success slide-control ctrl-slowmo\">\n        <span class=\"glyphicon glyphicon-dashboard\"></span>\n      </a>\n      <button data-toggle=\"tooltip\" title=\"Toggle projector mode\" class=\"btn btn-danger slide-control ctrl-proj\">\n        <span class=\"glyphicon glyphicon-bullhorn\"></span>\n      </button>\n      <br>\n      <button data-toggle=\"tooltip\" title=\"Previous\" class=\"btn btn-info slide-control ctrl-prev\">\n        <span class=\"glyphicon glyphicon-arrow-left\"></span>\n      </button>\n      <button data-toggle=\"tooltip\" title=\"Next\" class=\"btn btn-info slide-control ctrl-next\">\n        <span class=\"glyphicon glyphicon-arrow-right\"></span>\n      </button>\n    </aside>\n    <script src=\"components/jquery/jquery.js\"></script>\n    <script src=\"components/bootstrap/dist/js/bootstrap.js\"></script>\n  </body>\n</html>\n",
        "css": ".inspector-json, .output-ace, .editor {\n    font-size: 14px;\n    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro', monospace;\n}\n    font-size: 20px;\n}\n.slide-controls {\n    position: fixed;\n    right: 15px;\n    bottom: 50px;\n    opacity: 0.5;\n    transition: all 1s;\n}\n.slide-controls:hover {\n    opacity: 0.9;\n}\n.slide-controls .slide-control {\n    width: 48px;\n    height: 48px;\n    font-size: 24px;\n    line-height: 36px;\n    text-align: center;\n    display: inline-block;\n    margin: 3px;\n    transition: all .7s;\n    /*-webkit-filter: blur(1px) grayscale(.9);*/\n    -webkit-filter: grayscale(.95);\n}\n.slide-controls:hover .slide-control {\n    -webkit-filter: grayscale(.1);\n}\n.slide-controls .slide-control:hover {\n    -webkit-filter: none;\n}\n",
        "js": "// Controls handling\nvar changeSlide = function(mod) {\n  console.log(\"Changing slide.\", mod);\n};\n(function() {\n    var next = $('.ctrl-next'),\n        previous = $('.ctrl-prev');\n    var projector = $('.ctrl-proj');\n    var slowmo = $('.ctrl-slowmo');\n\n    projector.on('click', function() {\n        $('body').toggleClass('projector');\n    });\n\n    var changeSlide = function(mod) {\n        console.log(\"Changing slide.\", mod);\n    };\n    var nextSlide = changeSlide.bind(null, 1);\n    var prevSlide = changeSlide.bind(null, -1);\n    next.on('click', nextSlide);\n    previous.on('click', prevSlide);\n\n    var $doc = $(document);\n    $doc.bind('keyup', 'right', nextSlide);\n    $doc.bind('keyup', 'space', nextSlide);\n    $doc.bind('keyup', 'down', nextSlide);\n    $doc.bind('keyup', 'pagedown', nextSlide);\n\n    $doc.bind('keyup', 'up', prevSlide);\n    $doc.bind('keyup', 'pageup', prevSlide);\n    $doc.bind('keyup', 'left', prevSlide);\n}());\n"
      },
      "notes": "Talk sth about frameworks like TwitterBootstrap.\nOther examples: Foundation,\nGrid systems: Skeleton, HTML5 Boilerplate, LESS Framework\n"
    },
    {
      "id": "dom0",
      "name": "DOM",
      "title": "Document Object Model (DOM)",
      "text": "<div class=\"text-center\">\n  <figure>\n  <a href=\"http://watershedcreative.com/naked/html-tree.html\" target=\"dom\">\n    <img src=\"http://watershedcreative.com/naked/img/dom-tree.png\" />\n  </a>\n  <figcaption>\n    <address>\n      Source: \n        <a href=\"http://watershedcreative.com/naked/html-tree.html\" target=\"dom\">\n          http://watershedcreative.com/naked/html-tree.html\n        </a>\n        <span class=\"glyphicon glyphicon-new-window text-muted\"></span>\n    </address>\n  </figcaption>\n  </figure>\n</div>\n",
      "notes": "1. Ask about knowledge of DOM\n2. Explain some basics and relation to XML\n"
    },
    {
      "id": "dom2",
      "name": "Accessing DOM",
      "title": "Hello DOM",
      "microtasks": [
        {
          "description": "Change header text to <code>Accessing DOM - Vanilla.js</code> using Vanilla JS",
          "hint": "Try to assign text to <code>h1.innerText</code>",
          "js": "h1.inner(Text|HTML)\\s*=\\s*[\"']Accessing DOM \\- Vanilla\\.js[\"'];\n"
        },
        {
          "description": "In <code>querySelector</code> find just <code>h1</code> instead of <code>h1 inside .main-content</code>",
          "hint": "Change querySelector to <code>h1</code> instead of <code>.main-content h1</code>",
          "js": "querySelector\\(['\"]h1['\"]\\);\n"
        }
      ],
      "left": {
        "text": "<h4>&nbsp;</h4>",
        "monitor": "content",
        "code": {
          "small": true,
          "content": "var h1 = document.querySelector(\".main-content h1\");\nh1.innerText += \".Vanilla.\";\n\nvar content = h1.innerHTML;\n"
        }
      },
      "right": {
        "text": "<h4>\n  <span class=\"glyphicon glyphicon-new-window text-muted\"></span>\n  <a class=\"jquery-link\" href=\"http://jquery.com/\" target=\"jquery\">What is jQuery?</a>\n</h4>\n",
        "monitor": "jqueryContent",
        "code": {
          "small": true,
          "content": "var $h1 = $('.main-content h1');\n$h1.text($h1.text() + \".jQuery.\");\n\nvar jqueryContent = $h1.html();\n"
        }
      },
      "notes": "Say about accessing DOM and JavaScript representation of DOM\n\nEncourage ppl to play with content inside slide to see that more \"...\" is appended each time.\n\n\n-------\nMention that this way might be more familiar to some developers.\nExplain that jQuery is great library to manipulate DOM,\nand it makes perfect sense to use it because it hides differences\nbetween old web browsers.\n\nHowever rest of slides will be using vanilla JS to simplify syntax.\n\nExplain why we are using variables with such naming ($h1)\n"
    },
    {
      "id": "dom4",
      "name": "Accessing DOM",
      "title": "Creating DOM elements",
      "monitor": "link",
      "microtasks": [
        {
          "description": "Add class <code>btn</code> and <code>btn-default</code> to <code>$link</code>",
          "hint": "Use <code>className</code> property",
          "js": "\\$link\\.className\\s*=\\s*[\"']btn\\s+btn\\-default[\"'];\n"
        },
        {
          "description": "Create <code>&lt;button&gt;</code> element instead of anchor <code>&lt;a&gt;</code>",
          "hint": "Change invocation of <code>d.createElement('a')</code>",
          "js": "d(ocument)?\\.createElement\\([\"']button[\"']\\)\n"
        }
      ],
      "fiddle": {
        "js": "var d = document;\nvar $link = d.createElement('a');\n$link.id = 'link';\n$link.href = \n    'https://developer.mozilla.org/en-US/docs/Web/API/Element';\n$link.innerHTML = 'DOM: Element specification';\n\nd.body.appendChild($link);\n"
      },
      "notes": "1. Talk about difference between `querySelector` and `querySelectorAll`\n2. Maybe someone will notice that strings are created via `'` not `\"`.\n"
    },
    {
      "id": "task-dom",
      "name": "Task 1",
      "title": "Task: Displaying list of todos",
      "text": "<iframe src=\"http://todr.me/tood.html\" style=\"height: 120px\"></iframe>\n",
      "code": {
        "small": true,
        "hideOutput": true,
        "content": "var todos = [{\n  title: \"Checkout project from github\",\n  completed: true\n}, {\n  title: \"Learn JS essentials\",\n  completed: false\n}];\n"
      },
      "task": {
        "duration": 30,
        "objectives": "Iterate over an array of todos and create DOM elements to display them as text.",
        "extras": [
          "Display <code>completed</code> state of todo using disabled <code>&lt;input type=\"checkbox\"&gt;</code>",
          "Use Bootstrap <code>.list-group</code> component."
        ],
        "solution": {
          "name": "Displaying list of todos - Solution",
          "title": "Displaying list of todos",
          "fiddle": {
            "big": true,
            "active": "html",
            "js": "var todos = [{\n  title: \"Checkout project from github\", completed: true\n}, {\n  title: \"Learn JS essentials\", completed: false\n}];\nvar $todosContainer = document.querySelector('.todos');\n$todosContainer.className = 'list-group';\n\nvar k, todo, $todo, $checkbox;\nfor (k in todos) {\n    todo = todos[k];\n\n    $checkbox = document.createElement('input');\n    $checkbox.type = 'checkbox';\n    $checkbox.disabled = true;\n    $checkbox.checked = todo.completed;\n\n    $todo = document.createElement('a');\n    $todo.className = 'list-group-item';\n\n    $todo.appendChild($checkbox);\n    $todo.appendChild(document.createTextNode(todo.title));\n\n    $todosContainer.appendChild($todo);\n}\n",
            "html": "<!DOCTYPE html>\n<html lang=\"en\">\n  <head>\n    <meta charset=\"utf-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <title>Todos</title>\n    <link rel=\"stylesheet\" href=\"css/bootstrap.css\">\n  </head>\n  <body>\n    <!-- page content -->\n    <div class=\"todos\"></div>\n    <script src=\"//code.jquery.com/jquery.js\"></script>\n    <script src=\"js/bootstrap.js\"></script>\n  </body>\n</html>\n"
          }
        }
      }
    },
    {
      "id": "task-solution",
      "name": "Task 1",
      "title": "Task 1: Workspace",
      "text": "<h3><span class=\"text-success\">Objective: </span> Iterate over an array of todos and create DOM elements to display them as text.</h3>\n",
      "fiddle": {
        "big": true,
        "active": "js",
        "pure": true,
        "html": "<!DOCTYPE html>\n<html>\n  <head>\n    <meta charset=\"utf8\">\n    <title>Slider</title>\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <link href=\"http://netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css\" rel=\"stylesheet\">\n  </head>\n  <body>\n    <h1>My Todos</h1>\n    <ul class=\"todos\"></ul>\n  </body>\n</html>\n",
        "css": ".todos {\n    font-size: 1.5em;\n}\n",
        "js": "var todos = [{\n  title: \"Checkout project from github\",\n  completed: true\n}, {\n  title: \"Learn JS essentials\",\n  completed: false\n}];\n\n// Display todos by creating DOM elements\nvar d = document;\nvar $todos = d.querySelector('.todos');\n$todos.innerHTML = \"Use <code>appendChild</code> instead of <code>innerHTML</code>\";\n"
      }
    },
    {
      "id": "whatsmore",
      "name": "What's more",
      "title": "What's more? Day 1",
      "text": "<h3>\n  <span class=\"glyphicon glyphicon-ok text-success\"></span>\n  JS Objects - how do they work?\n</h3>\n<h3>\n  <span class=\"glyphicon glyphicon-ok text-success\"></span>\n  Functions, Contexts and Scopes\n</h3>\n<h3>\n  <span class=\"glyphicon glyphicon-ok text-success\"></span>\n  DOM Events - Reacting to User Actions\n</h3>\n<h3>\n  <span class=\"glyphicon glyphicon-ok text-success\"></span>\n  Functional JavaScript\n</h3>\n<h3>\n  <span class=\"glyphicon glyphicon-ok text-success\"></span>\n  JSON - lightweight exchange format\n</h3>\n<h3>\n  <span class=\"glyphicon glyphicon-ok text-success\"></span>\n  LocalStorage - persistence for ClientSide applications\n</h3>\n"
    },
    {
      "id": "whatsmore2",
      "name": "What's more",
      "title": "What's more? Day 2",
      "text": "<h3>\n  <span class=\"glyphicon glyphicon-ok text-success\"></span>\n  The magical <code>this</code> keyword - JavaScript Contexts\n</h3>\n<h3>\n  <span class=\"glyphicon glyphicon-ok text-success\"></span>\n  REST - creating RESTful JSON API\n</h3>\n<h3>\n  <span class=\"glyphicon glyphicon-ok text-success\"></span>\n  AJAX - JS meets RESTful API\n</h3>\n<h3>\n  <span class=\"glyphicon glyphicon-ok text-success\"></span>\n  Node.js + Express + MongoDB - JS meets Server Side\n</h3>\n<h3>\n  <span class=\"glyphicon glyphicon-ok text-success\"></span>\n  Object-oriented JS, JS MV* Frameworks\n</h3>\n<h3>\n  <span class=\"glyphicon glyphicon-ok text-success\"></span>\n  JavaScripts caveats - \n  <span class=\"glyphicon glyphicon-new-window text-muted\"></span>\n  <a target=\"ext\" href=\"//wtfjs.com\">WTF JS?</a>, \n  <span class=\"glyphicon glyphicon-new-window text-muted\"></span>\n  <a target=\"ext\" href=\"https://www.destroyallsoftware.com/talks/wat\">WAT!?</a>\n</h3>\n"
    },
    {
      "id": "task-survey",
      "name": "Task 2",
      "title": "Task: Complete the survey",
      "text": "<iframe style=\"height: 300px\" src=\"https://docs.google.com/forms/d/1jIbFP61foh6KovNIEFNUQqZR71yFvzrsiRC5ZlLGl6U/viewform?embedded=true\"></iframe>\n",
      "task": {
        "duration": 5,
        "objectives": [
          "Complete the survey under link above"
        ],
        "extras": [
          "Provide very detailed answers to open-ended questions"
        ]
      }
    },
    {
      "id": "pwyw",
      "name": "Pay What You Want",
      "title": "",
      "text": "<iframe src=\"https://docs.google.com/forms/d/1mZ9n_BwFPICmXidAV0wYzY5FNzrwcFEsok2TPmbsg90/viewform?embedded=true\"></iframe>\n"
    },
    {
      "id": "ending",
      "name": "Ending",
      "title": "How do you like JS?",
      "text": "<div class=\"text-center\">\n  <a href=\"http://pl.tinypic.com?ref=oa2mbk\" target=\"_blank\">\n    <img src=\"http://i39.tinypic.com/oa2mbk.png\" alt=\"Image and video hosting by TinyPic\" width=\"400\">\n  </a>\n</div>\n<h3 class=\"text-right\">\n  <span class=\"icon-mail text-muted\"></span>\n  <a href=\"mailto:tomasz.drwiega@gmail.com\">tomasz.drwiega@gmail.com</a>\n</h3>\n<h3 class=\"text-right\">\n  <span class=\"icon-github text-muted\"></span> <a href=\"https://github.com/tomusdrw\" target=\"profile\">github/tomusdrw</a>\n  &nbsp;\n  <span class=\"icon-google-plus text-muted\"></span> <a href=\"https://plus.google.com/+TomaszDrwi%C4%99ga\" target=\"profile\">+Tomasz Drwięga</a>\n  &nbsp;\n  <span class=\"icon-linkedin text-muted\"></span> <a href=\"http://www.linkedin.com/in/tomaszdrwiega\" target=\"profile\">in/Tomasz Drwięga</a>\n</h3>\n"
    }
  ]