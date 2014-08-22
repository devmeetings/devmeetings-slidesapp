define(['slider/slider'], function(slider) {
slider.run(['$templateCache', function($templateCache){
  'use strict';

  $templateCache.put('/static/dm-admin/controllers/dm-admin-chapter/dm-admin-chapter.html',
    "<div class=\"col-lg-12 col-md-12 dm-admin-div\"><div class=\"panel\"><div class=\"panel-heading\"><h2>{{chapter.title}}</h2></div><div class=\"panel-body\"><form class=\"form-horizontal col-lg-12 col-md-12\"><fieldset class=\"col-lg-8 col-md-8\"><div class=\"form-group\"><label control-label=\"control-label\" class=\"col-lg-2 col-md-2\">Title</label><div class=\"col-lg-10 col-md-10\"><input type=\"text\" ng-model=\"chapter.title\" class=\"form-control\"></div></div><div class=\"form-group\"><label control-label=\"control-label\" class=\"col-lg-2 col-md-2\">Mode</label><div class=\"col-lg-10 col-md-10\"><select ng-model=\"chapter.mode\" class=\"form-control\"><option>video</option><option>task</option></select></div></div></fieldset></form><div ng-if=\"chapter.mode === &quot;video&quot;\" class=\"col-lg-12 col-md-12 dm-admin-div\"><h4>videodata</h4><form class=\"form-horizontal col-lg-8 col-md-8\"><fieldset><div class=\"form-group\"><label control-label=\"control-label\" class=\"col-lg-2 col-md-2\">url</label><div class=\"col-lg-10 col-md-10\"><input type=\"text\" ng-model=\"chapter.videodata.url\" class=\"form-control\"></div></div><div class=\"form-group\"><label control-label=\"control-label\" class=\"col-lg-2 col-md-2\">recording</label><div class=\"col-lg-10 col-md-10\"><select ng-model=\"select.recording\" ng-options=\"recording.title group by recording.group for recording in recordings\" class=\"form-control\"></select><span class=\"help-block\">{{select.recording._id}}</span></div></div><div class=\"form-group\"><label control-label=\"control-label\" class=\"col-lg-2 col-mg-2\">timestamp</label><div class=\"col-lg-10 col-md-10\"><input type=\"number\" ng-model=\"chapter.videodata.timestamp\" class=\"form-control\"></div></div><div class=\"form-group\"><label control-label=\"control-label\" class=\"col-lg-2 col-mg-2\">recording time</label><div class=\"col-lg-10 col-md-10\"><input type=\"number\" ng-model=\"chapter.videodata.recordingTime\" class=\"form-control\"></div></div><div class=\"form-group\"><label control-label=\"control-label\" class=\"col-lg-2 col-mg-2\">length</label><div class=\"col-lg-10 col-md-10\"><input type=\"number\" ng-model=\"chapter.videodata.length\" class=\"form-control\"></div></div></fieldset></form></div><div ng-if=\"chapter.mode === &quot;task&quot;\" class=\"col-lg-12 col-md-12 dm-admin-div\"><h4>taskdata</h4><form class=\"form-horizontal col-lg-8 col-md-8\"><fieldset><div class=\"form-group\"><label control-label=\"control-label\" class=\"col-lg-2 col-md-2\">slide</label><div class=\"col-lg-10 col-md-10\"><textarea rows=\"3\" ng-model=\"chapter.taskdata.slide\" class=\"form-control\"></textarea></div></div></fieldset></form></div><div class=\"col-lg-12 col-md-12\"><form class=\"form-horizontal col-lg-8 col-md-8\"><fieldset><div class=\"form-group\"><div class=\"col-lg-12\"><button type=\"button\" ng-click=\"saveChapter()\" class=\"btn btn-primary pull-right\">Submit</button><button type=\"button\" ng-click=\"cancelSaveChapter()\" class=\"btn btn-default pull-right\">Cancel</button></div></div></fieldset></form></div></div><div class=\"panel-footer\"><h1>preview</h1><form class=\"form-horizontal col-lg-8 col-md-8\"><fieldset><div class=\"form-group\"><div class=\"col-lg-12\"><button type=\"button\" ng-click=\"videopreview.isPlaying = !videopreview.isPlaying\" class=\"btn btn-primary pull-right\">Play</button></div></div></fieldset></form><p class=\"col-lg-12 col-md-12\">current-second: {{videopreview.currentSecond | number:2}}</p><p class=\"col-lg-12 col-md-12\">numberOfSlides: {{recordingPlayer.numberOfSlides }}</p><p class=\"col-lg-12 col-md-12\">length: {{recordingPlayer.length}}</p><div class=\"col-lg-12 col-md-12\"><plugins-loader namespace=\"'slide'\" context=\"recordingPlayer.slide\"></plugins-loader></div><div class=\"col-lg-12 col-md-12\"><dm-wavesurfer dm-scroll=\"true\" dm-src=\"videopreview.src\" dm-start-second=\"videopreview.startSecond\" dm-current-second=\"videopreview.currentSecond\" dm-is-playing=\"videopreview.isPlaying\"></dm-wavesurfer></div></div></div></div>"
  );


  $templateCache.put('/static/dm-admin/controllers/dm-admin-chapters/dm-admin-chapters.html',
    "<div class=\"col-lg-3 col-md-3 dm-admin-div\"><div class=\"panel\"><div class=\"panel-heading\"><h2>{{training.title}}</h2></div><div class=\"panel-body\"><div ui-sortable=\"updateChaptersOrder\" ng-model=\"training.chapters\" class=\"list-group\"><a ng-repeat=\"chapter in training.chapters\" ui-sref=\"index.trainings.chapters.chapter({index: $index})\" ui-sref-active=\"active\" class=\"list-group-item\"><span ng-click=\"removeChapterAtIndex($index)\" class=\"glyphicon glyphicon-trash text-danger pull-right\"></span>{{chapter.title}}</a></div></div><div class=\"panel-footer\"><form ng-submit=\"addChapter()\" class=\"form-group\"><div class=\"input-group\"><input type=\"text\" ng-model=\"playerData.title\" class=\"form-control\"><span class=\"input-group-btn\"><button type=\"submit\" class=\"btn btn-default\">Add</button></span></div></form></div></div></div><div class=\"col-lg-9 col-md-9 dm-admin-div\"><div ui-view=\"chapter\"></div></div>"
  );


  $templateCache.put('/static/dm-admin/controllers/dm-admin-decks/dm-admin-decks.html',
    "<div class=\"col-lg-12 col-md-12\"><h2>Hello deck admin</h2></div>"
  );


  $templateCache.put('/static/dm-admin/controllers/dm-admin-slider/dm-admin-slider.html',
    "<div class=\"col-lg-2 col-md-2 dm-admin-div\"><h2>Menu</h2><div class=\"list-group\"><a ng-repeat=\"option in options\" ui-sref=\"{{option.sref}}\" ui-sref-active=\"active\" class=\"list-group-item\">{{option.title}}</a></div></div><div class=\"col-lg-10 col-md-10 dm-admin-div\"><div ui-view=\"content\"></div></div><div class=\"col-lg-12 col-md-12 dm-admin-div\"><div ui-view=\"subcontent\"></div></div>"
  );


  $templateCache.put('/static/dm-admin/controllers/dm-admin-trainings/dm-admin-trainings.html',
    "<div class=\"col-lg-2 col-md-2 dm-admin-div\"><div class=\"panel\"><div class=\"panel-heading\"><h2>Trainings</h2></div><div class=\"panel-body\"><div ui-sortable=\"updateTrainingsOrder\" ng-model=\"trainings\" class=\"list-group\"><a ng-repeat=\"training in trainings\" ui-sref=\"index.trainings.chapters({id: training._id})\" ui-sref-active=\"active\" class=\"list-group-item\">{{training.title}}</a></div></div><div class=\"panel-footer\"><form ng-submit=\"addTraining()\" class=\"form-group\"><div class=\"input-group\"><input type=\"text\" ng-model=\"trainingsData.title\" class=\"form-control\"><span class=\"input-group-btn\"><button type=\"submit\" class=\"btn btn-default\">Add</button></span></div></form></div></div></div><div class=\"col-lg-10 col-md-10 dm-admin-div\"><div ui-view=\"training\"></div></div>"
  );


  $templateCache.put('/static/dm-admin/controllers/dm-admin-waves/dm-admin-waves.html',
    "<div class=\"col-md-12\"><h1>Hello Waves</h1><dm-wavesurfer dm-src=\"select.soundTitle\" dm-start-second=\"select.startSecond\" dm-current-second=\"select.currentSecond\"></dm-wavesurfer></div><div class=\"col-md-12\"><select ng-model=\"select.soundTitle\" ng-options=\"sound for sound in sounds\" class=\"form-control\"></select><select ng-model=\"select.recordingTitle\" ng-options=\"recording.title group by recording.group for recording in recordings\" class=\"form-control\"></select></div>"
  );


  $templateCache.put('/static/dm-plugins/deck-navbar/deck-navbar.html',
    "<nav role=\"navigation\" class=\"navbar navbar-default navbar-slides\"><div class=\"navbar-header\"><button type=\"button\" data-toggle=\"collapse\" data-target=\"#navbar-slides\" class=\"navbar-toggle\"><span class=\"sr-only\">Toggle navigation</span><span class=\"icon-bar\"></span><span class=\"icon-bar\"></span><span class=\"icon-bar\"></span></button><ul class=\"nav navbar-nav navbar-left\"><li class=\"dropdown\"><a data-toggle=\"dropdown\" class=\"dropdown-toggle text-muted cursor-pointer\"><span class=\"glyphicon glyphicon-th-large\"></span></a><ul class=\"dropdown-menu\"><li><a href=\"?edit=true\"><span class=\"fa fa-pencil\"></span> Edit Mode</a></li><li><a href=\"{{ deckUrl }}/trainer\"><span class=\"fa fa-graduation-cap\"></span> Trainer Mode</a></li><li class=\"divider\"></li><li><a href=\"/\"><span class=\"fa fa-paper-plane\"></span> All slides</a></li></ul></li></ul></div><div id=\"navbar-slides\" class=\"collapse navbar-collapse\"><div style=\"position: relative; width: calc(100% - 60px); height: 40px; overflow-x: visible; overflow-y: hidden; white-space: nowrap\" class=\"slimScrollDiv\"><ul ng-if=\"$root.modes.isEditMode\" ui-sortable=\"sortableOptions\" ng-model=\"slides\" class=\"nav navbar-nav nav-slides\"><li ng-repeat=\"slide in slides\" ng-class=\"{ 'active' : slide._id === csm.activeSlideId}\"><a href=\"#{{slide._id}}\">{{ slide.content.name }}</a></li></ul><ul ng-if=\"!$root.modes.isEditMode\" ng-model=\"slides\" class=\"nav navbar-nav nav-slides\"><li ng-repeat=\"slide in slides\" ng-class=\"{ 'active' : slide._id === csm.activeSlideId}\"><a href=\"#{{slide._id}}\">{{ slide.content.name }}</a></li></ul></div><ul ng-if=\"$root.modes.isEditMode\" class=\"nav navbar-nav\"><li><a ng-click=\"addSlide()\"><span class=\"glyphicon glyphicon-plus\"></span></a></li></ul></div></nav>"
  );


  $templateCache.put('/static/dm-plugins/deck-slides/deck-slides.html',
    "<section class=\"section-slides full-height\"><iframe ng-src=\"{{ slideSource }}\" class=\"iframe-slides full-height\"></iframe></section>"
  );


  $templateCache.put('/static/dm-plugins/deck.sidebar-bitcoin/deck.html',
    "<div class=\"bitcoin-button\"><a data-code=\"874bd874065865284ce04e6d52d79e70\" data-button-style=\"donation_small\" href=\"https://coinbase.com/checkouts/874bd874065865284ce04e6d52d79e70\" class=\"coinbase-button\">Donate Bitcoins</a><script src=\"https://coinbase.com/assets/button.js\" async></script></div>"
  );


  $templateCache.put('/static/dm-plugins/deck.sidebar-stream/deck.html',
    "<div><button ng-click=\"setStatus('too-fast')\" class=\"btn btn-warning\"><span class=\"fa fa-tachometer\"></span> Too fast!</button><button ng-click=\"setStatus('awesome')\" class=\"btn btn-success\"><span class=\"fa fa-thumbs-o-up\"></span> Awesome!</button><button ng-click=\"setStatus('boring')\" class=\"btn btn-primary\"><span class=\"fa fa-fast-forward\"></span> Boring...</button><div class=\"list-group\"><div ng-repeat=\"status in statuses\" class=\"list-group-item\"><div ng-show=\"status.status == 'boring'\"><span class=\"fa fa-fast-forward\"></span> {{ status.date | date:'mediumTime' }} Booooring...</div><div ng-show=\"status.status == 'awesome'\"><span class=\"fa fa-thumbs-o-up\"></span> {{ status.date | date:'mediumTime' }} Awesomeee!!!!</div><div ng-show=\"status.status == 'too-fast'\"><span class=\"fa fa-tachometer\"></span> {{ status.date | date:'mediumTime' }} Too fast! Please slow down!</div></div></div></div>"
  );


  $templateCache.put('/static/dm-plugins/slide-accordion/part.html',
    "<accordion close-others=\"true\"><accordion-group heading=\"{{group.title}}\" ng-repeat=\"group in data\"><plugins-loader namespace=\"'slide'\" context=\"group.data\"></plugins-loader></accordion-group></accordion>"
  );


  $templateCache.put('/static/dm-plugins/slide-chat/part.html',
    "<div class=\"panel panel-primary chat-window\"><div class=\"panel-heading\"><h3 class=\"panel-title\">Chat</h3></div><div class=\"panel-body\" id=\"chatscroll\"><ul class=\"chat\"><li ng-repeat=\"message in messages | orderBy: message.timestamp:'true'\" ng-class=\"{'left clearfix' : $even, 'right clearfix' : $odd}\"><div><span class=\"chat-img\" ng-class=\"{'pull-left': $even, 'pull-right': $odd}\"><img ng-show=\"$even\" src=\"http://placehold.it/50/55C1E7/fff&amp;text=JS\" alt=\"User Avatar\" class=\"img-circle\"> <img ng-show=\"$odd\" src=\"http://placehold.it/50/FA6F57/fff&amp;text=JS\" alt=\"User Avatar\" class=\"img-circle\"></span><div class=\"chat-body clearfix\"><div class=\"header\"><strong ng-if=\"$even\" class=\"primary-font\">Anonymous</strong> <small class=\"text-muted\" ng-class=\"{'pull-right': $even}\"><span class=\"glyphicon glyphicon-time\"></span> {{ message.timestamp | date : 'yyyy-MM-dd HH:mm:ss' }}</small> <strong ng-if=\"$odd\" class=\"primary-font pull-right\">Anonymouse</strong></div><p>{{message.comment}}</p></div></div></li></ul></div><div class=\"panel-footer\"><form ng-submit=\"sendMessage()\" class=\"input-group\"><input id=\"btn-input\" type=\"text\" class=\"form-control input-sm\" placeholder=\"Type your message here...\" ng-model=\"messageText\"> <span class=\"input-group-btn\"><input class=\"btn btn-warning btn-sm\" id=\"btn-chat\" type=\"submit\" value=\"Send\"></span></form></div></div>"
  );


  $templateCache.put('/static/dm-plugins/slide-commit/slide-commit.html',
    "<div ng-hide=\"showDetails\" style=\"position: absolute; bottom: 50px; left: 10px;z-index:19999\"><button ng-click=\"showDetails = true\" class=\"btn btn-sm btn-success\"><span class=\"fa fa-cloud-upload\">Save</span></button></div><div ng-show=\"showDetails\" class=\"form-inline\"><div class=\"form-group\"><input placeholder=\"Commit message\" ng-model=\"commitMessage\" ng-disabled=\"committing\" class=\"input-sm form-control\"></div><div class=\"form-group\"><button ng-disabled=\"committing || !commitMessage.length\" ng-click=\"commit()\" class=\"btn btn-sm btn-success\"><span ng-show=\"committing\" class=\"fa fa-circle-o-notch fa-spin\"></span><span ng-show=\"committing\">Working</span><span ng-show=\"!committing\" class=\"fa fa-cloud-upload\"></span><span ng-show=\"!committing\">Commit work</span></button></div><div class=\"form-group\"><button ng-click=\"showDetails = false\" class=\"btn btn-link text-muted\">&times;</button></div></div>"
  );


  $templateCache.put('/static/dm-plugins/slide-events/slide-event.html',
    "<div class=\"row\"><div class=\"col-md-12\"><h1>{{ event.name }}</h1><p>{{ event.description }}</p></div></div>"
  );


  $templateCache.put('/static/dm-plugins/slide-fiddle/fiddle.html',
    "<div class=\"row\"><div ng-class=\"{'col-sm-12': fiddle.hideOutput, 'col-sm-6': !fiddle.hideOutput }\"><ul class=\"nav nav-tabs\"><li ng-class=\"{'active': active === 'js' }\" ng-show=\"fiddle.js !== undefined\"><a ng-click=\"active = 'js'\" class=\"pointer\">main.js</a></li><li ng-class=\"{'active': active === 'coffee' }\" ng-show=\"fiddle.coffee !== undefined\"><a ng-click=\"active = 'coffee'\" class=\"pointer\">main.coffee</a></li><li ng-class=\"{'active': active === 'css' }\" ng-show=\"fiddle.css !== undefined\"><a ng-click=\"active = 'css'\" class=\"pointer\">styles.css</a></li><li ng-class=\"{'active': active === 'html' }\" ng-show=\"fiddle.html !== undefined\"><a ng-click=\"active = 'html'\" class=\"pointer\">index.html</a></li><li ng-class=\"{'active': active === 'server' }\" ng-show=\"fiddle.server !== undefined\"><a ng-click=\"active = 'server'\" class=\"pointer\">server.js</a></li></ul><div class=\"tab-content\"><div ng-class=\"{'active in': active === 'js' }\" class=\"tab-pane fade\"><div data-mode=\"javascript\" data-content=\"js\" class=\"editor editor-js editor-{{ fiddle.size}}\"></div></div><div ng-class=\"{'active in': active === 'coffee' }\" class=\"tab-pane fade\"><div data-mode=\"coffee\" data-content=\"coffee\" class=\"editor editor-coffee editor-{{ fiddle.size}}\"></div></div><div ng-class=\"{'active in': active === 'css' }\" class=\"tab-pane fade\"><div data-mode=\"css\" data-content=\"css\" class=\"editor editor-css editor-{{ fiddle.size}}\"></div></div><div ng-class=\"{'active in': active === 'html' }\" class=\"tab-pane fade\"><div data-mode=\"html\" data-content=\"html\" class=\"editor editor-html editor-{{ fiddle.size}}\"></div></div><div ng-if=\"fiddle.server\" ng-class=\"{'active in': active === 'server' }\" class=\"tab-pane fade\"><slide-code context=\"fiddle\" data=\"fiddle.server\"></slide-code></div></div><div class=\"errors alert alert-danger errors-fiddle\">{{ errors }}</div></div><div ng-class=\"{ 'hidden': fiddle.hideOutput }\" class=\"col-sm-6\"><slide-fiddle-output data=\"fiddle\"></slide-fiddle-output></div></div>"
  );


  $templateCache.put('/static/dm-plugins/slide-fiddle/fiddleOutput.html',
    "<input type=\"text\" ng-show=\"fiddle.url\" ng-model=\"fiddle.url.addressTemp\" ng-change=\"updateAddress()\" class=\"form-control\"><iframe class=\"iframe-fiddle-output\"></iframe>"
  );


  $templateCache.put('/static/dm-plugins/slide-jsrunner/slide-jsrunner.html',
    "<div><div class=\"errors alert alert-danger\"></div></div>"
  );


  $templateCache.put('/static/dm-plugins/slide-leftRight/part.html',
    "<div class=\"col-md-{{ size }}\"><plugins-loader namespace=\"'slide'\" context=\"data\"></plugins-loader></div>"
  );


  $templateCache.put('/static/dm-plugins/slide-live-save/slide-live-save.html',
    "<div><div class=\"pull-left rec-start\"><button ng-click=\"startingRecording()\" class=\"btn btn-success btn-xs\"><span class=\"fa fa-flash\"></span></button></div><div class=\"col-md-6\"><progressbar ng-show=\"waiting\" value=\"waitTime\" max=\"maxWaitTime\" animate=\"false\">{{ maxWaitTime - waitTime }}</progressbar></div><div class=\"pull-right\"><label><input type=\"checkbox\" name=\"checkbox\" value=\"value\" ng-model=\"recording\">Recording</label></div></div>"
  );


  $templateCache.put('/static/dm-plugins/slide-microtasks-counter/slide-microtasks-counter.html',
    "<span>[{{ taskInfo.solved }} / {{ taskInfo.total}}]</span>"
  );


  $templateCache.put('/static/dm-plugins/slide-microtasks/microtasks.html',
    "<div class=\"microtasks\"><div ng-repeat=\"task in microtasks\" tooltip-html-unsafe=\"{{ task.hint }}\" tooltip-placement=\"left\" ng-class=\"{'alert-danger': !taskMeta[task.description].completed, 'alert-success': taskMeta[task.description].completed }\" class=\"microtask alert hidden-sm hidden-xs\"><span class=\"microtask-status\"><span ng-show=\"taskMeta[task.description].completed\" class=\"glyphicon glyphicon-ok\"></span><span ng-show=\"!taskMeta[task.description].completed\" class=\"glyphicon glyphicon-question-sign text-warning\"></span></span><span>&nbsp;</span><span ng-bind-html=\"task.description\" class=\"microtask-text\"></span><plugins-loader namespace=\"'microtask'\" context=\"taskMeta[task.description]\"></plugins-loader></div><div ng-repeat=\"task in microtasks\" tooltip-html-unsafe=\"{{ task.description }}\" tooltip-placement=\"left\" ng-class=\"{'alert-danger': !taskMeta[task.description].completed, 'alert-success': taskMeta[task.description].completed }\" class=\"microtask alert visible-xs visible-sm\"><span class=\"microtask-status\"><span ng-show=\"taskMeta[task.description].completed\" class=\"glyphicon glyphicon-ok\"></span><span ng-show=\"!taskMeta[task.description].completed\" class=\"glyphicon glyphicon-question-sign text-warning\"></span></span></div></div>"
  );


  $templateCache.put('/static/dm-plugins/slide-pwyw/slide-pwyw.html',
    "<div><iframe ng-src=\"{{ pwyw_url }}\" class=\"pwyw__iframe\"></iframe></div>"
  );


  $templateCache.put('/static/dm-plugins/slide-serverRunner/slide-serverRunner.html',
    "<div><div ng-show=\"!success\" class=\"errors alert alert-danger\">{{ errors.join(\"\\n\") }}<pre ng-if=\"stacktrace\">{{ stacktrace.join(\"\\n\") }}</pre></div></div>"
  );


  $templateCache.put('/static/dm-plugins/slide-speedDating/slide-speedDating.html',
    "<div><div class=\"row\"><div class=\"col-md-3\"><h2>Let's meet each other!</h2><h2 class=\"text-muted\"><span class=\"fa fa-clock-o\"></span><span>&nbsp;</span><span contenteditable=\"true\" ng-model=\"speedDating.time\">{{ speedDating.time }}</span> min</h2><h2 class=\"text-muted\"><span class=\"fa fa-user\"></span><span>&nbsp;</span><span contenteditable=\"true\" ng-model=\"speedDating.perPerson\">{{ speedDating.perPerson }}</span> s</h2><h4><button ng-click=\"testPlay('voiceSwap')\" class=\"btn btn-success\"><span class=\"fa fa-music\"></span> Swap</button><button ng-click=\"testPlay('newPerson')\" class=\"btn btn-danger\"><span class=\"fa fa-music\"></span> New Person</button></h4><br><button ng-click=\"startDating()\" class=\"btn btn-lg btn-primary\"><span class=\"fa fa-play\"></span><span>Start Dates ({{ interactions }})</span></button></div><div class=\"col-md-9\"><h2 class=\"text-right\">{{ session.left }} changes left</h2><p class=\"speedDating__timer text-success\">{{ session.timeLeft.toFixed(3) }} s</p><div ng-controller=\"VideoDatingController\" class=\"videoDating\"><div ng-model=\"sd.connections\" class=\"connections\">{{sd.connections}}</div><div class=\"videos\"><video autoplay class=\"me\"></video><video autoplay class=\"other\"></video></div></div><div class=\"speedDating__message\"><div ng-show=\"session.type == 0\" class=\"alert alert-danger\">Find New Person!</div><div ng-show=\"session.type == 2\" class=\"alert alert-success\">Voice Swap!</div></div></div></div></div>"
  );


  $templateCache.put('/static/dm-plugins/slide-survey/slide-survey.html',
    "<div ng-hide=\"showPayment\" class=\"container\"><div ng-repeat=\"question in survey.questions\" class=\"row\"><div class=\"col-sm-4 text-right\"><p><h5>{{ question.q }}</h5><span ng-show=\"question.hint\" tooltip=\"{{ question.hint }}\" tooltip-placement=\"right\" class=\"glyphicon glyphicon-info-sign text-info\"></span></p></div><div class=\"col-sm-4\"><p><slider ng-model=\"question.rate\" step=\"1\" floor=\"0\" ceiling=\"10\"></slider></p></div></div><div class=\"row\"><div class=\"col-sm-4 text-right\"><p><h5>Za udział w szkoleniu gotowy byłbym zapłacić [zł]</h5></p></div><div class=\"col-sm-4\"><p><slider ng-model=\"survey.payment\" step=\"1\" floor=\"0\" ceiling=\"90\"></slider></p></div></div><div class=\"row\"><div class=\"col-sm-4\"></div><div class=\"col-sm-4\"><button ng-click=\"sendAnswers()\" class=\"btn btn-lg btn-primary\">Wyślij odpowiedzi</button></div></div></div><div ng-show=\"showPayment\" class=\"alert alert-info\">Dziękujemy za udział w ankiecie</div><div ng-show=\"showPayment\"><slide-pwyw data=\"paymentData\" context=\"slide\"></slide-pwyw></div>"
  );


  $templateCache.put('/static/dm-plugins/slide-task/slide-task.html',
    "<div class=\"row\"><div class=\"col-md-9\"><h1><span class=\"text-success\"><span class=\"glyphicon glyphicon-check\"></span></span> Objectives</h1><ol><li ng-repeat=\"o in task.objectives\"><h4 ng-bind-html=\"o\"></h4></li></ol><h2><span class=\"text-danger\"><span class=\"glyphicon glyphicon-asterisk\"></span></span> Extra objectives</h2><ol><li ng-repeat=\"o in task.extras\"><h4 ng-bind-html=\"o\"></h4></li></ol></div><div class=\"col-md-3\"><h1><span class=\"glyphicon glyphicon-time\"></span> <span class=\"text-warning task-time-left\"><span ng-hide=\"timerState.isRunning\">{{ task.duration }}</span><span ng-show=\"timerState.isRunning\">{{ timerState.timeLeft / 60 / 1000 | number:1 }}</span></span><span class=\"text-warning\">min</span><button tooltip=\"Start task\" ng-click=\"timerState.start()\" ng-hide=\"timerState.isRunning\" class=\"task-start-btn btn btn-default pull-right\"><span class=\"glyphicon glyphicon-play\"></span></button><button tooltip=\"Stop timer\" ng-click=\"timerState.stop()\" ng-show=\"timerState.isRunning\" class=\"task-start-btn btn btn-danger pull-right\"><span class=\"glyphicon glyphicon-stop\"></span></button></h1><hr><h2><span class=\"glyphicon glyphicon-play\"></span> <span class=\"task-start-time\">{{ timerState.startTime | date:'H:mm' }}</span></h2><h2><span class=\"glyphicon glyphicon-pause\"></span> <span class=\"task-end-time\">{{ timerState.endTime | date:'H:mm' }}</span></h2></div></div>"
  );


  $templateCache.put('/static/dm-plugins/slide-toolbar/slide-toolbar.html',
    "<div class=\"slide-toolbar\"><plugins-loader namespace=\"'slide.toolbar'\" context=\"slide\"></plugins-loader></div>"
  );


  $templateCache.put('/static/dm-plugins/slide.edit-editor/editor.html',
    "<div ng-class=\"{ 'collapsed' : collapsed }\" class=\"live-edit\"><button ng-click=\"collapsed = !collapsed\" class=\"btn btn-primary btn-block btn-xs\"><span ng-show=\"collapsed\">show</span><span ng-show=\"!collapsed\">hide</span></button><div class=\"editor editor-live\"></div></div>"
  );


  $templateCache.put('/static/dm-plugins/trainer-participants/trainer-participants.html',
    "<div class=\"trainer-participants\"><ul><li ng-repeat=\"user in users\">{{ user.user.name }} @ {{ user.currentSlide }}<div class=\"btn-group\"><button ng-click=\"follow(user.id)\" ng-class=\"{'btn-default': followUserId !== user.id, 'btn-success': followUserId == user.id}\" class=\"btn\">Follow</button><button ng-if=\"followUserId === user.id\" ng-click=\"goToPrevSlide()\" class=\"btn btn-default\"><i class=\"glyphicon glyphicon-arrow-left\"></i></button><button ng-if=\"followUserId === user.id\" ng-click=\"goToNextSlide()\" class=\"btn btn-default\"><i class=\"glyphicon glyphicon-arrow-right\"></i></button></div></li></ul></div>"
  );


  $templateCache.put('/static/dm-plugins/trainer.deck-nextslide/trainer.html',
    "<div class=\"trainerdeck-nextslide\"><div ng-if=\"followUser.currentSlide\"><h2>Next slide</h2><iframe ng-src=\"{{getSlidePath()}}\" style=\"width: 100%; height: 500px\"></iframe></div></div>"
  );


  $templateCache.put('/static/dm-slider/directives/sidebar-control/sidebar-control.html',
    "<div class=\"text-right\"><button ng-click=\"toggle()\" ng-class=\"{'splitter-btn-fixed': splitter.size === maxSize}\" class=\"btn btn-sm btn-default\"><span ng-show=\"splitter.size === maxSize\" class=\"fa fa-caret-square-o-left\"></span><span ng-hide=\"splitter.size === maxSize\" class=\"fa fa-caret-square-o-right\"></span></button><button ng-click=\"toggleSize()\" class=\"btn btn-sm btn-default\"><span class=\"fa fa-arrows-h\"></span></button></div>"
  );


  $templateCache.put('/static/dm-wavesurfer/dm-wavesurfer.html',
    "<div class=\"dm-waveform\"><div class=\"progress progress-striped active\"><div class=\"progress-bar\"></div></div></div>"
  );


  $templateCache.put('/static/dm-xplatform/controllers/dm-xplatform-chapter/dm-xplatform-chapter-next.html',
    "<div class=\"modal-header\"><h1>Gratulacje</h1></div><div class=\"modal-body\"><p>Właśnie ukonćzyłeś {{content.title}}</p></div><div class=\"modal-footer\"><button ng-click=\"cancel()\" analytics-on=\"click\" analytics-event=\"finished.stay\" class=\"btn btn-default\">Pozostań</button><button ng-click=\"ok()\" analytics-on=\"click\" analytics-event=\"finished.menu\" class=\"btn btn-default\">Menu</button><button ng-click=\"task()\" analytics-on=\"click\" analytics-event=\"finished.task\" class=\"btn btn-success\">Rozwiąż zadanie</button></div>"
  );


  $templateCache.put('/static/dm-xplatform/controllers/dm-xplatform-chapter/dm-xplatform-chapter-open.html',
    "<div class=\"modal-header\"><h1>Otwórz szkolenie</h1></div><div class=\"modal-body chapter-open\"><div class=\"list-group\"><a ng-repeat=\"file in content.files\" ng-click=\"selectFile($index)\" ng-class=\"{active: $index === content.index}\" class=\"list-group-item\"><b>{{file.title}}</b></a></div></div><div class=\"modal-footer\"><button ng-click=\"cancel()\" class=\"btn btn-default\">Anuluj</button><button ng-click=\"ok()\" class=\"btn btn-success\">Otwórz</button></div>"
  );


  $templateCache.put('/static/dm-xplatform/controllers/dm-xplatform-chapter/dm-xplatform-chapter-save.html',
    "<div class=\"modal-header\"><h1>Zapisz jako</h1></div><div class=\"modal-body\"><input type=\"text\" ng-model=\"modalData.saveTitle\" class=\"form-control\"></div><div class=\"modal-footer\"><button ng-click=\"cancel()\" class=\"btn btn-default\">Anuluj</button><button ng-click=\"ok()\" class=\"btn btn-success\">Zapisz</button></div>"
  );


  $templateCache.put('/static/dm-xplatform/controllers/dm-xplatform-chapter/dm-xplatform-chapter.html',
    "<div class=\"player-wrapper\"><plugins-loader namespace=\"'slide'\" context=\"recordingPlayer.slide\"></plugins-loader><div class=\"player-bottombar-wave\"><dm-wavesurfer dm-scroll=\"false\" dm-src=\"chapter.videodata.url\" dm-start-second=\"state.startSecond\" dm-current-second=\"state.currentSecond\" dm-is-playing=\"state.isPlaying\"></dm-wavesurfer></div><nav role=\"navigation\" class=\"navbar navbar-default navbar-fixed-bottom player-bottombar\"><div class=\"navbar-header\"><button type=\"button\" data-toggle=\"collapse\" data-target=\".navbar-inverse-collapse\" class=\"navbar-toggle collapsed\"><span class=\"icon-bar\"></span><span class=\"icon-bar\"></span><span class=\"icon-bar\"></span></button></div><div class=\"navbar-collapse collapse navbar-inverse-collapse\"><div class=\"navbar-left player-center\"><a class=\"navbar-brand\"><span ng-click=\"state.onLeftButtonPressed()\" analytics-on=\"click\" analytics-event=\"bottom.prev\" class=\"fa fa-step-backward cursor-pointer\"></span><span ng-class=\"{'fa-play':!state.isPlaying, 'fa-pause':state.isPlaying}\" ng-click=\"state.isPlaying = !state.isPlaying\" analytics-on=\"click\" analytics-event=\"bottom.playPause\" class=\"fa cursor-pointer\"></span><span ng-click=\"state.onRightButtonPressed()\" analytics-on=\"click\" analytics-event=\"bottom.next\" class=\"fa fa-step-forward cursor-pointer\"></span></a></div></div></nav></div>"
  );


  $templateCache.put('/static/dm-xplatform/controllers/dm-xplatform-devhero/dm-xplatform-devhero.html',
    "<div class=\"col-md-12 dm-devhero-container\"><div class=\"col-md-12\"><p class=\"dm-devhero-name\">{{user.name}}</p><p><img ng-src=\"{{user.avatar | dmGravatar:90}}\"></p></div><div class=\"col-md-12 dm-devhero-buttons\"><button ng-if=\"canBeObserved\" ng-click=\"observe()\" analytics-on=\"click\" analytics-event=\"devhero.observe\" class=\"btn\">Obserwuj</button><button ng-if=\"!canBeObserved\" ng-click=\"unobserve()\" analytics-on=\"click\" analytics-event=\"devhero.unobserve\" class=\"btn\">Zrezygnuj</button></div><div class=\"col-md-12\"><div class=\"dm-devhero-separator\"></div><p>BIO</p><span class=\"dm-devhero-bio\">{{user.bio || \"-\"}}</span><div class=\"dm-devhero-separator\"></div></div></div>"
  );


  $templateCache.put('/static/dm-xplatform/controllers/dm-xplatform-event/dm-xplatform-event.html',
    "<h1>Hello event</h1>"
  );


  $templateCache.put('/static/dm-xplatform/controllers/dm-xplatform-index/xplatform-index.html',
    "<div class=\"col-md-12 col-lg-12 dm-xplatform-index-div\"><div class=\"dm-xplatform-index-left\"><div ui-view=\"left\"></div></div><div class=\"dm-xplatform-index-mid\"><div ui-view=\"mid\"></div></div><div class=\"dm-xplatform-index-right\"><div ui-view=\"right\"></div></div></div>"
  );


  $templateCache.put('/static/dm-xplatform/controllers/dm-xplatform-leftbar/dm-xplatform-leftbar.html',
    "<div class=\"col-md-12 dm-leftbar-container\"><div><p><img ng-src=\"{{user.result.avatar | dmGravatar:35}}\" ui-sref=\"index.devhero({id: user.result._id})\" class=\"dm-leftbar-link\"></p><p ui-sref=\"index.devhero({id: user.result._id})\" class=\"dm-leftbar-link dm-leftbar-name\"><strong>{{user.result.name}}</strong></p><button ng-if=\"user.result.bio === undefined || user.result.bio.length === 0\" ui-sref=\"index.profile\" analytics-on=\"click\" analytics-event=\"left.fillBio\" class=\"btn btn-xs btn-warning\">Uzupełnij BIO</button><p ng-if=\"user.result.bio !== undefined &amp;&amp; user.result.bio.length !== 0\" ui-sref=\"index.profile\" analytics-on=\"click\" analytics-event=\"left.editProfile\" class=\"dm-leftbar-link\">Edytuj profil</p></div><div class=\"list-group\"><a ng-repeat=\"section in sections\" ui-sref=\"{{section.sref}}\" ui-sref-active=\"dm-index-active\" class=\"list-group-item\">{{section.title}}<div class=\"dm-xplatform-bottomstripe\"></div><div class=\"dm-xplatform-bottomstripe\"></div></a></div></div>"
  );


  $templateCache.put('/static/dm-xplatform/controllers/dm-xplatform-message/dm-xplatform-message.html',
    "<div class=\"col-md-offset-1 col-md-10 dm-xplatform-message\"><div class=\"dm-message-title\">Wyślij wiadomość:</div><div class=\"form-group\"><textarea rows=\"5\" class=\"form-control\"></textarea></div></div>"
  );


  $templateCache.put('/static/dm-xplatform/controllers/dm-xplatform-midpanel/dm-xplatform-midpanel.html',
    ""
  );


  $templateCache.put('/static/dm-xplatform/controllers/dm-xplatform-navbar/xplatform-navbar.html',
    "<div role=\"navigation\" class=\"navbar navbar-inverse xplatform-navbar\"><div class=\"navbar-header\"><button type=\"button\" data-toggle=\"collapse\" data-target=\".navbar-inverse-collapse\" class=\"navbar-toggle\"><span class=\"sr-only\">Toggle navigation</span><span class=\"icon-bar\"></span><span class=\"icon-bar\"></span><span class=\"icon-bar\"></span></button></div><div ng-if=\"!xplatformData.navbar.showTitle\" class=\"navbar-center input-search\"><img src=\"static/images/navbar/ico_search.png\" class=\"ico-search\"><input type=\"text\" placeholder=\"Szukaj szkoleń, ludzi, trenerów...\" ng-model=\"xplatformData.navbar.searchText\"><img src=\"static/images/navbar/input_search_triangle.png\" class=\"ico-triangle\"></div><div ng-if=\"xplatformData.navbar.showTitle\" class=\"navbar-center\"><span class=\"nav-title\">{{xplatformData.navbar.title}}</span></div><div class=\"collapse navbar-collapse navbar-inverse-collapse\"><ul class=\"nav navbar-nav navbar-left\"><li><a href=\"#\" analytics-on=\"click\" analytics-event=\"navbar.logo\"><img src=\"static/images/navbar/xplatform_logo.png\"></a></li></ul><ul class=\"nav navbar-nav navbar-right\"><li><img ng-src=\"{{navbar.user.result.avatar | dmGravatar:30}}\" ui-sref=\"index.devhero({id: navbar.user.result._id})\" analytics-on=\"click\" analytics-event=\"navbar.profile.photo\" class=\"avatar-holder\"></li><li><a ui-sref=\"index.devhero({id: navbar.user.result._id})\" analytics-on=\"click\" analytics-event=\"navbar.profile.text\" class=\"ng-cloak\">{{navbar.user.result.name}}</a></li><li><div class=\"dropdown\"><div id=\"dropdownNav\" type=\"button\" data-toggle=\"dropdown\" class=\"dropdown-toggle\"><span class=\"glyphicon glyphicon-cog\"></span></div><ul role=\"menu\" aria-labelledby=\"dropdownNav\" class=\"dropdown-menu\"><li role=\"presentation\"><a ui-sref=\"index.profile\" role=\"menuitem\" tabindex=\"-1\" analytics-on=\"click\" analytics-event=\"navbar.editProfile\">Edytuj profil</a></li><li role=\"presentation\"><a href=\"/logout\" role=\"menuitem\" tabindex=\"-1\" analytics-on=\"click\" analytics-event=\"navbar.logout\">Wyloguj</a></li></ul></div></li></ul></div></div>"
  );


  $templateCache.put('/static/dm-xplatform/controllers/dm-xplatform-observed/dm-xplatform-observed.html',
    "<div class=\"col-md-12 dm-xplatform-observed\"><div class=\"dm-observed-title\">Osoby, które śledzisz</div><div class=\"list-group\"><a ng-repeat=\"user in observed\" ui-sref=\"index.devhero({id: user.userId})\" class=\"list-group-item\"><img ng-src=\"{{user.avatar | dmGravatar:25}}\"><span>{{user.name}}</span><div><div></div></div></a></div></div>"
  );


  $templateCache.put('/static/dm-xplatform/controllers/dm-xplatform-online/dm-xplatform-online.html',
    "<div class=\"col-lg-12 col-md-12 dm-table-container\"><table class=\"table dm-table\"><tr><th>Temat szkolenia</th><th>Data</th><th>Trener</th><th>Zadania</th><th>Uczestnicy</th><th></th></tr></table></div>"
  );


  $templateCache.put('/static/dm-xplatform/controllers/dm-xplatform-options/dm-xplatform-options.html',
    "<div class=\"col-md-offset-1 col-md-10 dm-xplatform-options\"><span>W Twoim profilu możesz edytować swoje dane. Skille, które posiadasz zależą od Twojej reputacji oraz od szkoleń, które wykonałeś.</span></div>"
  );


  $templateCache.put('/static/dm-xplatform/controllers/dm-xplatform-paypageprice/dm-xplatform-paypageprice.html',
    "<div class=\"col-md-12 dm-paypageprice-container\"><div class=\"row\"><div class=\"col-md-12\"><div class=\"paypageprice-progress-holder\"><div class=\"progress\"><div role=\"progressbar\" aria-valuenow=\"{{course.progressbarValue}}\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width: {{course.progressbarValue}}%\" class=\"progress-bar progress-bar-success progress-bar-striped\">{{course.progressbarValue}}</div></div></div></div><div class=\"col-md-12 paypageprice-radio-holder\">Tak, chcę ten kurs zapłacę za niego:<div role=\"toolbar\" class=\"btn-toolbar\"><div class=\"row\"><div class=\"col-md-12 btn-group\"><div class=\"btn-group-sm\"><button class=\"btn btn-primary col-md-4\">10 PLN</button></div><div class=\"btn-group-sm\"><button class=\"btn btn-primary col-md-4 col-md-offset-2\">25 PLN</button></div></div><div class=\"col-md-12 btn-group\"><div class=\"btn-group-sm\"><button class=\"btn btn-primary col-md-4\">50 PLN</button></div><div class=\"btn-group-sm\"><button class=\"btn btn-primary col-md-4 col-md-offset-2\">100 PLN</button></div></div></div><div class=\"row\"><div class=\"col-md-12\"><button type=\"button\" class=\"btn btn-success btn-lg\">Ok</button></div></div></div></div></div></div>"
  );


  $templateCache.put('/static/dm-xplatform/controllers/dm-xplatform-player/dm-xplatform-player-bottombar.html',
    "<div class=\"player-bottombar-wave\"><dm-wavesurfer dm-scroll=\"false\" dm-src=\"chapter.videodata.url\" dm-start-second=\"state.startSecond\" dm-current-second=\"state.currentSecond\" dm-is-playing=\"state.isPlaying\"></dm-wavesurfer></div><nav role=\"navigation\" class=\"navbar navbar-default navbar-fixed-bottom player-bottombar\"><div class=\"navbar-header\"><button type=\"button\" data-toggle=\"collapse\" data-target=\".navbar-inverse-collapse\" class=\"navbar-toggle collapsed\"><span class=\"icon-bar\"></span><span class=\"icon-bar\"></span><span class=\"icon-bar\"></span></button></div><div class=\"navbar-collapse collapse navbar-inverse-collapse\"><div class=\"navbar-left player-center\"><a class=\"navbar-brand\"><span ng-click=\"state.onLeftButtonPressed()\" analytics-on=\"click\" analytics-event=\"bottom.prev\" class=\"fa fa-step-backward cursor-pointer\"></span><span ng-class=\"{'fa-play':!state.isPlaying, 'fa-pause':state.isPlaying}\" ng-click=\"state.isPlaying = !state.isPlaying\" analytics-on=\"click\" analytics-event=\"bottom.playPause\" class=\"fa cursor-pointer\"></span><span ng-click=\"state.onRightButtonPressed()\" analytics-on=\"click\" analytics-event=\"bottom.next\" class=\"fa fa-step-forward cursor-pointer\"></span></a></div></div></nav>"
  );


  $templateCache.put('/static/dm-xplatform/controllers/dm-xplatform-player/dm-xplatform-player-navi.html',
    "<div class=\"player-navi\"><div class=\"list-group\"><a ng-class=\"{active: $index === state.chapterId}\" ng-repeat=\"chapter in training.chapters\" ng-click=\"goToChapter($index)\" class=\"list-group-item\"><span class=\"pull-right\"></span>{{chapter.title}}</a></div></div>"
  );


  $templateCache.put('/static/dm-xplatform/controllers/dm-xplatform-player/dm-xplatform-player.html',
    "<div ui-view=\"chapter\"></div>"
  );


  $templateCache.put('/static/dm-xplatform/controllers/dm-xplatform-profile/dm-xplatform-profile.html',
    "<div class=\"col-md-offset-2 col-md-8 dm-xplatform-profile\"><form class=\"form-horizontal\"><fieldset><div class=\"form-group\"><span control-label=\"control-label\" class=\"col-md-2\">Nazwa</span><div class=\"col-md-10\"><input type=\"text\" ng-model=\"editedUser.name\" class=\"form-control\"></div></div><div class=\"form-group\"><span control-label=\"control-label\" class=\"col-md-2\">Email</span><div class=\"col-md-10\"><input type=\"text\" ng-model=\"editedUser.email\" class=\"form-control\"></div></div><div class=\"form-group\"><span control-label=\"control-label\" class=\"col-md-2\">BIO</span><div class=\"col-md-10\"><textarea rows=\"3\" ng-model=\"editedUser.bio\" class=\"form-control\"></textarea></div></div><div class=\"form-group\"><div class=\"col-md-offset-2 col-md-10\"><button ng-click=\"save()\" analytics-on=\"click\" analytics-event=\"profile.save\" class=\"btn pull-right\">Zapisz</button></div></div></fieldset></form></div>"
  );


  $templateCache.put('/static/dm-xplatform/controllers/dm-xplatform-slide/dm-xplatform-slide.html',
    "<div ng-init=\"$root.modes.isTaskMode=true\" class=\"col-md-12\"><plugins-loader namespace=\"'slide'\" context=\"slide.content\"></plugins-loader></div>"
  );


  $templateCache.put('/static/dm-xplatform/controllers/dm-xplatform-stream/dm-xplatform-stream.html',
    "<div class=\"col-md-offset-1 col-md-10 dm-xplatform-stream\"><div class=\"list-group\"><div ng-repeat=\"activity in stream.result\" ng-init=\"details = detailsForActivity(activity)\" class=\"list-group-item\"><img ng-src=\"{{activity.owner.avatar | dmGravatar: 30}}\" ui-sref=\"index.devhero({id: activity.owner.userId})\" analytics-on=\"click\" analytics-event=\"stream.user.img\"><a ui-sref=\"index.devhero({id: activity.owner.userId})\" analytics-on=\"click\" analytics-event=\"stream.user.name\" class=\"dm-stream-blue\">{{activity.owner.name}}&nbsp;</a><span>{{details.text}}&nbsp;</span><a ui-sref=\"{{details.link}}\" analytics-on=\"click\" analytics-event=\"stream.details\" class=\"dm-stream-green\">{{details.title}}</a><p am-time-ago=\"{{activity._id | dmMongotime}}\" class=\"dm-stream-time\"></p><div><div></div></div></div></div></div>"
  );


  $templateCache.put('/static/dm-xplatform/controllers/dm-xplatform-table/dm-xplatform-table.html',
    "<div class=\"col-lg-12 col-md-12 dm-table-container\"><table class=\"table dm-table\"><tr><th>Temat szkolenia</th><th>Technologia</th><th>Ukonczyli tutorial</th></tr><tr ng-repeat=\"event in events | filter: xplatformData.navbar.searchText | orderBy: &quot;title&quot;\"><td><div class=\"dm-table-slides\"><a ng-repeat=\"slide in event.slides\" ui-sref=\"index.task({id: slide.slideId, event: event._id})\" analytics-on=\"click\" analytics-event=\"table.microtask\" analytics-label=\"{{slide.slideId}}\" analytics-category=\"{{event.title}}\"><i ng-if=\"!slideIsFinished(slide, user)\" class=\"fa fa-circle-o dm-table-gray\"></i><i ng-if=\"slideIsFinished(slide, user)\" class=\"fa fa-circle dm-table-green\"></i></a></div><a ui-sref=\"index.player.chapter({id: event.trainingId, index: &quot;0&quot;, event: event._id})\" analytics-on=\"click\" analytics-event=\"table.tutorial\" analytics-category=\"{{event.title}}\" class=\"dm-table-blue\">{{event.title}}</a></td><td><a class=\"dm-table-green\">{{event.technology}}</a></td><td class=\"dm-table-avatars\"><div><img ng-repeat=\"user in event.peopleFinished.slice().reverse() | limitTo: 4\" ng-src=\"{{user.avatar | dmGravatar:25}}\" ui-sref=\"index.devhero({id: user.userId})\" analytics-on=\"click\" analytics-event=\"table.user\" analytics-category=\"{{event.title}}\" analytics-label=\"{{user.userId}}\"><span ng-if=\"event.peopleFinished.length &gt; 4\" ng-click=\"showUsers(event.peopleFinished)\" analytics-on=\"click\" analytics-event=\"table.showMore\" analytics-category=\"{{event.title}}\">+ {{event.peopleFinished.length - 4}}</span></div></td></tr></table></div>"
  );


  $templateCache.put('/static/dm-xplatform/controllers/dm-xplatform-technology/dm-xplatform-technology.html',
    "<h1>Hello technology!</h1>"
  );


  $templateCache.put('/static/dm-xplatform/controllers/dm-xplatform-users/dm-xplatform-users.html',
    "<div class=\"modal-header\"><span class=\"dm-users-header\">Ukończyli tutorial</span></div><div class=\"modal-body dm-users\"><div class=\"list-group\"><a ng-repeat=\"user in users | orderBy: &quot;name&quot;\" ng-click=\"showUser(user)\" class=\"list-group-item\"><img ng-src=\"{{user.avatar | dmGravatar:35}}\"><span ng-if=\"user.name\">{{user.name}}</span><span ng-if=\"!user.name\">NO NAME</span></a></div></div><div class=\"modal-footer dm-users-footer\"><button ng-click=\"close()\" class=\"btn btn-default\">Zamknij</button></div>"
  );


  $templateCache.put('/static/dm-xplatform/controllers/dm-xplatform-video/dm-xplatform-video.html',
    "<h1>Hello Video!</h1>"
  );


  $templateCache.put('/static/dm-xplatform/controllers/dm-xplatform-workshopdesc/dm-xplatform-workshopdesc.html',
    "<div class=\"col-md-12\"><div class=\"dm-workshopdesc-container\"><div class=\"row\"><div class=\"col-md-12\"><img ng-src=\"{{course.image}}\" class=\"img-responsive displayed\"></div></div><div class=\"row\"><div class=\"col-md-12\"><div class=\"dm-title\"><h4></h4>{{course.title}}</div><div class=\"dm-workshopdesc-separator\"></div><p marked=\"course.description\">{{course.description}}</p></div></div></div></div>"
  );


  $templateCache.put('/static/dm-xplatform/controllers/dm-xplatform-workshoplist/dm-xplatform-workshoplist.html',
    "<div class=\"col-md-12\"><div class=\"dm-workshoplist-container\"><div class=\"row\"><div class=\"col-md-12\"><div class=\"form-group\"><div class=\"ico-holder\"><img src=\"static/images/navbar/ico_search.png\" class=\"ico-sub ico-search-course\"></div><input type=\"text\" ng-model=\"filter.by\" placeholder=\"wpisz kurs\" class=\"form-control form-login\"></div></div></div><div class=\"row\"><div class=\"col-md-12\"><div class=\"btn-group btn-group-justified\"><div ng-repeat=\"f in filters\" class=\"btn-group\"><button ng-class=\"{active: filter.by === f.value}\" ng-click=\"filter.by=f.value\" analytics-on=\"click\" analytics-event=\"courses.changeFilter\" analytics-label=\"{{f.name}}\" class=\"btn btn-default btn-xs\">{{ f.name }}</button></div></div></div><div class=\"col-md-12\"><div class=\"dm-title\"><h4>Dostępne kursy</h4></div></div><div ng-repeat=\"cours in courses|filter:filter.by\" class=\"col-md-4 col-sm-4\"><div class=\"workshoplist-col\"><div ng-if=\"cours.isReady\" tooltip=\"Ten kurs jest już dostępny na platformie!\" class=\"workshoplist-icon text-success\"><span class=\"fa fa-check-circle\"></span></div><div class=\"workshoplist-thumb\"><a ui-sref=\"index.coursesDesc({id: cours.id})\" ng-if=\"!cours.isReady\" analytics-on=\"click\" analytics-event=\"courses.go\" analytics-label=\"{{cours.title}}\"><img ng-src=\"{{cours.image}}\" class=\"img-responsive workshoplist-img\"></a><a ui-sref=\"index.menu({type: &quot;video&quot;})\" ng-if=\"cours.isReady\" analytics-on=\"click\" analytics-event=\"courses.go\" analytics-label=\"{{cours.title}}\"><img ng-src=\"{{cours.image}}\" class=\"img-responsive workshoplist-img\"></a></div><div class=\"workshopdesc-detailsholder\"><div class=\"workshoplist-details\"><h4><a ui-sref=\"index.coursesDesc({id: cours.id})\" ng-if=\"!cours.isReady\" analytics-on=\"click\" analytics-event=\"courses.go\" analytics-label=\"{{cours.title}}\">{{cours.title}}</a><a ui-sref=\"index.menu({type: &quot;video&quot;})\" ng-if=\"cours.isReady\" analytics-on=\"click\" analytics-event=\"courses.go\" analytics-label=\"{{cours.title}}\">{{cours.title}}</a></h4><p>{{ cours.description.substr(0, 100) }}...</p></div></div></div></div></div></div></div>"
  );

}]);
});