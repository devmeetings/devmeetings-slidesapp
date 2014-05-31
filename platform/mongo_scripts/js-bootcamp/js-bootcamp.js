[
    {
      "id": "opening",
      "name": "Hello World",
      "title": "JavdfaScript 4 Programmers - Quick Introduction",
      "left": {
        "text": "<h3>\n  Hello <span class=\"user-name\"></span>!\n</h3>\n<h2>\n  <a href=\"http://devmeetings.pl\"><img src=\"http://devmeetings.pl/assets/logo-18db74aab9d40e85fddffe7608edd756.jpg\"></a>\n  rocks!\n</h2>\n",
        "code": {
          "small": true,
          "hideOutput": true,
          "content": "var username = localStorage.getItem('name');\nwhile (!username) {\n  username = prompt(\"Please provide your name\");\n}\nlocalStorage.setItem('name', username);\ndocument.querySelector('.user-name').innerText = username;\n"
        }
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
      "code": {
        "hideOutput": true,
        "small": true,
        "content": "var ready = false;\n"
      },
      "microtasks": [
        {
          "description": "Change <code>ready</code> value to <code>true</code>",
          "hint": "Write <code>ready=true</code> inside code editor.",
          "js_assert": "ready === true\n"
        }
      ]
    },
    {
      "id": "basics1",
      "name": "JS Basics",
      "title": "JS Essentials in 5 minutes",
      "monitor": "todos",
      "code": {
        "content": "var todos = [{\n  title: \"Checkout project from github\",\n  completed: true\n}, {\n  title: \"Learn JS essentials\",\n  completed: false\n}];\n\nfor (var k in todos) {\n  console.log(todos[k]);\n}\n"
      },
      "microtasks": [
        {
          "description": "Change <code>completed</code> state of second todo",
          "hint": "Change false to true in second todos in array",
          "js_assert": "todos[1].completed\n"
        },
        {
          "description": "Add another todo to \"todos\" variable",
          "hint": "Just copy the object and paste after a comma",
          "js_assert": "todos[2].title && todos[2].completed !== undefined\n"
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
      "id": "functional1",
      "name": "Functional JS",
      "title": "JS functional-style",
      "monitor": "primes2",
      "code": "var primes = [2, 3, 5, 7, 11, 13];\n\nvar primes2 = [];\nfor (var k in primes) {\n   primes2.push(primes[k]);\n}\n\nprimes.forEach(function(prime, k) {\n  primes2.push(prime);\n});\n",
      "notes": "This is example is not impressive yet.\nBut most important advantage is new scope created for loop.\n"
    },
    {
      "id": "functional2",
      "name": "Functional JS",
      "title": "JS functional-style processing",
      "monitor": "result",
      "code": "var primes = [2, 3, 5, 7, 11, 13];\n\nvar result = primes.map(function(prime) {\n  return prime * prime;\n});\n",
      "notes": "`map` will return new array with every item converted by given function\nBut what if we want to process only completed elements?\n",
      "microtasks": [
        {
          "description": "<code>result</code> array should contain all elements in power of <code>3</code>",
          "hint": "<code>prime * prime * prime</code>",
          "js_assert": "result[0] === 8 && result[2] === 125\n"
        }
      ]
    },
    {
      "id": "functional3",
      "name": "Functional JS",
      "title": "JS functional-style processing - chaining",
      "monitor": "result",
      "code": "var primes = [2, 3, 5, 7, 11, 13];\n\nvar result = primes.filter(function(prime) {\n  return prime > 7;\n}).map(function(prime) {\n  return prime * prime;\n});\n",
      "notes": "We can chain invocations because those functions just returns new arrays\n",
      "microtasks": [
        {
          "description": "Chain result one more time and remove every number lesser than <code>150</code>",
          "hint": "Use <code>filter</code> method and <code>prime2 &lt; 15</code> return value.",
          "js_assert": "result.length === 1 && result[0] === 121\n"
        }
      ]
    },
    {
      "id": "functional4",
      "name": "Functional JS",
      "title": "JS functional-style reduce",
      "monitor": "result",
      "code": "var primes = [2, 3, 5, 7, 11, 13];\n\nvar result = primes.reduce(function(sum, prime) {\n  return sum + prime;\n}, 0);\n",
      "notes": "Using `reduce` we can process arrays in more advanced ways.\n",
      "microtasks": [
        {
          "description": "In <code>result</code> store multiplication of all elements using reduce.",
          "hint": "Change default value at the end to <code>1</code> and change operation inside function.",
          "js_assert": "result === primes.reduce(function(m, p) { return m * p; }, 1)\n"
        }
      ]
    },
    {
      "id": "contexts1",
      "name": "Contexts",
      "title": "Reusability of methods",
      "monitor": "TodosModel._todos",
      "code": "var TodosModel = {\n  _todos: [],\n\n  addTodo: function(title) {\n    TodosModel._todos.push({\n      title: title,\n      completed: false\n    });\n  }\n};\n\nTodosModel.addTodo(\"New todo\");\n",
      "microtasks": [
        {
          "description": "Change access to <code>_todos</code> using <code>this</code>",
          "hint": "Substitute <code>TodosModel._todos</code> with <code>this</code>",
          "js": "this\\._todos.push\n"
        }
      ],
      "notes": "Remind about reusability matter that we have been talking about earlier.\nChange TodosModel to \"this\" in this snippet and explain similarity to Java\n"
    },
    {
      "id": "contexts2",
      "name": "Contexts",
      "title": "Contexts - caveats",
      "microtasks": [
        {
          "description": "<code>adder1</code> should add <code>3</code> instead of <code>5</code>",
          "hint": "Change <code>b:3</code> in <code>adder1</code>",
          "js_assert": "adder1.b === 3\n"
        },
        {
          "description": "Borrow <code>add</code> function from <code>adder1</code> to <code>adder2</code>",
          "hint": "Assign <code>adder1.add</code> to <code>adder2.add</code>",
          "js_assert": "adder1.add === adder2.add\n"
        }
      ],
      "monitor": "results",
      "code": {
        "big": true,
        "content": "var results = [];\nvar adder1 = {\n  b: 5,\n  add: function(a) {\n    return a + this.b;\n  }\n};\nresults.push(\n  adder1.add(10)\n);\n\nvar adder2 = {\n  b: 7\n};\n"
      },
      "notes": "// Remind that value is resolved during execution - same is with `this` keyword.\n\n// Try to ask how JS knows what should `this` be resolved to?\n\n// Add this code\n\n//Borrow function\nadder2.add = adder1.add;\n\nresults.push(\n  adder2.add(10)\n);\n"
    },
    {
      "id": "contexts3",
      "name": "Contexts",
      "title": "Contexts - more caveats",
      "microtasks": [
        {
          "description": "Assign <code>7</code> to global variable <code>b</code>",
          "hint": "<code>window.b = 7</code>",
          "js_assert": "window.b === 7\n"
        }
      ],
      "monitor": "result",
      "code": "var adder1 = {\n  b: 5,\n  add: function(a) {\n    return a + this.b;\n  }\n};\n\nvar justAdd = adder1.add;\n\nvar result = \"Result is \" + justAdd(10);\n",
      "notes": "// Now ask if someone understands what happened:)\n\n// Introduce more confusement by writing\nwindow.b = 7\n\n// Explain what global scope is and that `this` is set to global scope if none can be found.\n"
    },
    {
      "id": "contexts4",
      "name": "Contexts",
      "title": "Contexts - even more caveats",
      "microtasks": [
        {
          "description": "Bind context of increment using <code>bind</code> method",
          "hint": "<code>State.increment.bind(State)</code>",
          "js": "State\\.increment\\.bind\\(State\\)\n"
        }
      ],
      "fiddle": {
        "hideOutput": true,
        "big": true,
        "js": "var $btn = document.querySelector('.increment-btn');\nvar $output = document.querySelector('.increment-output');\n\nvar State = {\n  i: 0,\n  increment: function() {\n    this.i++;\n    console.log(this.i, State.i);\n    $output.innerHTML = \"this.i=\" + this.i + \" | State.i=\" + State.i;\n  }\n};\nState.increment();\n$btn.addEventListener('click', State.increment);\n\ndocument.body.appendChild($btn);\n",
        "html": "<html>\n  <head></head>\n  <body>\n    <h1 class=\"increment-output\"></h1>\n    <button class=\"btn btn-default increment-btn\">\n      Increment\n    </button>\n  </body>\n</html>\n"
      },
      "notes": "// Now ask if someone understands what happened:)\n\n// Propose to\nconsole.log(this) \n// to check in which context are we\n\n// refactor this to sth like\nvar incr = State.increment;\n$btn.addEventListener('click', incr);\n\n// to make it clear that we have lost context of execution\n\n// Ask for possible fixes:\n//  1. Wrapping in anonymous function\n//  2. Use `bind` function\n"
    },
    {
      "id": "contexts5",
      "name": "Contexts",
      "title": "Invoking function in specific context",
      "microtasks": [
        {
          "description": "Invoke <code>increment</code> function in context of <code>result</code> with argument <code>\"test\"</code>",
          "hint": "<code>increment.call(ctx, arg)</code> where <code>ctx === result</code> and <code>arg === \"test\"</code>",
          "js": "increment\\.call\\(result\\s*,\\s*['\"]test['\"]\\)\n"
        },
        {
          "description": "Fix context of <code>increment</code> to itself.",
          "hint": "<code>increment.bind(increment)</code>",
          "js": "increment\\.bind\\(increment\\)\n"
        }
      ],
      "monitor": "result",
      "code": {
        "big": true,
        "content": "var result = [];\nvar State1 = {\n  name: 'State 1'\n};\nvar State2 = {\n  name: 'State 2'\n};\nvar increment = function(arg1) {\n  result.push(\"Invoking in context of \" + this.name + \" with argument \" + arg1);\n};\n\nincrement.call(State1, \"arg1\");\n\nincrement.apply(State2, [\"arg2\"]);\n\nvar fixedContext = increment.bind(State1);\nfixedContext(\"arg1\");\n\nfixedContext.call(State2, \"arg2\");\n"
      },
      "notes": "1. Describe differences between `call` and `apply`\n2. Make sure that everyone notices that after binding context .call (and .apply) doesn't matter\n"
    },
    {
      "id": "contexts6",
      "name": "Contexts",
      "title": "Other applications of <code>bind</code>",
      "microtasks": [
        {
          "description": "Create adder of 6 and name it <code>add6</code>",
          "hint": "use <code>add.bind(\"add6\", 6)</code>",
          "js_assert": "add6(5) === 11\n"
        },
        {
          "description": "Create function that always returns result of <code>3+2</code> and call it <code>five</code>",
          "hint": "You can bind both arguments like <code>add.bind(\"five\", 3, 3)</code>",
          "js_assert": "five() === 5\n"
        }
      ],
      "monitor": "result",
      "code": {
        "big": true,
        "content": "var result = [];\nvar add = function(a, b) {\n  var sum = a + b;\n  result.push(\n    a + \" + \" + b + \" = \" + sum + \" in context of: \" + this\n  );\n\n  return sum;\n};\n\nadd(3, 4);\n\nvar add3 = add.bind(\"add3\", 3);\nadd3(4);\n"
      },
      "notes": "Point out that everything can be used as context (even other function)\n\nExplain that using `bind` we can create partially applied functions.\n"
    },
    {
      "id": "context7",
      "name": "Contexts",
      "title": "Contexts and functional-style",
      "microtasks": [
        {
          "description": "Refactor the code to use <code>forEach</code>",
          "hint": "Invoke <code>todos.forEach</code>",
          "js": "todos\\.forEach\\(\n"
        }
      ],
      "monitor": "TodosView._results",
      "code": {
        "big": true,
        "content": "var TodosView = {\n  _results: [],\n  renderAllTodos: function(todos) {\n\n    for (var k in todos) {\n      this.renderTodo(todos[k]);\n    }\n\n  },\n  renderTodo: function(todo) {\n    this._results.push(\"Rendering todo \" + todo);\n  }\n};\n\nTodosView.renderAllTodos([\"Todo 1\", \"Todo 2\"]);\n"
      },
      "notes": "// 1. Propose to jointly refactor for-in loop to functional style.\n// 2. Show how easy it is to break context.\n\n// Try two solutions:\nrenderAllTodos: function(todos) {\n  todos.forEach(function(todo) {\n    this.renderTodo(todo);\n  }, this);\n},\n// 2\nrenderAllTodos: function(todos) {\n  todos.map(this.renderTodo.bind(this));\n}\n\n// And show that we break two different contexts.\n"
    },
    {
      "id": "task-contexts",
      "name": "Task 2",
      "title": "Task: Event Bus",
      "text": "<h2>\n<span class=\"text-success\"><span class=\"glyphicon glyphicon-download\"></span></span>\n<a href=\"http://todr.me/wp-content/uploads/2014/04/eventBus.zip\">EventBus tests</a>\n</h2>\n",
      "code": {
        "hideOutput": true,
        "big": true,
        "content": "var EventBus = {\n  listenTo: function(eventName, func, context) {\n    // throw Error(\"TODO\");\n  },\n  trigger: function(eventName /* arguments */) {\n    // throw Error(\"TODO\");\n  }\n};\nvar State = {\n  i: 0,\n  increment: function() { this.i++; }\n};\nEventBus.listenTo(\n      'increment', State.increment, State);\n\nEventBus.trigger('increment');\n// This should result in \"1\"\nconsole.log(State.i);\n"
      },
      "task": {
        "duration": 30,
        "objectives": [
          "In file <code>public/javascripts/eventBus.js</code> implement <code>EventBus</code> object that will trigger all listeners for specific <code>eventName</code> in proper context"
        ],
        "extras": [
          "Pass additional arguments from <code>trigger</code> method to listeners.",
          "Use <code>EventBus</code> in your application to notify View from Model."
        ],
        "solution": {
          "name": "Event Bus - solution",
          "title": "Event Bus",
          "monitor": "State",
          "code": "var EventBus = {\n  _listeners : {},\n  listenTo: function(eventName, func, context) {\n    var listeners = this._listeners[eventName];\n    if (!listeners) {\n      this._listeners[eventName] = listeners = [];\n    }\n\n    listeners.push({\n      func: func,\n      ctx: context\n    });\n  },\n  trigger: function(eventName /* arguments */) {\n    var listeners = this._listeners[eventName] || [];\n\n    //var args = arguments.slice(1);\n    var args = [].slice.call(arguments, 1);\n\n    listeners.forEach(function(listener) {\n      listener.func.apply(listener.ctx, args);\n    });\n  }\n};\nvar State = {\n  i: 0,\n  increment: function(amount) {\n    this.i += amount;\n  }\n};\n\nEventBus.listenTo('increment', State.increment, State);\n\nEventBus.trigger('increment', 5);\n// This should result in \"5\"\nconsole.log(State.i);\n"
        }
      }
    },
    {
      "id": "angular",
      "name": "Angular.js",
      "title": "Angular.js - Introduction",
      "text": "<h3 class=\"text-muted\">\n  <span class=\"glyphicon glyphicon-new-window\"></span>\n  <a href=\"http://angularjs.org\">\n    Angular.js\n  </a>\n  Superheroic JavaScript MVW Framework\n</h3>\n<br>\n<h2>\n  <span class=\"glyphicon glyphicon-book text-muted\"></span>\n  <a href=\"http://docs.angularjs.org/\">\n    Angular.js docs\n  </a>\n</h2>\n<h2>\n  <span class=\"glyphicon glyphicon-book text-muted\"></span>\n  <a href=\"http://docs.angularjs.org/tutorial/\">\n    Angular.js tutorial\n  </a>\n</h2>\n"
    },
    {
      "id": "angular1",
      "name": "Angular.js",
      "title": "Angular.js - Fist app",
      "fiddle": {
        "big": true,
        "html": "<!doctype html>\n<html lang=\"en\" ng-app>\n<!-- ng-app is custom property from Angular that tells it to start -->\n<head>\n  <meta charset=\"utf-8\">\n  <title>Hello Angular!</title>\n  <script src=\"http://ajax.googleapis.com/ajax/libs/angularjs/1.2.8/angular.min.js\"></script>\n</head>\n<body>\n  <!-- We can use {{ }} to invoke expressions with JS syntax -->\n  <p>Nothing here {{'yet' + '!'}}</p>\n \n</body>\n</html>\n"
      }
    },
    {
      "id": "angular-ctrl",
      "name": "Angular.js",
      "title": "Angular.js - Controller",
      "text": "<h2><code>Controllers</code> are a place in angular where your logic goes.</h2>\n<h2><code>$scope</code> is your data model - it's just pure JavaScript!</h2>\n<br>\n<h2>\n  <span class=\"glyphicon glyphicon-ok\"></span>\n  <span class=\"text-success\">\n  Angular is automatically binding value of your variable with DOM!\n  </span>\n</h2>\n",
      "fiddle": {
        "js": "window.MyFirstController = function($scope) {\n  //unfortunatelly we can't use localStorage because of how auto-execution is working\n  $scope.name = \"Tomasz\"; \n};\n",
        "html": "<!doctype html>\n<html lang=\"en\" ng-app>\n<!-- ng-app is custom property from Angular that tells it to start -->\n<head>\n  <meta charset=\"utf-8\">\n  <title>Hello Angular!</title>\n  <script src=\"http://ajax.googleapis.com/ajax/libs/angularjs/1.2.8/angular.min.js\"></script>\n</head>\n<!-- We specified that \"body\" tag and it's content is handled by MyFirstController -->\n<body ng-controller=\"MyFirstController\">\n  <!-- We can use {{ }} to print variable assigned to scope -->\n  <p>Hello {{ name }}</p>\n</body>\n</html>\n"
      }
    },
    {
      "id": "angular-ctrltest",
      "name": "Angular.js",
      "title": "Angular.js - Controller test",
      "text": "<h2>Angular is very testable. We can easily write a test in Jasmine for what we have.</h2>\n<h4>You can write your tests in <code>test/js/*Spec.js</code> files.</h4>\n",
      "code": {
        "language": "javascript-norun",
        "content": "describe('Todos app', function() {\n \n  describe('MyFirstController', function(){\n \n    it('should assign name to scope', function() {\n      var scope = {};\n      MyFirstController(scope);\n \n      expect(scope.name).toEqual(\"Tomasz\");\n    });\n\n  });\n});\n"
      }
    },
    {
      "id": "angular-ngrepeat",
      "name": "Angular.js",
      "title": "Angular.js - Looping",
      "text": "<h2>To iterate over array in Angular.js you can use <code>ng-repeat</code></h2>\n<h3>The element with attribute <code>ng-repeat</code> will be inserted multiple times</h3>\n",
      "fiddle": {
        "big": true,
        "active": "html",
        "js": "window.MyFirstController = function($scope) {\n  $scope.name = \"Tomasz\";\n};\n",
        "html": "<!doctype html>\n<html lang=\"en\" ng-app>\n<!-- ng-app is custom property from Angular that tells it to start -->\n<head>\n  <meta charset=\"utf-8\">\n  <title>Hello Angular!</title>\n  <script src=\"http://ajax.googleapis.com/ajax/libs/angularjs/1.2.8/angular.min.js\"></script>\n</head>\n<!-- We specified that \"body\" tag and it's content is handled by MyFirstController -->\n<body ng-controller=\"MyFirstController\">\n  <h1>Hello</h1>\n  <h2 ng-repeat=\"char in name\" class=\"text-warning\">\n    {{ char }}\n  </h2>\n</body>\n</html>\n"
      }
    },
    {
      "id": "task-display-workspace",
      "name": "Task 2",
      "title": "Task 2: Workspace",
      "text": "<h3><span class=\"text-success\">Objective: </span> Display todos using <code>.list-group</code> component</h3>\n",
      "fiddle": {
        "big": true,
        "active": "js",
        "html": "<!DOCTYPE html>\n<html lang=\"en\" ng-app>\n  <head>\n    <meta charset=\"utf8\">\n    <title>Slider</title>\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <link href=\"http://netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css\" rel=\"stylesheet\">\n    <script src=\"http://ajax.googleapis.com/ajax/libs/angularjs/1.2.8/angular.min.js\"></script>\n  </head>\n  <body>\n    <h1>My Todos</h1>\n    <ul class=\"todos\"></ul>\n  </body>\n</html>\n",
        "css": ".todos {\n    font-size: 1.5em;\n}\n",
        "js": "window.TodosController = function($scope) {\n\n};\n"
      }
    },
    {
      "id": "task-display",
      "name": "Task 2",
      "title": "Task: Display todos using angular",
      "code": {
        "small": true,
        "hideOutput": true,
        "content": "var todos = [\n  \"Checkout project from github\",\n  \"Invoke 'play run' in your console\",\n  \"Open your browser and head over to http://localhost:9000\",\n  \"Learn Angular\"\n];\n"
      },
      "task": {
        "duration": 45,
        "objectives": [
          "Display todos using <code>.list-group</code> component"
        ],
        "extras": [
          "Create your own workspace",
          "Write test for scope",
          "Introduce <code>Karma</code> and write E2E test."
        ],
        "solution": {
          "fiddle": {
            "js": "window.MyFirstController = function($scope) {\n  $scope.todos = [\n    \"Checkout project from github\",\n    \"Invoke 'play run' in your console\",\n    \"Open your browser and head over to http://localhost:9000\",\n    \"Learn Angular\"\n  ];\n};\n",
            "html": "<!doctype html>\n<html lang=\"en\" ng-app>\n<head>\n  <meta charset=\"utf-8\">\n  <title>Hello Angular!</title>\n  <script src=\"http://ajax.googleapis.com/ajax/libs/angularjs/1.2.8/angular.min.js\"></script>\n</head>\n<body ng-controller=\"MyFirstController\">\n  <h1>Hello</h1>\n  <div class=\"list-group\">\n    <a ng-repeat=\"todo in todos\" class=\"list-group-item\">\n      {{ todo }}\n    </a>\n  </div>\n</body>\n</html>\n"
          }
        }
      }
    },
    {
      "id": "angular-dom",
      "name": "ng DOM",
      "title": "DOM binding",
      "text": "<h2>Using <code>ng-click</code> allows you to invoke function that is exposed in <code>$scope</code></h2>\n",
      "fiddle": {
        "big": true,
        "js": "window.MyFirstController = function($scope) {\n  $scope.name = \"Tomasz\";\n\n  var showAlert = function() {\n    alert('Me not called :(');\n  };\n\n  $scope.showAlert = function() {\n    alert($scope.name);\n  };\n};\n",
        "html": "<!doctype html>\n<html lang=\"en\" ng-app>\n<!-- ng-app is custom property from Angular that tells it to start -->\n<head>\n  <meta charset=\"utf-8\">\n  <title>Hello Angular!</title>\n  <script src=\"http://ajax.googleapis.com/ajax/libs/angularjs/1.2.8/angular.min.js\"></script>\n</head>\n<!-- We specified that \"body\" tag and it's content is handled by MyFirstController -->\n<body ng-controller=\"MyFirstController\">\n  <!-- We can use {{ }} to print variable assigned to scope -->\n  <p>Hello {{ name }}</p>\n  <!-- ng-click is a directive that allows you to specify action that will happen when you click a button -->\n  <button class=\"btn btn-default\" ng-click=\"showAlert()\">Alert me!</button>\n</body>\n</html>\n"
      }
    },
    {
      "id": "angular-domawesome",
      "name": "ng DOM",
      "title": "DOM binding awesomeness!",
      "text": "<h2>\n  <span class=\"glyphicon glyphicon-ok\"></span>\n  <span class=\"text-success\">\n  Angular.js has two-ways binding with DOM!\n  </span>\n</h2>\n<h2>Imagine doing that in <code>Backbone</code>!</h2>\n",
      "fiddle": {
        "big": true,
        "js": "window.MyFirstController = function($scope) {\n  $scope.name = \"Tomasz\";\n\n  $scope.showAlert = function() {\n    alert($scope.name);\n  };\n};\n",
        "html": "<!doctype html>\n<html lang=\"en\" ng-app>\n<head>\n  <meta charset=\"utf-8\">\n  <title>Hello Angular!</title>\n  <script src=\"http://ajax.googleapis.com/ajax/libs/angularjs/1.2.8/angular.min.js\"></script>\n</head>\n<body ng-controller=\"MyFirstController\">\n  <!-- We can use {{ }} to print variable assigned to scope -->\n  <p>Hello {{ name }}</p>\n\n  <div class=\"form-group\">\n    <!-- We can bind input box with variables inside your model! Awesome! -->\n    <input type=\"text\" class=\"form-control\" ng-model=\"name\" placeholder=\"Enter your name\">\n\n    <!-- ng-click is a directive that allows you to specify action that will happen when you click a button -->\n    <button class=\"btn btn-default\" ng-click=\"showAlert()\">Alert me!</button>\n  </div>\n</body>\n</html>\n"
      }
    },
    {
      "id": "angular-module",
      "name": "ng Module",
      "title": "Code organization",
      "text": "<h2>\n  Instead of doing global variables for controllers we can organize the code into <code>modules</code>\n</h2>\n",
      "fiddle": {
        "big": true,
        "js": "var app = angular.module('todosApp', \n  [] /* other modules dependencies */);\napp.controller('TodosController', function($scope) {\n\n  $scope.todos = [\"Checkout project from github\",\n    \"Invoke 'play run' in your console\",\n    \"Open your browser and head over to http://localhost:9000\",\n    \"Learn Angular\"\n  ].join(\"\\n\");\n\n});\n",
        "html": "<!doctype html>\n<!-- We have to tell which module is an entry-point -->\n<html lang=\"en\" ng-app=\"todosApp\">\n<head>\n  <meta charset=\"utf-8\">\n  <title>Hello Angular!</title>\n  <script src=\"http://ajax.googleapis.com/ajax/libs/angularjs/1.2.8/angular.min.js\"></script>\n</head>\n<body ng-controller=\"TodosController\">\n  <div class=\"form-group\">\n    <textarea ng-model=\"todos\" rows=\"5\" cols=\"65\" class=\"form-control\">\n    </textarea>\n  </div>\n  <div>\n    <h3 ng-repeat=\"todo in todos.split('\\n')\">\n      <span class=\"glyphicon glyphicon-ok text-success\"></span>\n      {{ todo }}\n    </h3>\n  </div>\n</body>\n</html>\n"
      }
    },
    {
      "id": "angular-watch",
      "name": "ng Watching",
      "title": "Watching for changes",
      "text": "<h2>\n  <span class=\"glyphicon glyphicon-ok\"></span>\n  <span class=\"text-success\">You can use <code>$watch</code> to monitor changes of variable value.</span>\n</h2>\n",
      "fiddle": {
        "big": true,
        "js": "var app = angular.module('someApp', []);\napp.controller('MyFirstController', function($scope) {\n  $scope.isToUpper = false;\n  $scope.name = \"Tomasz\";\n\n  $scope.$watch('isToUpper', function() {\n    if ($scope.isToUpper) {\n      $scope.name = $scope.name.toUpperCase();\n    } else {\n      $scope.name = $scope.name.toLowerCase();\n    }\n  });\n});\n",
        "html": "<!doctype html>\n<html lang=\"en\" ng-app=\"someApp\">\n<head>\n  <meta charset=\"utf-8\">\n  <title>Hello Angular!</title>\n  <script src=\"http://ajax.googleapis.com/ajax/libs/angularjs/1.2.8/angular.min.js\"></script>\n</head>\n<body ng-controller=\"MyFirstController\">\n  <!-- We can use {{ }} to print variable assigned to scope -->\n  <p>Hello {{ name }}</p>\n\n  <div class=\"form-group\">\n    <!-- We can bind input box with variables inside your model! Awesome! -->\n    <input type=\"text\" class=\"form-control\" ng-model=\"name\" placeholder=\"Enter your name\">\n    <br />\n    <!-- We just use ng-model:) -->\n    <label class=\"checkbox\">\n      <input type=\"checkbox\" ng-model=\"isToUpper\">\n      Show in uppercase\n    </label>\n  </div>\n</body>\n</html>\n"
      }
    },
    {
      "id": "task-state-workspace",
      "name": "Task 3 & 4",
      "title": "Task 3/4: Workspace",
      "text": "<h3><span class=\"text-success\">Objective: </span> Display todos completed state with checkbox</h3>\n",
      "fiddle": {
        "big": true,
        "active": "js",
        "html": "<!DOCTYPE html>\n<html lang=\"en\" ng-app>\n  <head>\n    <meta charset=\"utf8\">\n    <title>Slider</title>\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <link href=\"http://netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css\" rel=\"stylesheet\">\n    <script src=\"http://ajax.googleapis.com/ajax/libs/angularjs/1.2.8/angular.min.js\"></script>\n  </head>\n  <body ng-controller=\"TodosController\">\n    <h1>My Todos</h1>\n    <ul class=\"todos\"></ul>\n  </body>\n</html>\n",
        "css": ".todos {\n    font-size: 1.5em;\n}\n",
        "js": "var app = angular.module(\"todosApp\", []);\napp.controller('TodosController',  function($scope) {\n  $scope.todos = [\n    {\n      title: \"Checkout project from github\",\n      completed: true\n    }, {\n      title: \"Invoke 'play run' in your console\",\n      completed: true\n    }, {\n      title: \"Open your browser and head over to http://localhost:9000\",\n      completed: false\n    }, {\n      title: \"Learn Angular\",\n      completed: false\n    }\n  ];\n});\n"
      }
    },
    {
      "id": "task-state",
      "name": "Task 3 & 4",
      "title": "Task: Displaying todos state",
      "task": {
        "duration": 40,
        "objectives": [
          "Display todos completed state with checkbox",
          "Clicking on todo should change checkbox state"
        ],
        "extras": [
          "Keyboard support via Tab, Shift+Tab and Space",
          "E2E test"
        ],
        "solution": {
          "fiddle": {
            "big": true,
            "js": "var app = angular.module(\"todosApp\", []);\napp.controller('TodosController',  function($scope) {\n  $scope.todos = [\n    {\n      title: \"Checkout project from github\",\n      completed: true\n    }, {\n      title: \"Invoke 'play run' in your console\",\n      completed: true\n    }, {\n      title: \"Open your browser and head over to http://localhost:9000\",\n      completed: false\n    }, {\n      title: \"Learn Angular\",\n      completed: false\n    }\n  ];\n});\n",
            "html": "<!doctype html>\n<html lang=\"en\" ng-app=\"todosApp\">\n<head>\n  <meta charset=\"utf-8\">\n  <title>Hello Angular!</title>\n  <script src=\"http://ajax.googleapis.com/ajax/libs/angularjs/1.2.8/angular.min.js\"></script>\n</head>\n<body ng-controller=\"TodosController\">\n  <div class=\"list-group\">\n    <label ng-repeat=\"todo in todos\" class=\"list-group-item\">\n      <div class=\"checkbox\">\n        <input type=\"checkbox\" ng-model=\"todo.completed\" />\n        {{ todo.title }}\n      </div>\n    </label>\n  </div>\n</body>\n</html>\n"
          }
        }
      }
    },
    {
      "id": "angular-ngshow",
      "name": "ng Visibility",
      "title": "Angular.js - Controlling Visibility",
      "text": "<h2>\n  <span class=\"glyphicon glyphicon-ok\"></span>\n  <span class=\"text-success\">\n    By using <code>ng-show</code> and <code>ng-hide</code> you can controll which elements are displayed.\n  </span>\n</h2>\n",
      "fiddle": {
        "big": true,
        "active": "html",
        "js": "var app = angular.module('someApp', []);\napp.controller('MyFirstController', function($scope) {\n  $scope.isToUpper = false;\n  $scope.name = \"Tomasz\";\n\n  $scope.$watch('isToUpper', function() {\n    if ($scope.isToUpper) {\n      $scope.name = $scope.name.toUpperCase();\n    } else {\n      $scope.name = $scope.name.toLowerCase();\n    }\n  });\n});\n",
        "html": "<!doctype html>\n<html lang=\"en\" ng-app=\"someApp\">\n<head>\n  <meta charset=\"utf-8\">\n  <title>Hello Angular!</title>\n  <script src=\"http://ajax.googleapis.com/ajax/libs/angularjs/1.2.8/angular.min.js\"></script>\n</head>\n<body ng-controller=\"MyFirstController\">\n  <p>\n    Hello {{ name }}\n    <span ng-show=\"isToUpper\">in UPPER case</span>\n    <span ng-hide=\"isToUpper\">in lower case</span>\n  </p>\n\n  <div class=\"form-group\">\n    <input type=\"text\" class=\"form-control\" ng-model=\"name\" placeholder=\"Enter your name\">\n    <br />\n    <label class=\"checkbox\">\n      <input type=\"checkbox\" ng-model=\"isToUpper\">\n      Show in uppercase\n    </label>\n  </div>\n</body>\n</html>\n"
      }
    },
    {
      "id": "angular-ngif",
      "name": "ng Visibility",
      "title": "Angular.js - Switching elements",
      "text": "<h2>\n  <span class=\"glyphicon glyphicon-ok\"></span>\n  <span class=\"text-success\">\n    Using <code>ng-if</code> controlls which elements are actually in DOM.\n  </span>\n</h2>\n<h3>\n  <span class=\"text-warning\">Tip:</span>\n  Using <code>ng-show</code> and <code>ng-hide</code> results in better user experience faster GUI\n</h3>\n<h3>\n  <span class=\"text-danger\">Tip:</span>\n  Unless you have too much elements in DOM - in this case using <code>ng-if</code> could result in better overall performance of your website.\n</h3>\n",
      "fiddle": {
        "big": true,
        "active": "html",
        "js": "var app = angular.module('someApp', []);\napp.controller('MyFirstController', function($scope) {\n  $scope.isToUpper = false;\n  $scope.name = \"Tomasz\";\n\n  $scope.$watch('isToUpper', function() {\n    if ($scope.isToUpper) {\n      $scope.name = $scope.name.toUpperCase();\n    } else {\n      $scope.name = $scope.name.toLowerCase();\n    }\n  });\n});\n",
        "html": "<!doctype html>\n<html lang=\"en\" ng-app=\"someApp\">\n<head>\n  <meta charset=\"utf-8\">\n  <title>Hello Angular!</title>\n  <script src=\"http://ajax.googleapis.com/ajax/libs/angularjs/1.2.8/angular.min.js\"></script>\n</head>\n<body ng-controller=\"MyFirstController\">\n  <p>\n    Hello {{ name }}\n    <span ng-if=\"isToUpper\">in UPPER case</span>\n    <span ng-if=\"!isToUpper\">in lower case</span>\n  </p>\n\n  <div class=\"form-group\">\n    <input type=\"text\" class=\"form-control\" ng-model=\"name\" placeholder=\"Enter your name\">\n    <br />\n    <label class=\"checkbox\">\n      <input type=\"checkbox\" ng-model=\"isToUpper\">\n      Show in uppercase\n    </label>\n  </div>\n</body>\n</html>\n"
      }
    },
    {
      "id": "angular-ngswitch",
      "name": "ng Visibility",
      "title": "Angular.js - Switching elements via <code>ng-switch</code>",
      "text": "<h2>\n  <span class=\"glyphicon glyphicon-ok\"></span>\n  <span class=\"text-success\">\n    <code>ng-switch</code> is like replacing bunch of if-else statements with switch-case.\n  </span>\n</h2>\n",
      "fiddle": {
        "big": true,
        "active": "html",
        "js": "var app = angular.module('someApp', []);\napp.controller('MyFirstController', function($scope) {\n  $scope.isToUpper = null;\n  $scope.name = \"Tomasz\";\n\n  $scope.$watch('isToUpper', function() {\n    if ($scope.isToUpper) {\n      $scope.name = $scope.name.toUpperCase();\n    } else {\n      $scope.name = $scope.name.toLowerCase();\n    }\n  });\n});\n",
        "html": "<!doctype html>\n<html lang=\"en\" ng-app=\"someApp\">\n<head>\n  <meta charset=\"utf-8\">\n  <title>Hello Angular!</title>\n  <script src=\"http://ajax.googleapis.com/ajax/libs/angularjs/1.2.8/angular.min.js\"></script>\n</head>\n<body ng-controller=\"MyFirstController\">\n  <p>\n    Hello {{ name }}\n    <span ng-switch=\"isToUpper\">\n      <span ng-switch-when=\"true\">in UPPER case</span>\n      <span ng-switch-when=\"false\">in lower case</span>\n      <span ng-switch-default>when undefined</span>\n    </span>\n  </p>\n\n  <div class=\"form-group\">\n    <input type=\"text\" class=\"form-control\" ng-model=\"name\" placeholder=\"Enter your name\">\n    <br />\n    <label class=\"checkbox\">\n      <input type=\"checkbox\" ng-model=\"isToUpper\">\n      Show in uppercase\n    </label>\n  </div>\n</body>\n</html>\n"
      }
    },
    {
      "id": "task-add",
      "name": "Task 5",
      "title": "Task: Adding new todos",
      "task": {
        "duration": 30,
        "objectives": [
          "Adding new todos using form with button"
        ],
        "extras": [
          "Keyboard support - hitting Enter in input box should add todo",
          "Editing todos in-place - Clicking edit icon should change todo to input (<code>ng-show</code>)"
        ],
        "solution": {
          "fiddle": {
            "big": true,
            "js": "var app = angular.module(\"todosApp\", []);\napp.controller('TodosController',  function($scope) {\n  //it could be done in ng-init\n  $scope.editing = {};\n\n  $scope.todos = [\n    {\n      title: \"Invoke 'play run' in your console\",\n      completed: true\n    }, {\n      title: \"Learn Angular\",\n      completed: false\n    }\n  ];\n  $scope.newTodoTitle = \"Buy beer\";\n  $scope.addTodo = function() {\n    var title = $scope.newTodoTitle;\n    if (!title) return;\n\n    $scope.todos.push({\n      title: title,\n      completed: false\n    });\n    $scope.newTodoTitle = \"\";\n  };\n});\n",
            "html": "<!doctype html>\n<html lang=\"en\" ng-app=\"todosApp\">\n<head>\n  <meta charset=\"utf-8\">\n  <title>Hello Angular!</title>\n  <script src=\"http://ajax.googleapis.com/ajax/libs/angularjs/1.2.8/angular.min.js\"></script>\n</head>\n<body ng-controller=\"TodosController\">\n  <div class=\"list-group\">\n    <div ng-repeat=\"todo in todos\" class=\"list-group-item\">\n      <input type=\"text\" class=\"form-control\" \n        ng-model=\"todo.title\" ng-show=\"editing[$index]\" ng-blur=\"editing[$index] = false\" />\n      <label class=\"checkbox\" ng-hide=\"editing[$index]\">\n        <a href=\"\" class=\"pull-right text-muted\" ng-click=\"editing[$index] = !editing[$index]\">\n          <span class=\"glyphicon glyphicon-pencil\"></span>\n        </a>\n        <input type=\"checkbox\" ng-model=\"todo.completed\" />\n        {{ todo.title }}\n      </label>\n    </div>\n  </div>\n  <form ng-submit=\"addTodo()\">\n    <input type=\"text\" ng-model=\"newTodoTitle\" placeholder=\"Buy beer\" class=\"form-control\"/>\n    <button class=\"btn btn-default\">\n      <span class=\"glyphicon glyphicon-plus\"></span>\n      Add todo\n    </button>\n  </form>\n</body>\n</html>\n"
          }
        }
      }
    },
    {
      "id": "angular-expressions",
      "name": "ng Expressions",
      "title": "Angular.js - Expressions",
      "text": "<h2>\n  <span class=\"glyphicon glyphicon-ok\"></span>\n  <span class=\"text-success\">\n    Angular\n    <a href=\"http://docs.angularjs.org/guide/expression\">\n    Expressions\n    </a> <span class=\"glyphicon glyphicon-book text-muted\"></span>\n    are very similar to JS expressions.\n  </span>\n</h2>\n<h3>\n  You can reference variables, invoke functions and perform some operations.\n</h3>\n",
      "fiddle": {
        "js": "angular.module(\"todosApp\", [])\n  .controller(\"TodosController\", function($scope) {\n\n  $scope.world = 'Tomasz';\n\n  //Click on checkbox and note\n  // that undefined is not displayed\n  $scope.isUpper = undefined;\n\n  $scope.isUpperLabel = function() {\n    if ($scope.isUpper) {\n      return 'isUPPER';\n    }\n    return 'isLower';\n  };\n});\n",
        "html": "<!doctype html>\n<html lang=\"en\" ng-app=\"todosApp\">\n<head>\n  <meta charset=\"utf-8\">\n  <title>Hello Angular!</title>\n  <script src=\"http://ajax.googleapis.com/ajax/libs/angularjs/1.2.8/angular.min.js\"></script>\n</head>\n<body ng-controller=\"TodosController\">\n  <h2>{{ \"Hello \" + world }}</h2>\n  <h2 class=\"text-success\">3 + 4 = {{ 3 + 4 }}</h2>\n  <h2>isUpper: {{ isUpper }}</h2>\n  <h3>\n    <label class=\"checkbox\">\n      <input type=\"checkbox\" ng-model=\"isUpper\" />\n      {{ isUpperLabel() }}\n      {{ iAmUndefinedYetNoError() }}\n    </label>\n  </h3>\n</body>\n</html>\n"
      }
    },
    {
      "id": "angular-filters",
      "name": "ng Filters",
      "title": "Angular.js - Filters",
      "text": "<h2>\n  <span class=\"glyphicon glyphicon-ok\"></span>\n  <span class=\"text-success\">\n    In expressions you can use \n    <a href=\"http://docs.angularjs.org/guide/filter\">\n    Filters \n    </a> <span class=\"glyphicon glyphicon-book text-muted\"></span>\n    by using pipe operator <code>|</code>\n  </span>\n</h2>\n",
      "fiddle": {
        "big": true,
        "js": "angular.module(\"todosApp\", [])\n  .controller(\"TodosController\", function($scope) {\n\n  $scope.world = 'Tomasz';\n\n  //Click on checkbox and note\n  // that undefined is not displayed\n  $scope.isUpper = undefined;\n\n  $scope.isUpperLabel = function() {\n    if ($scope.isUpper) {\n      return {\n        text: 'isUPPER'\n      };\n    }\n    return 'isLower';\n  };\n});\n",
        "html": "<!doctype html>\n<html lang=\"en\" ng-app=\"todosApp\">\n<head>\n  <meta charset=\"utf-8\">\n  <title>Hello Angular!</title>\n  <script src=\"http://ajax.googleapis.com/ajax/libs/angularjs/1.2.8/angular.min.js\"></script>\n</head>\n<body ng-controller=\"TodosController\">\n  <h2>{{ \"Hello \" + world | uppercase }}</h2>\n  <h2 class=\"text-success\">3 + 4 = {{ 3 + 4 | currency }}</h2>\n  <h2>isUpper: {{ isUpper | number }}</h2>\n  <h3>\n    <label class=\"checkbox\">\n      <input type=\"checkbox\" ng-model=\"isUpper\" />\n      {{ isUpperLabel() | json }}\n      {{ iAmUndefinedYetNoError() }}\n    </label>\n  </h3>\n</body>\n</html>\n"
      }
    },
    {
      "id": "angular-filters-filter",
      "name": "ng Filters",
      "title": "Angular.js - \"filter\" Filter :)",
      "text": "<h2>\n  <span class=\"glyphicon glyphicon-ok\"></span>\n  <span class=\"text-success\">\n    Angular.js gives you very usefull <code>Filter</code> for arrays called \n    <a href=\"http://docs.angularjs.org/api/ng.filter:filter\">filter</a>\n    <span class=\"glyphicon glyphicon-book text-muted\"></span>\n  </span>\n</h2>\n<h4>\n  <span class=\"text-warning\">Tip:</span>\n  You can write your own filters\n</h4>\n",
      "fiddle": {
        "big": true,
        "active": "html",
        "js": "angular.module(\"todosApp\", [])\n  .controller(\"TodosController\", function($scope) {\n\n  $scope.something = [{\n    a: 5,\n    text: \"has matching\",\n    m: true\n  },{\n    b: 3,\n    text: \"no matching\",\n    m: false\n  }];\n\n  $scope.matchesFunc = function(e) {\n    return e.m;\n  };\n}).filter(\"getPropFromFirst\", function(){\n  return function(input, property) {\n    return input[0][property];\n  }\n});\n",
        "html": "<!doctype html>\n<html lang=\"en\" ng-app=\"todosApp\">\n<head>\n  <meta charset=\"utf-8\">\n  <title>Hello Angular!</title>\n  <script src=\"http://ajax.googleapis.com/ajax/libs/angularjs/1.2.8/angular.min.js\"></script>\n</head>\n<body ng-controller=\"TodosController\">\n  <h2>Filter by property</h2>\n  <h4 class=\"text-muted\">\n    {{ something | filter:{b:3} }}\n  </h4>\n  <h2>Filter by any text</h2>\n  <h4 class=\"text-muted\">\n    {{ something | filter:\"has\" }}\n  </h4>\n  <h2>Filter by function</h2>\n  <h4 class=\"text-muted\">\n    {{ something | filter:matchesFunc }}\n  </h4>\n  <h2>Custom filter</h2>\n  <h4 class=\"text-muted\">\n    {{ something | getPropFromFirst:\"text\" }}\n  </h4>\n</body>\n</html>\n"
      }
    },
    {
      "id": "angular-injector",
      "name": "ng Injector",
      "title": "Angular.js - Where does <code>$scope</code> come from?",
      "text": "<h2>\n  <span class=\"glyphicon glyphicon-ok\"></span>\n  <span class=\"text-success\">\n    Angular is using Dependency Injection pattern\n  </span>\n</h2>\n<h3>\n  By parsing <code>toString</code> representation of function of your controller angular.js can determine what dependencies are you using.\n</h3>\n<h4>\n  <span class=\"text-danger\">Tip:</span>\n  You can use more explicit injection to support minification and custom names of dependencies\n</h4>\n",
      "fiddle": {
        "big": true,
        "js": "angular.module(\"todosApp\", [])\n  .controller(\"TodosController\", \n  // You can use [] syntax or just set $inject property on function\n    [\"$scope\", \"filterFilter\", \"$http\", function($scope, filter, $http) {\n  $scope.something = [{\n    a: 5,\n    text: \"has matching\",\n    m: true\n  },{\n    b: 3,\n    text: \"no matching\",\n    m: false\n  }];\n  $scope.filtered = filter($scope.something, {\n    a: 5\n  });\n  $http.jsonp('https://api.github.com?callback=JSON_CALLBACK').then(function(data){\n    $scope.text = data.data.data.current_user_url;\n  });\n}]);\n",
        "html": "<!doctype html>\n<html lang=\"en\" ng-app=\"todosApp\">\n<head>\n  <meta charset=\"utf-8\">\n  <title>Hello Angular!</title>\n  <script src=\"http://ajax.googleapis.com/ajax/libs/angularjs/1.2.8/angular.min.js\"></script>\n</head>\n<body ng-controller=\"TodosController\">\n  <h2>Filtered in Ctrl</h2>\n  <h4 class=\"text-muted\">\n    {{ filtered }}\n  </h4>\n  <h2>Text</h2>\n  <h4 class=\"text-muted\">\n    <a ng-href=\"text\">{{ text }}</a>\n  </h4>\n</body>\n</html>\n"
      }
    },
    {
      "id": "angular-services",
      "name": "ng Services",
      "title": "Angular.js - Services",
      "text": "<h2>\n  <span class=\"glyphicon glyphicon-ok\"></span>\n  <span class=\"text-success\">\n    Services are like injectable utility classes <span class=\"text-danger\"><span class=\"glyphicon glyphicon-asterisk\"></span></span>\n  </span>\n</h2>\n<h4>\n  In last example we have injected <code>$http</code> service that is similar to jQuery <code>$.ajax</code>\n</h4>\n<h4>\n  <span class=\"glyphicon glyphicon-ok\"></span>\n  <span class=\"text-success\">\n    It's easy to mock services in tests and reuse in different controllers\n  </span>\n</h4>\n",
      "fiddle": {
        "big": true,
        "js": "angular.module(\"todosApp\", [])\n  .controller(\"TodosController\", \n    [\"$scope\", \"filterFilter\", \"DataService\", function($scope, filter, Data) {\n  $scope.something = Data.getSomeData();\n  $scope.filtered = filter($scope.something, {\n    a: 5\n  });\n  Data.getGithubApi().then(function(data){\n    $scope.text = data.data.data.current_user_url;\n  });\n// We create factory of services using app.factory method\n}]).factory('DataService', [\"$http\", function($http) {\n  return {\n    getSomeData: function() {\n      return [{\n        a: 5,\n        text: \"has matching\",\n        m: true\n      },{\n        b: 3,\n        text: \"no matching\",\n        m: false\n      }];\n    },\n    getGithubApi: function() {\n      return $http.jsonp('https://api.github.com?callback=JSON_CALLBACK');\n    }\n  }\n}]);\n",
        "html": "<!doctype html>\n<html lang=\"en\" ng-app=\"todosApp\">\n<head>\n  <meta charset=\"utf-8\">\n  <title>Hello Angular!</title>\n  <script src=\"http://ajax.googleapis.com/ajax/libs/angularjs/1.2.8/angular.min.js\"></script>\n</head>\n<body ng-controller=\"TodosController\">\n  <h2>Filtered in Ctrl</h2>\n  <h4 class=\"text-muted\">\n    {{ filtered }}\n  </h4>\n  <h2>Text</h2>\n  <h4 class=\"text-muted\">\n    <a ng-href=\"text\">{{ text }}</a>\n  </h4>\n</body>\n</html>\n"
      }
    },
    {
      "id": "task-localstorage-workspace",
      "name": "Task 6",
      "title": "Task 6: Workspace",
      "text": "<h3><span class=\"text-success\">Objective: </span> Display todos completed state with checkbox</h3>\n",
      "fiddle": {
        "big": true,
        "active": "js",
        "html": "<!DOCTYPE html>\n<html lang=\"en\" ng-app>\n  <head>\n    <meta charset=\"utf8\">\n    <title>Slider</title>\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <link href=\"http://netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css\" rel=\"stylesheet\">\n    <script src=\"http://ajax.googleapis.com/ajax/libs/angularjs/1.2.8/angular.min.js\"></script>\n  </head>\n  <body ng-controller=\"TodosController\">\n    <h1>My Todos</h1>\n    <ul class=\"todos\">\n      <li ng-repeat=\"todo in todos\">\n          {{ todo.title }}\n      </li>\n    </ul>\n  </body>\n</html>\n",
        "css": ".todos {\n    font-size: 1.5em;\n}\n",
        "js": "var app = angular.module(\"todosApp\", []);\napp.controller('TodosController',  function($scope) {\n  $scope.todos = [\n    {\n      title: \"Checkout project from github\",\n      completed: true\n    }, {\n      title: \"Invoke 'play run' in your console\",\n      completed: true\n    }, {\n      title: \"Open your browser and head over to http://localhost:9000\",\n      completed: false\n    }, {\n      title: \"Learn Angular\",\n      completed: false\n    }\n  ];\n});\n"
      }
    },
    {
      "id": "task-localStorage",
      "name": "Task 6",
      "title": "Task: Persistence via LocalStorage",
      "task": {
        "duration": 30,
        "objectives": [
          "Use <code>localStorage</code> to add persistence to your application",
          "Create <code>Service</code> to hide complexity"
        ],
        "extras": [
          "Use <code>$window</code> service instead of using <code>localStorage</code>",
          "Use <code>$q</code> service to return promises from your service"
        ],
        "solution": {
          "fiddle": {
            "big": true,
            "js": "var app = angular.module(\"todosApp\", ['ui.bootstrap']);\napp.controller('TodosController',  ['$scope', 'Todos', function($scope, Todos) {\n  //it could be done in ng-init\n  $scope.editing = {};\n\n  Todos.getTodos().then(function(todos){\n    $scope.todos = todos;\n  });\n\n  $scope.newTodoTitle = \"Buy beer\";\n  $scope.hideCompleted = false;\n\n  $scope.addTodo = function() {\n    var title = $scope.newTodoTitle;\n    if (!title) return;\n\n    $scope.todos.push({\n      title: title,\n      completed: false\n    });\n    Todos.saveTodos($scope.todos).then(function(){\n      console.log(\"Todos saved\");\n    });\n    $scope.newTodoTitle = \"\";\n  };\n  $scope.getTodosFilter = function() {\n      var filter = {};\n      !$scope.hideCompleted || (filter['completed'] = false);\n      return filter;\n  };\n}]);\napp.factory('Todos', ['$q', '$window', '$timeout', function($q, $window, $timeout) {\n  /* It does not work because of runner in browser. It should work in your case.\n   * var localStorage = $window.localStorage;\n   */\n  var localStorage = {\n    setItem: function(){},\n    getItem: function(){}\n  };\n  return {\n    getTodos: function() {\n      var d = $q.defer();\n      //$timeout is only to show that it works;)\n      $timeout(function() {\n        var todos = localStorage.getItem('todos') || \"[]\";\n        d.resolve(angular.fromJson(todos));\n      }, 2000);\n      return d.promise;\n    },\n    saveTodos: function(todos) {\n      var d = $q.defer();\n      var todosStr = angular.toJson(todos);\n      localStorage.setItem('todos', todosStr);\n      d.resolve();\n      return d.promise;\n    }\n  };\n}]);\n",
            "html": "<!doctype html>\n<html lang=\"en\" ng-app=\"todosApp\">\n<head>\n  <meta charset=\"utf-8\">\n  <title>Hello Angular!</title>\n  <script src=\"http://ajax.googleapis.com/ajax/libs/angularjs/1.2.8/angular.min.js\"></script>\n  <script src=\"http://cdnjs.cloudflare.com/ajax/libs/angular-ui-bootstrap/0.9.0/ui-bootstrap-tpls.js\"></script>\n</head>\n<body ng-controller=\"TodosController\">\n  <div class=\"list-group\">\n    <div ng-repeat=\"todo in todos | filter:getTodosFilter()\" class=\"list-group-item\">\n      <input type=\"text\" class=\"form-control\" \n        ng-model=\"todo.title\" ng-show=\"editing[$index]\" ng-blur=\"editing[$index] = false\" />\n      <label class=\"checkbox\" ng-hide=\"editing[$index]\">\n        <a href=\"\" class=\"pull-right text-muted\" ng-click=\"editing[$index] = !editing[$index]\">\n          <span class=\"glyphicon glyphicon-pencil\"></span>\n        </a>\n        <input type=\"checkbox\" ng-model=\"todo.completed\" />\n        {{ todo.title }}\n      </label>\n    </div>\n  </div>\n  <div>\n    Completed: \n    {{ (todos | filter:{completed:true}).length }} /\n    {{ todos.length }}\n  </div>\n  <form ng-submit=\"addTodo()\">\n    <label class=\"checkbox\">\n      <input type=\"checkbox\" ng-model=\"hideCompleted\" />\n      Hide completed todos\n    </label>\n    <input type=\"text\" ng-model=\"newTodoTitle\" placeholder=\"Buy beer\" class=\"form-control\"/>\n    <button class=\"btn btn-default\">\n      <span class=\"glyphicon glyphicon-plus\"></span>\n      Add todo\n    </button>\n  </form>\n</body>\n</html>\n"
          }
        }
      }
    },
    {
      "id": "angular-directives",
      "name": "ng Directives",
      "title": "Angular.js - Directives",
      "text": "<h3>\n  Have you wondered what all those <code>ng-something</code> attributes are?\n</h3>\n<h2>\n  <span class=\"glyphicon glyphicon-ok\"></span>\n  <span class=\"text-success\">\n    <a href=\"http://docs.angularjs.org/guide/directive\">Directive</a>\n    <span class=\"glyphicon glyphicon-book text-muted\"></span>\n    is a glue between DOM and your models (JS code)\n  </span>\n</h2>\n",
      "fiddle": {
        "big": true,
        "js": "angular.module(\"todosApp\", [])\n  .controller(\"TodosController\", \n    [\"$scope\", function($scope) {\n      $scope.text = 'Directives are soo cool!';\n}]).directive('successText', function() {\n  return {\n    // Avoid using \"template\" use \"templateUrl\" instead\n    // it allows you to store html in it's own file\n    template: '<span class=\"glyphicon glyphicon-ok\"></span> '+\n              '<span class=\"text-success\">{{ text }}</span>'\n  };\n});\n",
        "html": "<!doctype html>\n<html lang=\"en\" ng-app=\"todosApp\">\n<head>\n  <meta charset=\"utf-8\">\n  <title>Hello Angular!</title>\n  <script src=\"http://ajax.googleapis.com/ajax/libs/angularjs/1.2.8/angular.min.js\"></script>\n</head>\n<body ng-controller=\"TodosController\">\n  <h2 success-text>\n  </h2>\n  <p success-text>\n  </p>\n</body>\n</html>\n"
      }
    },
    {
      "id": "angular-directives2",
      "name": "ng Directives",
      "title": "Angular.js - Directive with it's own scope",
      "text": "<h4 class=\"text-muted\">\n  What happened in Vegas stays in Vegas\n</h4>\n<h2>\n  <code>$scope</code> is similar to JS function scope\n</h2>\n<h2>\n  <span class=\"glyphicon glyphicon-ok\"></span>\n  <span class=\"text-success\">\n  You can isolate directive from context where it is used\n  </span>\n</h2>\n",
      "fiddle": {
        "big": true,
        "js": "angular.module(\"todosApp\", [])\n  .controller(\"TodosController\", \n    [\"$scope\", function($scope) {\n      $scope.ctrlText = 'Directives are soo cool!';\n}]).directive('successText', function() {\n  return {\n    // Use as a custom element instead of attribute\n    restrict: 'E', \n    // Create your own scope and bind \"text\" attribute\n    // to \"text\" variable\n    scope: {\n      text: '='\n    },\n    template: '<span class=\"glyphicon glyphicon-ok\"></span> '+\n              '<span class=\"text-success\">{{ text }}</span>'\n  };\n});\n",
        "html": "<!doctype html>\n<html lang=\"en\" ng-app=\"todosApp\">\n<head>\n  <meta charset=\"utf-8\">\n  <title>Hello Angular!</title>\n  <script src=\"http://ajax.googleapis.com/ajax/libs/angularjs/1.2.8/angular.min.js\"></script>\n</head>\n<body ng-controller=\"TodosController\">\n  <h2>\n    <success-text text=\"ctrlText\"></success-text>\n  </h2>\n  <!-- This is expression so we need to use '' -->\n  <success-text text=\"'Oh yes, they are.'\">\n  </success-text>\n</body>\n</html>\n"
      }
    },
    {
      "id": "task-directive-workspace",
      "name": "Task 7",
      "title": "Task 7: Workspace",
      "fiddle": {
        "big": true,
        "js": "var app = angular.module(\"todosApp\", ['ui.bootstrap']);\napp.directive('todo', function(){\n  return {};\n});\napp.controller('TodosController',  ['$scope', 'Todos', function($scope, Todos) {\n\n  Todos.getTodos().then(function(todos){\n    $scope.todos = todos;\n  });\n\n  $scope.newTodoTitle = \"Buy beer\";\n  $scope.hideCompleted = false;\n\n  $scope.addTodo = function() {\n    var title = $scope.newTodoTitle;\n    if (!title) return;\n\n    $scope.todos.push({\n      title: title,\n      completed: false\n    });\n    Todos.saveTodos($scope.todos).then(function(){\n      console.log(\"Todos saved\");\n    });\n    $scope.newTodoTitle = \"\";\n  };\n  $scope.getTodosFilter = function() {\n      var filter = {};\n      !$scope.hideCompleted || (filter['completed'] = false);\n      return filter;\n  };\n}]);\napp.factory('Todos', ['$q', '$window', '$timeout', function($q, $window, $timeout) {\n  /* It does not work because of runner in browser. It should work in your case.\n   * var localStorage = $window.localStorage;\n   */\n  var localStorage = {\n    setItem: function(){},\n    getItem: function(){}\n  };\n  return {\n    getTodos: function() {\n      var d = $q.defer();\n      //$timeout is only to show that it works;)\n      $timeout(function() {\n        var todos = localStorage.getItem('todos') || \"[]\";\n        d.resolve(angular.fromJson(todos));\n      }, 2000);\n      return d.promise;\n    },\n    saveTodos: function(todos) {\n      var d = $q.defer();\n      var todosStr = angular.toJson(todos);\n      localStorage.setItem('todos', todosStr);\n      d.resolve();\n      return d.promise;\n    }\n  };\n}]);\n",
        "html": "<!doctype html>\n<html lang=\"en\" ng-app=\"todosApp\">\n<head>\n  <meta charset=\"utf-8\">\n  <title>Hello Angular!</title>\n  <script src=\"http://ajax.googleapis.com/ajax/libs/angularjs/1.2.8/angular.min.js\"></script>\n  <script src=\"http://cdnjs.cloudflare.com/ajax/libs/angular-ui-bootstrap/0.9.0/ui-bootstrap-tpls.js\"></script>\n</head>\n<body ng-controller=\"TodosController\">\n  <div class=\"list-group\">\n    <todo todo=\"todo\" ng-repeat=\"todo in todos | filter:getTodosFilter()\">\n    </todo>\n  </div>\n  <div>\n    Completed: \n    {{ (todos | filter:{completed:true}).length }} /\n    {{ todos.length }}\n  </div>\n  <form ng-submit=\"addTodo()\">\n    <label class=\"checkbox\">\n      <input type=\"checkbox\" ng-model=\"hideCompleted\" />\n      Hide completed todos\n    </label>\n    <input type=\"text\" ng-model=\"newTodoTitle\" placeholder=\"Buy beer\" class=\"form-control\"/>\n    <button class=\"btn btn-default\">\n      <span class=\"glyphicon glyphicon-plus\"></span>\n      Add todo\n    </button>\n  </form>\n</body>\n</html>\n"
      }
    },
    {
      "id": "task-directive",
      "name": "Task 8",
      "title": "Task: Close single todo inside directive",
      "task": {
        "duration": 30,
        "objectives": [
          "Create directive <code>&lt;todo&gt;</code> that displays single todo"
        ],
        "extras": [
          "Editing of todo should be handled inside directive",
          "Write <code>EventBus</code> from JS4J training"
        ],
        "solution": {
          "fiddle": {
            "big": true,
            "js": "var app = angular.module(\"todosApp\", ['ui.bootstrap']);\napp.directive('todo', function(){\n  return {\n    restrict: 'E',\n    scope: {\n      todo: '='\n    },\n    // Normally you should use \"templateUrl\" to put it to separate file\n    template: '<div class=\"list-group-item\">' +\n      '<input type=\"text\" class=\"form-control\" '+\n      '  ng-model=\"todo.title\" ng-show=\"editing\" ng-blur=\"editing = false\" />'+\n      '<label class=\"checkbox\" ng-hide=\"editing\">'+\n      '  <a href=\"\" class=\"pull-right text-muted\" ng-click=\"editing = !editing\">'+\n      '    <span class=\"glyphicon glyphicon-pencil\"></span>'+\n      '  </a>'+\n      '  <input type=\"checkbox\" ng-model=\"todo.completed\" />'+\n      '  {{ todo.title }}'+\n      '</label>'+\n   '</div>'\n  };\n});\napp.controller('TodosController',  ['$scope', 'Todos', function($scope, Todos) {\n  //it could be done in ng-init\n  $scope.editing = {};\n\n  Todos.getTodos().then(function(todos){\n    $scope.todos = todos;\n  });\n\n  $scope.newTodoTitle = \"Buy beer\";\n  $scope.hideCompleted = false;\n\n  $scope.addTodo = function() {\n    var title = $scope.newTodoTitle;\n    if (!title) return;\n\n    $scope.todos.push({\n      title: title,\n      completed: false\n    });\n    Todos.saveTodos($scope.todos).then(function(){\n      console.log(\"Todos saved\");\n    });\n    $scope.newTodoTitle = \"\";\n  };\n  $scope.getTodosFilter = function() {\n      var filter = {};\n      !$scope.hideCompleted || (filter['completed'] = false);\n      return filter;\n  };\n}]);\napp.factory('Todos', ['$q', '$window', '$timeout', function($q, $window, $timeout) {\n  /* It does not work because of runner in browser. It should work in your case.\n   * var localStorage = $window.localStorage;\n   */\n  var localStorage = {\n    setItem: function(){},\n    getItem: function(){}\n  };\n  return {\n    getTodos: function() {\n      var d = $q.defer();\n      //$timeout is only to show that it works;)\n      $timeout(function() {\n        var todos = localStorage.getItem('todos') || \"[]\";\n        d.resolve(angular.fromJson(todos));\n      }, 2000);\n      return d.promise;\n    },\n    saveTodos: function(todos) {\n      var d = $q.defer();\n      var todosStr = angular.toJson(todos);\n      localStorage.setItem('todos', todosStr);\n      d.resolve();\n      return d.promise;\n    }\n  };\n}]);\n",
            "html": "<!doctype html>\n<html lang=\"en\" ng-app=\"todosApp\">\n<head>\n  <meta charset=\"utf-8\">\n  <title>Hello Angular!</title>\n  <script src=\"http://ajax.googleapis.com/ajax/libs/angularjs/1.2.8/angular.min.js\"></script>\n  <script src=\"http://cdnjs.cloudflare.com/ajax/libs/angular-ui-bootstrap/0.9.0/ui-bootstrap-tpls.js\"></script>\n</head>\n<body ng-controller=\"TodosController\">\n  <div class=\"list-group\">\n    <todo todo=\"todo\" ng-repeat=\"todo in todos | filter:getTodosFilter()\">\n    </todo>\n  </div>\n  <div>\n    Completed: \n    {{ (todos | filter:{completed:true}).length }} /\n    {{ todos.length }}\n  </div>\n  <form ng-submit=\"addTodo()\">\n    <label class=\"checkbox\">\n      <input type=\"checkbox\" ng-model=\"hideCompleted\" />\n      Hide completed todos\n    </label>\n    <input type=\"text\" ng-model=\"newTodoTitle\" placeholder=\"Buy beer\" class=\"form-control\"/>\n    <button class=\"btn btn-default\">\n      <span class=\"glyphicon glyphicon-plus\"></span>\n      Add todo\n    </button>\n  </form>\n</body>\n</html>\n"
          }
        }
      }
    },
    {
      "id": "nodejs",
      "name": "Node.js",
      "title": "Node.js - <code>http</code> module",
      "code": {
        "hideOutput": false,
        "language": "express",
        "run": false,
        "big": true,
        "content": "var http = require('http');\n\nvar server = http.createServer(function (req, res) {\n  res.end(\"Hello world\");\n});\n\nserver.listen(process.env.PORT || 3000, function(){\n    console.log(\"Running on \" + process.env.PORT);\n});\n"
      },
      "iframe": true
    },
    {
      "id": "connectjs",
      "name": "Connect.js",
      "title": "Connect.js",
      "text": "<h2 class=\"text-muted\">\n  <a href=\"http://www.senchalabs.org/connect/\">Connect</a> is a middleware framework for node.\n</h2>\n",
      "code": {
        "hideOutput": false,
        "language": "express",
        "run": false,
        "big": true,
        "content": "var http = require('http'),\n    connect = require('connect');\n\nvar app = connect()\n.use(connect.logger('dev'))\n.use(function(req, res) {\n  res.end(\"Hello World!\");\n});\n\nhttp.createServer(app).listen(process.env.PORT || 3000, function(){\n    console.log(\"Listening on \" + (process.env.PORT || 3000));\n});\n"
      },
      "iframe": true
    },
    {
      "id": "connectjs2",
      "name": "Connect.js",
      "title": "Connect.js - Middleware?",
      "text": "<h2 class=\"text-muted\">\n  WTF is middleware?\n</h2>\n",
      "code": {
        "hideOutput": false,
        "language": "express",
        "run": false,
        "big": true,
        "content": "var http = require('http'),\n    connect = require('connect');\n\nvar app = connect()\n.use(function(req, res, next){\n  if (Math.random() < 0.5) {\n    next();\n  } else {\n    res.end(\"Busted!\");\n  }\n})\n.use(function(req, res) {\n  res.end(\"Hello World!\");\n});\n\nhttp.createServer(app).listen(process.env.PORT || 3000, function(){\n    console.log(\"Listening on \" + (process.env.PORT || 3000));\n});\n"
      },
      "iframe": true
    },
    {
      "id": "expressjs",
      "name": "Express.js",
      "title": "Express.js",
      "text": "<h2 class=\"text-muted\">\n  <a href=\"http://expressjs.com/\">Express</a> - web application framework for node\n</h2>\n",
      "code": {
        "hideOutput": false,
        "language": "express",
        "run": false,
        "big": true,
        "content": "var express = require('express'), \n    http = require('http'), path = require('path');\n\nvar app = express();\napp.set('port', process.env.PORT || 3000);\napp.set('views', path.join(__dirname, 'views'));\napp.set('view engine', 'jade');\napp.use(app.router);\n\napp.get('/', function(req, res) {\n    res.send(\"Hello world!\");\n});\n\nhttp.createServer(app).listen(app.get('port'), function(){\n    console.log('Express server listening on port ' + app.get('port'));\n});\n"
      },
      "iframe": true
    },
    {
      "id": "expressjs-app",
      "name": "Express.js",
      "title": "Express.js - Full app",
      "code": {
        "hideOutput": false,
        "language": "express",
        "run": false,
        "big": true,
        "content": "var express = require('express'), \n    http = require('http'), path = require('path');\n\nvar app = express();\napp.set('port', process.env.PORT || 3000);\napp.set('views', path.join(__dirname, 'views'));\napp.set('view engine', 'jade');\napp.use(express.favicon());\napp.use(express.logger('dev'));\napp.use(express.json());\napp.use(express.urlencoded());\napp.use(express.methodOverride());\napp.use(express.cookieParser('your secret here'));\napp.use(express.session());\napp.use(express.bodyParser());\napp.use(app.router);\napp.use(express.static(path.join(__dirname, 'public')));\n\napp.get('/', function(req, res) {\n    res.send(\"Hello world!\");\n});\n\nhttp.createServer(app).listen(app.get('port'), function(){\n    console.log('Express server listening on port ' + app.get('port'));\n});\n"
      },
      "iframe": true
    },
    {
      "id": "expressjs-api",
      "name": "Express.js",
      "title": "Express.js - API",
      "code": {
        "hideOutput": false,
        "language": "express",
        "run": false,
        "big": true,
        "content": "var express = require('express'), \n    http = require('http'), path = require('path');\n\nvar app = express();\napp.set('port', process.env.PORT || 3000);\napp.set('views', path.join(__dirname, 'views'));\napp.set('view engine', 'jade');\napp.use(app.router);\n\nvar model = {\n  a: 5\n};\napp.get('/', function(req, res) {\n    res.header('Access-Control-Allow-Origin', '*');\n    res.send(model);\n});\n\nhttp.createServer(app).listen(app.get('port'), function(){\n    console.log('Express server listening on port ' + app.get('port'));\n});\n"
      },
      "iframe": true
    },
    {
      "id": "websockets",
      "name": "WebSockets",
      "title": "Server Push",
      "text": "<div>\n  <h2>\n    <span class=\"text-success\"><span class=\"glyphicon glyphicon-ok\"></span></span>\n    Polling\n  </h2>\n  <h2>\n    <span class=\"text-success\"><span class=\"glyphicon glyphicon-ok\"></span></span>\n    Long polling\n  </h2>\n  <h2>\n    <span class=\"text-success\"><span class=\"glyphicon glyphicon-ok\"></span></span>\n    Pushlet\n  </h2>\n  <h2>\n    <span class=\"text-success\"><span class=\"glyphicon glyphicon-ok\"></span></span>\n    Websockets\n  </h2>\n</div>\n"
    },
    {
      "id": "websockets2",
      "name": "WebSockets",
      "title": "Socket.io - Server",
      "iframe": true,
      "code": {
        "big": true,
        "language": "express",
        "content": "var express = require('express'), \n    http = require('http'), socketio = require('socket.io'),\n    path = require('path');\n\nvar app = express();\napp.set('port', process.env.PORT || 3000);\napp.set('views', path.join(__dirname, 'views'));\napp.set('view engine', 'jade');\napp.use(app.router);\n\nvar clients = 0;\napp.get('/', function(req, res) {\n    res.send(\"Hello world. We have \" + clients + \" clients.\");\n});\n\nvar server = http.Server(app);\nvar io = socketio.listen(server);\nio.on('connection', function(socket) {\n  clients++;\n\n  socket.broadcast.emit('clients', clients);\n  socket.emit('clients', clients);\n\n  socket.on('disconnect', function() {\n    clients--;\n  });\n});\n\nserver.listen(app.get('port'), function() {\n    console.log('Express and Socket.IO server listening on port ' + app.get('port'));\n});\n"
      }
    },
    {
      "id": "websockets3",
      "name": "WebSockets",
      "title": "Socket.io - Client",
      "fiddle": {
        "active": "js",
        "js": "var socket = io.connect('http://todr.me:5836');\nsocket.on('clients', function (data) {\n  document.querySelector('.clients').innerHTML = data;\n});\n",
        "html": "<html>\n<head>\n  <title>Socket.io</title>\n  <script src=\"http://todr.me:3020/socket.io/socket.io.js\"></script>\n</head>\n<body>\n<h1>Number of clients: <span class=\"label label-primary clients\"></span></h1>\n</body>\n</html>\n"
      }
    },
    {
      "id": "wtf",
      "name": "WTF!?",
      "title": "Jak to działa?",
      "text": "<div class=\"row\">\n<div class=\"col-sm-5\">\n<h2>Frontend</h3>\n<h3>\n    <span class=\"text-success\">\n        <span class=\"glyphicon glyphicon-ok\"></span>\n    </span>\n    Angular.js & Require.js\n</h3>\n<h3>\n    <span class=\"text-success\">\n        <span class=\"glyphicon glyphicon-ok\"></span>\n    </span>\n    System luźno związanych pluginów\n</h3>\n<h3>\n    <span class=\"text-success\">\n        <span class=\"glyphicon glyphicon-ok\"></span>\n    </span>\n    Grunt & Bower\n</h3>\n</div>\n<div class=\"col-sm-5\">\n<h2>Backend - platforma</h2>\n<h3>\n    <span class=\"text-success\">\n        <span class=\"glyphicon glyphicon-ok\"></span>\n    </span>\n    Express.js / Kraken.js\n</h3>\n<h3>\n    <span class=\"text-success\">\n        <span class=\"glyphicon glyphicon-ok\"></span>\n    </span>\n    Socket.io\n</h3>\n<h3>\n    <span class=\"text-success\">\n        <span class=\"glyphicon glyphicon-ok\"></span>\n    </span>\n    Rabbit MQ\n</h3>\n<h3>\n    <span class=\"text-success\">\n        <span class=\"glyphicon glyphicon-ok\"></span>\n    </span>\n    Mongo DB\n</h3>\n</div>\n</div>\n"
    },
    {
      "id": "wtf2",
      "name": "WTF!?",
      "title": "Jak to działa? (2.0)",
      "text": "<div class=\"row\">\n<div class=\"col-sm-6\">\n<h2>Backend - runners</h2>\n<h3>\n    <span class=\"text-success\">\n        <span class=\"glyphicon glyphicon-ok\"></span>\n    </span>\n    Java - In-memory compilation & Running\n</h3>\n<h3>\n    <span class=\"text-success\">\n        <span class=\"glyphicon glyphicon-ok\"></span>\n    </span>\n    Node.js - Process management & Sandboxing\n</h3>\n<h3>\n    <span class=\"text-success\">\n        <span class=\"glyphicon glyphicon-ok\"></span>\n    </span>\n    Express.js - Own server with exchangable code\n</h3>\n<h3>\n    <span class=\"text-success\">\n        <span class=\"glyphicon glyphicon-question-sign\"></span>\n    </span>\n    Mongo DB - Execute live queries\n</h3>\n<h3>\n    <span class=\"text-success\">\n        <span class=\"glyphicon glyphicon-question-sign\"></span>\n    </span>\n    Python\n</h3>\n<h3>\n    <span class=\"text-success\">\n        <span class=\"glyphicon glyphicon-question-sign\"></span>\n    </span>\n    C#\n</h3>\n<h3>\n    <span class=\"text-warning\">\n        <span class=\"glyphicon glyphicon-question-sign\"></span>\n    </span>\n    Kinect ?\n</h3>\n\n</div>\n<div class=\"col-sm-5\">\n    <img src=\"http://projects.blacksoft.eu/devmeetings.svg\" width=\"100%\"/>\n</div>\n</div>\n"
    },
    {
      "id": "plugins",
      "name": "Plugins",
      "title": "Xplatform - plugins",
      "code": {
        "big": true,
        "language": "javascript-norun",
        "content": "define(['_', 'slider/slider.plugins', 'ace'], function(_, sliderPlugins, ace) {\n\n    var EDITOR_THEME = 'todr';\n\n\n    var getCodeData = function(code) {\n        if (!_.isObject(code)) {\n            code = {\n                content: code,\n                mode: 'javascript'\n            };\n        }\n        return code;\n    };\n\n    var triggerCodeChange = function(ev, editor) {\n        sliderPlugins.trigger.apply(sliderPlugins, ['slide.slide-code.change', ev, editor]);\n    };\n\n    sliderPlugins.registerPlugin('slide', 'code', 'slide-code', 3000).directive('slideCode', [\n\n        function() {\n\n            var editor = null;\n\n            return {\n                restrict: 'E',\n                scope: {\n                    code: '=data',\n                    slide: '=context'\n                },\n                template: '<div class=\"editor\"><div></div></div>',\n                link: function(scope, element) {\n                    var code = getCodeData(scope.code);\n\n                    editor = ace.edit(element[0].childNodes[0]);\n                    editor.setTheme(\"ace/theme/\" + EDITOR_THEME);\n                    editor.getSession().setMode('ace/mode/' + code.mode);\n\n                    editor.on('change', triggerCodeChange);\n                    editor.setValue(code.content);\n\n                    sliderPlugins.onLoad(function() {\n                        triggerCodeChange({}, editor);\n                    });\n                }\n            };\n        }\n    ]);\n\n});\n"
      }
    },
    {
      "id": "ending",
      "name": "Ending",
      "title": "How do you like Devmeetings.pl?",
      "text": "<div class=\"text-center\">\n  <a href=\"http://pl.tinypic.com?ref=oa2mbk\" target=\"_blank\">\n    <img src=\"http://i39.tinypic.com/oa2mbk.png\" alt=\"Image and video hosting by TinyPic\" width=\"400\">\n  </a>\n</div>\n<h3 class=\"text-right\">\n  <span class=\"icon-mail text-muted\"></span>\n  <a href=\"mailto:tomasz.drwiega@gmail.com\">tomasz.drwiega@gmail.com</a>\n</h3>\n<h3 class=\"text-right\">\n  <span class=\"icon-github text-muted\"></span> <a href=\"https://github.com/tomusdrw\" target=\"profile\">github/tomusdrw</a>\n  &nbsp;\n  <span class=\"icon-google-plus text-muted\"></span> <a href=\"https://plus.google.com/+TomaszDrwi%C4%99ga\" target=\"profile\">+Tomasz Drwięga</a>\n  &nbsp;\n  <span class=\"icon-linkedin text-muted\"></span> <a href=\"http://www.linkedin.com/in/tomaszdrwiega\" target=\"profile\">in/Tomasz Drwięga</a>\n</h3>\n"
    }
  ]