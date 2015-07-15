/* jshint esnext:true,-W097 */

'use strict';

import 'angular-ui-router';

import bootstrap from 'slider/bootstrap';
import xplatformApp from 'dm-xplatform/xplatform-app';

import 'dm-xplatform/controllers/dm-xplatform-navbar/xplatform-navbar';
import 'dm-xplatform/controllers/dm-xplatform-index/xplatform-index';
import 'dm-xplatform/controllers/dm-xplatform-trainer/dm-xplatform-trainer';
import 'dm-xplatform/controllers/dm-xplatform-player/dm-xplatform-player';
import 'dm-xplatform/controllers/dm-xplatform-devhero/dm-xplatform-devhero';
import 'dm-xplatform/controllers/dm-xplatform-profile/dm-xplatform-profile';
import 'dm-xplatform/controllers/dm-xplatform-slide/dm-xplatform-slide';
import 'dm-xplatform/controllers/dm-xplatform-options/dm-xplatform-options';
import 'dm-xplatform/controllers/dm-xplatform-workshoplist/dm-xplatform-workshoplist';
import 'dm-xplatform/controllers/dm-xplatform-login/dm-xplatform-login';
import 'dm-xplatform/controllers/dm-xplatform-register/dm-xplatform-register';
import 'dm-xplatform/controllers/dm-xplatform-space/dm-xplatform-space';
import 'dm-xplatform/controllers/dm-xplatform-todo/dm-xplatform-todo';
import 'dm-xplatform/controllers/dm-xplatform-question/dm-xplatform-question';
import 'dm-xplatform/controllers/dm-xplatform-question-answer/dm-xplatform-question-answer';
import 'dm-xplatform/controllers/dm-xplatform-question-create/dm-xplatform-question-create';
import 'dm-xplatform/controllers/dm-xplatform-deck/dm-xplatform-deck';
import 'dm-xplatform/controllers/dm-xplatform-deck-slide/dm-xplatform-deck-slide';
import 'dm-xplatform/controllers/dm-xplatform-agenda/dm-xplatform-agenda';
import 'dm-xplatform/controllers/dm-xplatform-history/dm-xplatform-history';

import registerView from './controllers/dm-xplatform-register/dm-xplatform-register.html!text';
import loginView from './controllers/dm-xplatform-login/dm-xplatform-login.html!text';
import navbarView from './controllers/dm-xplatform-navbar/xplatform-navbar.html!text';
import indexView from './controllers/dm-xplatform-index/xplatform-index.html!text';
import privacyView from './controllers/dm-xplatform-privacy/dm-xplatform-privacy.html!text';
import devheroView from './controllers/dm-xplatform-devhero/dm-xplatform-devhero.html!text';
import workshoplistView from './controllers/dm-xplatform-workshoplist/dm-xplatform-workshoplist.html!text';
import profileView from './controllers/dm-xplatform-profile/dm-xplatform-profile.html!text';
import optionsView from './controllers/dm-xplatform-options/dm-xplatform-options.html!text';
import spaceView from './controllers/dm-xplatform-space/dm-xplatform-space.html!text';
import agendaView from './controllers/dm-xplatform-agenda/dm-xplatform-agenda.html!text';
import deckSlideView from './controllers/dm-xplatform-deck-slide/dm-xplatform-deck-slide.html!text';
import slideView from './controllers/dm-xplatform-slide/dm-xplatform-slide.html!text';
import historyView from './controllers/dm-xplatform-history/dm-xplatform-history.html!text';
import todoView from './controllers/dm-xplatform-todo/dm-xplatform-todo.html!text';
import deckView from './controllers/dm-xplatform-deck/dm-xplatform-deck.html!text';
import playerView from './controllers/dm-xplatform-player/dm-xplatform-player.html!text';
import trainerView from './controllers/dm-xplatform-trainer/dm-xplatform-trainer.html!text';

function contextMenu (tabs) {
  var tpl = ['<dm-xplatform-context',
    'opened="opened"',
    'event="event"',
    'user="user"',
    'is-edit-mode="$root.editMode"'
  ];
  if (tabs) {
    tabs = JSON.stringify(tabs);
    tpl.push("with='" + tabs + "'");
  }
  return {
    template: tpl.join(' ') + '></dm-xplatform-context>'
  };
}

function xplaMenu () {
  return {
    template: '<dm-xplatform-menu user-workspace-id="workspaceId" opened="right.opened" event="event" user="user"></dm-xplatform-menu>'
  };
}

function forward () {
  return {
    template: '<div class="full-height ui-view-animate" ui-view="content"></div>'
  };
}

xplatformApp.run(['$rootScope', '$state', '$modal', '$location', 'dmUser', '$window',
  function ($rootScope, $state, $modal, $location, dmUser, $window) {
    $rootScope.$on('$stateChangeStart', function (event, toState) {
      if (toState.name === 'redirect') {
        var destination = $window.localStorage.redirectUrl || '/';
        $window.location.href = destination;
        return;
      }

      if (toState.anonymous || dmUser.isLoggedIn()) {
        return;
      }

      event.preventDefault();

      $window.localStorage.redirectUrl = $location.$$absUrl;
      if (toState.anonymousForceRegister) {
        $modal.open({
          template: registerView,
          controller: 'dmXplatformRegister',
          size: 'sm',
          windowClass: 'login-modal'
        });
        return;
      }

      $modal.open({
        template: loginView,
        controller: 'dmXplatformLogin',
        size: 'sm',
        windowClass: 'login-modal'
      });
    });

    $rootScope.onEditModeSave = function (scope, func) {
      var off = $rootScope.$watch('editMode', function (newVal, oldVal) {
        if (newVal === oldVal || newVal) {
          return;
        }
        func();
      });
      scope.$on('$destroy', off);
    };

  }
]);

xplatformApp.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
  $locationProvider.html5Mode(true);

  $stateProvider.state('redirect', {
    url: '/redirect'
  });

  $stateProvider.state('index', {
    views: {
      navbar: {
        template: navbarView,
        controller: 'XplatformNavbarCtrl'
      },
      content: {
        template: indexView,
        controller: 'XplatformIndexCtrl'
      }
    },
    onEnter: function ($rootScope, dmBrowserTab) {
      dmBrowserTab.setTitleAndIcon('XPlatform', 'xplatform');
      $rootScope.xplatformData = {
        navbar: {},
        columns: {}
      };
    }
  });

  $stateProvider.state('index.login', {
    anonymous: false,
    url: '/login',
    views: {
      left: {
        template: loginView
      }
    },
    onEnter: function ($rootScope, dmBrowserTab) {
      dmBrowserTab.setTitleAndIcon('Login');
      $rootScope.xplatformData.navbar = {
        showTitle: true,
        title: 'Log in',
        searchText: ''
      };
      $rootScope.xplatformData.columns = {
        left: 12,
        mid: 0,
        right: 0
      };
    }
  });

  $stateProvider.state('index.register', {
    anonymous: false,
    anonymousForceRegister: true,
    url: '/register',
    views: {
      right: {
        template: registerView
      }
    },
    onEnter: function ($rootScope, dmBrowserTab) {
      dmBrowserTab.setTitleAndIcon('Register');
      $rootScope.xplatformData.navbar = {
        showTitle: true,
        title: 'Register',
        searchText: ''
      };
      $rootScope.xplatformData.columns = {
        left: 0,
        mid: 0,
        right: 12
      };
    }
  });

  $stateProvider.state('index.privacy', {
    anonymous: true,
    url: '/privacy',
    views: {
      left: {
        template: privacyView
      }
    },
    onEnter: function ($rootScope, dmBrowserTab) {
      dmBrowserTab.setTitleAndIcon('Polityka Prywatności');
      $rootScope.xplatformData.navbar = {
        title: 'Polityka prywatności',
        showTitle: true,
        searchText: ''
      };
      $rootScope.xplatformData.columns = {
        left: 12,
        mid: 0,
        right: 0
      };
    }
  });

  $stateProvider.state('index.devhero', {
    url: '/devhero/:id',
    views: {
      left: {
        template: devheroView,
        controller: 'dmXplatformDevhero'
      }
    },
    onEnter: function ($rootScope) {
      $rootScope.xplatformData.columns = {
        left: 12,
        mid: 0,
        right: 0
      };
    }
  });

  $stateProvider.state('index.courses', {
    anonymous: true,
    url: '/courses',
    views: {
      mid: {
        template: workshoplistView,
        controller: 'dmXplatformWorkshoplist as vmWorkshoplist'
      }
    },
    onEnter: function ($rootScope, dmBrowserTab) {
      dmBrowserTab.setTitleAndIcon('Courses');
      $rootScope.xplatformData.navbar = {
        showTitle: true,
        title: 'Workshops',
        searchText: ''
      };
      $rootScope.xplatformData.columns = {
        left: 0,
        mid: 12,
        right: 0
      };
    }
  });

  $stateProvider.state('index.profile', {
    url: '/profile',
    views: {
      left: {
        template: profileView,
        controller: 'dmXplatformProfile'
      },
      mid: {
        template: optionsView
      }
    },
    onEnter: function ($rootScope, dmBrowserTab) {
      dmBrowserTab.setTitleAndIcon('Profile');
      $rootScope.xplatformData.navbar = {
        showTitle: true,
        title: 'Edycja profilu',
        searchText: ''
      };
      $rootScope.xplatformData.columns = {
        left: 8,
        mid: 4,
        right: 0
      };
    }
  });

  $stateProvider.state('index.space', {
    url: '/space/:event',
    views: {
      mid: {
        template: spaceView,
        controller: 'dmXplatformSpace'
      }
    },
    onEnter: function ($rootScope) {
      $rootScope.xplatformData.columns = {
        left: 0,
        mid: 12,
        right: 0
      };
      $rootScope.headerHidden = true;
    },
    onExit: function ($rootScope) {
      $rootScope.headerHidden = false;
    }
  });

  $stateProvider.state('index.space.learn', {
    url: '/learn',
    views: {
      content: forward(),
      context: xplaMenu()
    }
  });

  $stateProvider.state('index.space.collaborate', {
    url: '/collaborate',
    views: {
      content: forward(),
      context: xplaMenu()
    }
  });

  $stateProvider.state('index.space.trainer', {
    url: '/trainer',
    views: {
      content: forward(),
      context: xplaMenu()
    }
  });

  $stateProvider.state('index.space.learn.agenda', {
    url: '/agenda',
    views: {
      content: {
        template: agendaView,
        controller: 'dmXplatformAgenda'
      }
    }
  });

  $stateProvider.state('index.space.learn.slide', {
    url: '/slide/:slide',
    views: {
      content: {
        template: deckSlideView,
        controller: 'dmXplatformDeckSlide'
      },
      context: contextMenu()
    }
  });

  $stateProvider.state('index.space.collaborate.question', {
    url: '/question/:slide?parent',
    views: {
      content: {
        template: slideView,
        controller: 'dmXplatformSlide'
      },
      context: contextMenu(['questions', 'notes', 'history'])
    }
  });

  var workspace = {
    url: '/workspace/:slide',
    views: {
      content: {
        template: slideView,
        controller: 'dmXplatformSlide'
      },
      context: contextMenu(['questions', 'notes', 'history'])
    }
  };
  $stateProvider.state('index.space.learn.workspace', JSON.parse(JSON.stringify(workspace)));
  $stateProvider.state('index.space.collaborate.workspace', workspace);

  $stateProvider.state('index.space.learn.workspace.task', {
    url: '/task/:iteration/:todo'
  });

  $stateProvider.state('index.space.collaborate.history', {
    url: '/history/:historyId',
    views: {
      content: {
        template: historyView,
        controller: 'dmXplatformHistory'
      },
      context: contextMenu(['history', 'notes'])
    }
  });

  $stateProvider.state('index.space.collaborate.watch', {
    url: '/watch/:slide',
    views: {
      content: {
        template: slideView,
        controller: 'dmXplatformSlide'
      },
      context: contextMenu(['notes', 'history'])
    }
  });

  $stateProvider.state('index.space.learn.todo', {
    url: '/todo/:iteration/:todo',
    views: {
      content: {
        template: todoView,
        controller: 'dmXplatformTodo'
      },
      context: contextMenu()
    }
  });

  $stateProvider.state('index.space.learn.deck', {
    url: '/deck/:iteration/:deck?from&to&name',
    views: {
      content: {
        template: deckView,
        controller: 'dmXplatformDeck'
      },
      context: contextMenu()
    }
  });

  $stateProvider.state('index.space.learn.player', {
    url: '/player/:iteration/:material?withVoice',
    views: {
      content: {
        template: playerView,
        controller: 'dmXplatformPlayer'
      },
      context: contextMenu(['notes'])
    }
  });

  $stateProvider.state('index.space.trainer.users', {
    url: '/users',
    views: {
      content: {
        template: trainerView,
        controller: 'dmXplatformTrainer'
      },
      context: contextMenu(['questions', 'chat'])
    }
  });

  $stateProvider.state('index.space.trainer.history', {
    url: '/history/:historyId',
    views: {
      content: {
        template: historyView,
        controller: 'dmXplatformHistory'
      },
      context: contextMenu(['history', 'notes'])
    }
  });

  $stateProvider.state('index.space.trainer.watch', {
    url: '/watch/:slide',
    views: {
      content: {
        template: slideView,
        controller: 'dmXplatformSlide'
      },
      context: contextMenu(['history', 'notes'])
    }
  });

  $urlRouterProvider.when('/', '/courses');
  $urlRouterProvider.otherwise('/courses');
});

bootstrap('xplatform');
