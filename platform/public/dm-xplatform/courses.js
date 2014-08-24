define(['xplatform/xplatform-app'], function(xplatformApp) {

    xplatformApp.factory('Courses', function() {
        var img = function(img) {
            return "static/images/workshopdesc/" + img + ".jpg";
        };
        var multiline = function(func) {
            var f = func.toString();
            var start = f.indexOf('/*-') + 3;
            return f.substr(start, f.indexOf('-*/') - start);
        };
        return {
            getCourseById: function(id) {
                return this.courses.filter(function(x) {
                    return x.id == id;
                })[0];
            },
            courses: [{
                id: 'ampersand',
                tags: ['ampersand', 'backbone', 'react', 'web', 'mvc', 'js'],
                title: 'Ampersand.js - następca Backbone’a?',
                description: multiline(function() {
                    /*-
* Co wnosi Ampersand.js?
* Czym różni się od Backbone?
* W jaki sposób budować aplikacje oparte o Ampersand.js.
* Porównanie Ampersand.js do AngularJS i React
                -*/
                }),
                image: img('ampersandjs'),
                progressbarValue: 3
            }, {
                id: 'angular-directives',
                tags: ['angular', 'directives', 'web', 'js', 'mvc'],
                order: -1,
                status: 'captured',
                title: 'Dyrektywy w AngularJS',
                description: multiline(function() {
                    /*-
Dyrektywy w AngularJS są klejem pomiędzy modelem a drzewem DOM.

* Dowiedz się jak zbudowane są wewnątrzne dyrektywy takie jak `ngClick` i `ngModel`.
* Przekonaj się dlaczego warto izolować `scope` dyrektyw.
* Naucz się pisać dyrektywy dla własnych komponentów.
* Zobacz jak zintegrować plugin jQuery w postaci dyrektywy.
                -*/
                }),
                image: img('angular_directives'),
                progressbarValue: 91
            }, {
                id: 'ember',
                tags: ['ember', 'angular', 'backbone', 'js', 'web', 'mvc'],
                title: 'Ember.js vs AngularJS vs Backbone.js',
                description: multiline(function() {
                    /*-
Obecnie w świecie JSowym dostępnych jest sporo rozwiązań realizujących wzorzec MV*.

Dowiedz się:

* którego frameworku użyć w kolejnym projekcie,
* czy warto korzystać z frameworku MV*,
* jak do wymienionych frameworków ma się React,
* czym jest Two-Way Binding,
* do jakich zastosowań nadaje się każdy z nich,

Dla każdego frameworku przeanalizujemy przykłady aplikacji, w których sprawdza się najlepiej.
                -*/
                }),
                image: img('angular_ember_backbone'),
                progressbarValue: 14
            }, {
                id: 'angular-forms',
                order: -1,
                tags: ['js', 'angular', 'web', 'forms', 'html5'],
                status: 'captured',
                title: 'Formularze w AngularJS',
                description: multiline(function() {
                    /*-
Na kursie wykorzystamy walidację formularzy, którą oferuje AngularJS do stworzenia ekranu rejestracji.

Dowiemy się jak można określić czy formularz jest wypełniony poprawnie oraz zastosujemy Bootstrapa
do wyświetlenia błędów walidacji.

* Walidacja `minLength` i `maxLength`
* Walidacja za pomocą regexpa
* Walidacje pól typu `email` i `number`
                    -*/
                }),
                progressbarValue: 91,
                image: img('angular_forms')
            }, {
                id: 'angular-intro',
                order: -2,
                tags: ['js', 'angular', 'web'],
                title: 'Wprowadzenie do AngularJS',
                status: 'ready',
                description: multiline(function() {
                    /*-
Podstawy AngularJS

* Expressions
* Kontrolery
* `ngRepeat`
* Filtry: `filter`, `orderBy` i `limitTo`
* Kontrola widoczności i wyglądu: `ngClass` i `ngShow`
                    -*/
                }),
                progressbarValue: 100,
                image: img('angular_intro')
            }, {
                id: 'angular-route',
                order: -1,
                tags: ['js', 'angular', 'route'],
                status: 'captured',
                title: 'Routing w AngularJS',
                description: multiline(function() {
                    /*-
Dowiedz się jak zarządzać ekranami w Single Page Application opartej o AngularJS.

* Jak wykorzystać URLe do zmieniania widoku
* Jak mapować routing do kontrolerów i template'ów.
* Jak parametryzować URLe i odbierać parametry w kontrolerach.

                    -*/
                }),
                progressbarValue: 91,
                image: img('angular_route')
            }, {
                id: 'angular-uiRouter',
                order: -1,
                title: 'Zaawansowany routing w AngularJS z użyciem uiRouter',
                tags: ['angular', 'js', 'route', 'ui'],
                description: multiline(function() {
                    /*-
Poznaj jak zarządzać stanami Twojej aplikacji z użyciem `uiRouter`.

* Jaką przewagę `uiRouter` ma nad `ngRoute`?
* Jak definiować stany i URLe?
* Jak tworzyć linki do określonego stanu.
* Jak parametryzować stany.

                    -*/
                }),
                progressbarValue: 3,
                image: img('angular_route')
            }, {
                id: 'angular-services',
                order: -1,
                status: 'captured',
                tags: ['angular', 'js', 'web', 'service'],
                title: 'Serwisy w AngularJS',
                description: multiline(function() {
                    /*-
* W jaki sposób można tworzyć serwisy w Angularze i do czego je wykorzystywać?
* Jak radzić sobie z dużymi aplikacjami w AngularJS?
* Jak organizować  i porządkować kod w aplikacji.
* Czym są `promise`?

                    -*/
                }),
                progressbarValue: 91,
                image: img('angular_services')
            }, {
                id: 'angular-nobackend',
                tags: ['angular', 'backend', 'js', 'production', 'api', 'web', 'spa'],
                title: 'Pisanie bezbackendowych apek w AngularJS',
                description: multiline(function() {
                    /*-

Czy potrzebujemy backendu? W jaki sposób możemy pisać aplikacje webowe z wykorzystaniem API udostępnianych przez zewnętrzne serwisy.

* Obsługa persystencji (baz danych)
* Autentykacja / Autoryzacja
* Gdzie hostować statyczny frontend?
* Obsługa aplikacji offline - `manifest`, `ServiceWorker`

                    -*/
                }),
                image: img('angular_intro'),
                progressbarValue: 23
            }, {
                id: 'backbone',
                tags: ['backbone', 'web', 'js', 'production', 'spa', 'mvc'],
                title: 'Backbone.js - produkcyjne pisanie SPA',
                description: multiline(function() {
                    /*-
* Jak wygląda “produkcyjna” praca w Backbone.js?
* Jak organizować kod, z jakich korzystać pluginów?
* Jak radzić sobie z rosnącymi zależnościami i błędami programistów?
* Jakich narzędzi używać do szukania błędów i poprawiania wydajności.
* Przedstawienie zestawu dobrych praktyk do zaaplikowania w swoich rozwiązaniach.

                    -*/
                }),
                image: img('backbone'),
                progressbarValue: 90
            }, {
                id: 'bootstrap',
                tags: ['bootstrap', 'rwd', 'web', 'html'],
                title: 'Budowanie interfejsów z użyciem Twitter Bootstrap',
                description: multiline(function() {
                    /*-
* Dlaczego warto nauczyć się Bootstrapa?
* Omówienie dostępnych komponentów i filozofi Bootstrapa.
* RWD z użyciem Bootstrapa.
* Tworzenie `themes` - własny wygląd.
* Jak nazywać własne klasy aby nie konfliktować z Nootstrapem?

                    -*/
                }),
                image: img('bootstrap'),
                progressbarValue: 9
            }, {
                id: 'cassandra',
                tags: ['nosql', 'db', 'cassandra'],
                title: 'Modelowanie danych dla Apache Cassandra',
                description: multiline(function() {
                    /*-
* Jak wygląda modelowanie danych dla Cassandry? 
* Czym różni się Cassandra od MongoDB.
* Do jakich zastosowań możemy stosować Cassandrę?
* Porównanie wydajności Cassandy, MongoDB i SQL w różnych zastosowaniach.

                    -*/
                }),
                image: img('cassandra'),
                progressbarValue: 0
            }, {
                id: 'erlang-oo',
                tags: ['erlang', 'functional', 'oo'],
                title: 'Podstawy Erlanga dla obiektowców',
                description: multiline(function() {
                    /*-
Wstęp z języka Erlang dla programistów języków obiektowych.

* Opis podejścia funkcyjnego - brak efektów ubocznych
* Procesy i komunikacja między nimi
* Hot Reload
* Unit testing
* Production deployment

                    -*/
                }),
                image: img('erlang'),
                progressbarValue: 16
            }, {
                id: 'erlang-node',
                title: 'Erlang dla node’owców',
                tags: ['erlang', 'functional', 'node', 'js'],
                description: multiline(function() {
                    /*-
Co wspólnego mają ze sobą Erlang i Nodejs?

* W jaki sposób przenieść aplikację nodejs do Erlanga.
* Interkomunikacja Erlang <> Nodejs
* Co może dać Erlang?
                    -*/
                }),
                image: img('erlang_node'),
                progressbarValue: 6
            }, {
                id: 'express',
                tags: ['express', 'node', 'js', 'web'],
                title: 'Aplikacje webowe w Express',
                description: multiline(function() {
                    /*-
Kurs budowania aplikacji webowych w oparciu o framework Express.

* Jak zorganizować kod aplikacji?
* Co daje nam full stack JavaScript?
* Jak współdzielić kod między frontendem i backendem?
* Jak tworzyć RESTowe API?

                    -*/
                }),
                image: img('express'),
                progressbarValue: 55
            }, {
                id: 'haskell',
                tags: ['haskell', 'functional', 'js'],
                title: 'Haskell dla JavaScriptowców Funkcyjnych',
                description: multiline(function() {
                    /*-

* Dogłębne zrozumienie koncepcji dostępnych w JS na przykładzie języka Haskell.
* Co wspólnego mają ze sobą Haskell i JavaScript?
* Porównanie rozwiązań problemów w obu językach.

                    -*/
                }),
                image: img('haskell_js'),
                progressbarValue: 40
            }, {
                id: 'java-8',
                tags: ['java', 'lambda', 'functional'],
                title: 'Programowanie funkcyjne w Java 8',
                description: multiline(function() {
                    /*-
Myślisz o przesiadce na Javę 8? Zobacz co ciekawego niesie ze sobą ten rewolucyjny update!

* Lambdy w Java 8.
* Jak korzystać ze Stream API?
* Nowe API do czasu i dat.
* Nowe możliwości a wydajność.

                    -*/
                }),
                progressbarValue: 11,
                image: img('java_18_lambda')
            }, {
                id: 'javascript-oop',
                tags: ['js', 'oop', 'web'],
                title: 'Programowanie obiektowe w JS',
                description: multiline(function() {
                    /*-
Programowanie obiektowe dla zaawansowanych JavaSkryptowców.

* `module` pattern
* Organizacja kodu w namespace'y
* Implementacja klas i dziedziczenia.

                    -*/
                }),
                progressbarValue: 70,
                image: img('javascript_oop')
            }, {
                id: 'jsfrep',
                tags: ['js', 'functional', 'events', 'ramda', 'web'],
                title: 'Functional Reactive Programming w JS',
                description: multiline(function() {
                    /*-
* Wstęp do programowania funkcyjnego
* Wstęp do programowania reaktywnego
* Modelowanie problemów w postaci strumieni eventów
* Biblioteka RamdaJS

                    -*/
                }),
                image: img("jsprog"),
                progressbarValue: 30
            }, {
                id: 'koa',
                tags: ['koa', 'js', 'web', 'node', 'ecma'],
                title: 'Koa + EcmaScript 6',
                description: multiline(function() {
                    /*-
Koa - następca Express. Co zmieni się w JS po wprowadzeniu Harmony (ES6)?

* Wpływ generatorów na programowanie asynchroniczne.
* Klasy - czy są potrzebne?
* Nowe struktury danych: `Set` i `Map`
* Rekurencja ogonowa

                    -*/
                }),
                image: img('koa'),
                progressbarValue: 0
            }, {
                id: 'mongodb',
                title: 'MongoDB + Elasticsearch',
                tags: ['mongodb', 'db', 'elasticsearch', 'nosql'],
                description: multiline(function() {
                    /*-
* Czym są bazy NoSQL
* Czym różni się modelowanie danych dla baz SQL i NoSQL
* W jaki sposób łączyć ze sobą dostępne produkty, aby w najlepszy sposób rozwiązywać problemy pojawiające się w dużych aplikacjach.

                    -*/
                }),
                image: img('mongodb_elastic'),
                progressbarValue: 9
            }, {
                id: 'neo4j',
                tags: ['db', 'nosql', 'neo4j'],
                title: 'Neo4J - wprowadzenie do grafowych baz danych',
                description: multiline(function() {
                    /*-
Modelowanie relacji w bazach grafowych na przykładzie Neo4J.

* Jakiego typu dane trzymać w bazach grafowych?
* Jak łączyć rózne technologie bazowe (Neo4J + Mongo + ElasticSearch)?
* Jak optymalizować zapytania?

                    -*/
                }),
                image: img('neo4j'),
                progressbarValue: 13
            }, {
                id: 'ocaml',
                tags: ['ocaml', 'functional', 'js'],
                title: 'Programowanie funkcyjne w Ocaml',
                description: multiline(function() {
                    /*-
* Czym jest Ocaml?
* Co wspólnego mają ze sobą Ocaml i JavaScript
* Na czym polega programowanie funkcyjne?
* Do czego nadaje się Ocaml?
                    -*/
                }),
                image: img('ocaml'),
                progressbarValue: 0
            }, {
                id: 'react-flux',
                title: 'React + FLUX',
                tags: ['react', 'mvc', 'flux', 'js', 'web'],
                description: multiline(function() {
                    /*-

* Jaki problem rozwiązuje React?
* Jak React ma się do AngularJS a jak do Backbone?
* Na czym polega architektura FLUX
                    -*/
                }),
                image: img('reactjs_flux'),
                progressbarValue: 0
            }, {
                id: 'rwd-ecommerce',
                title: 'Responsywne e-sklepy',
                tags: ['rwd', 'css', 'ecommerce', 'web', 'less', 'sass', 'js'],
                description: multiline(function() {
                    /*-
RWD dla sklepów internetowych. 

Szczegółowa analiza rozwiązań na podstawie rzeczywistych przykładów i ich wpływ na konwersję.

* Ile breakpointów powinien mieć Twój design?
* Jakie elementy są istotne na tablecie, telefonie, a jakie na Desktopie?

                    -*/
                }),
                image: img('rwd_commerce'),
                progressbarValue: 71
            }, {
                id: 'sass-less',
                tags: ['sass', 'less', 'css', 'web', 'rwd'],
                title: 'Preprocesory CSS',
                description: multiline(function() {
                    /*-
Po co korzystać z preprocesorów CSS? Który preprocesor wybrać?

* Zalety preprocesorów - czego brakuje w CSS?
* Porównanie LESS i SASS.
* Mixins i zmienne.

                    -*/
                }),
                progressbarValue: 34,
                image: img('sass_less')
            }]

        }
    });
});