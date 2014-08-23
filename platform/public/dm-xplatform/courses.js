define(['xplatform/xplatform-app'], function(xplatformApp) {

    xplatformApp.factory('Courses', function() {
        var img = function(img) {
            return "static/images/workshopdesc/" + img + ".jpg";
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
                description: 'Opis frameworku Ampersand.js.\n' +
                    'Czym różni się od Backbone?\n' +
                    'Czy warto przepisać swoją aplikację na Ampersand.js?\n' +
                    'Porównanie Ampersand.js do AngularJS i React.\n',
                image: img('ampersandjs'),
                progressbarValue: 100
            }, {
                id: 'angular-directives',
                image: img('angular_directives')
            }, {
                id: 'ember',
                tags: ['ember', 'angular', 'backbone', 'js', 'web', 'mvc'],
                title: 'Ember.js vs AngularJS vs Backbone.js',
                description: 'Którego frameworku użyć w kolejnym projekcie? A może React?\n' +
                    'Porównanie trzech najpopularniejszych frameworków MV*.\n' +
                    'Dla każdego frameworku przeanalizujemy przykłady aplikacji, w których sprawdza się najlepiej\n',
                image: img('angular_ember_backbone'),
                progressbarValue: 44
            }, {
                id: 'angular-forms',
                image: img('angular_forms')
            }, {
                id: 'angular-intro',
                tags: ['js', 'angular', 'web'],
                title: 'AngularJS - podstawy',
                isReady: true,
                description: '',
                image: img('angular_intro')
            }, {
                id: 'angular-route',
                image: img('angular_route')
            }, {
                id: 'angular-services',
                image: img('angular_services')
            }, {
                id: 'angular-nobackend',
                tags: ['angular', 'backend', 'js', 'production', 'api', 'web', 'spa'],
                title: 'Pisanie bezbackendowych apek w AngularJS',
                description: 'Czy potrzebujemy backendu? W jaki sposób możemy pisać aplikacje webowe z wykorzystaniem API udostępnianych przez zewnętrzne serwisy.\n' +
                    '- Obsługa baz danych\n' +
                    '- Autentykacja / Autoryzacja\n' +
                    '- Gdzie hostować statyczny frontend?\n' +
                    '- Obsługa aplikacji offline - Manifest, ServiceWorker\n',
                image: img('angular_intro'),
                progressbarValue: 60
            }, {
                id: 'backbone',
                tags: ['backbone', 'web', 'js', 'production', 'spa', 'mvc'],
                title: 'Backbone.js - produkcyjne pisanie SPA',
                description: 'Jak wygląda “produkcyjna” praca w Backbone.js? \n' +
                    'Jak organizować kod, z jakich korzystać pluginów? \n' +
                    'Jak radzić sobie z rosnącymi zależnościami i błędami programistów?\n' +
                    'Jakich narzędzi używać do szukania błędów i poprawiania wydajności.\n' +
                    'Przedstawienie zestawu dobrych praktyk do zaaplikowania w swoich rozwiązaniach.\n',
                image: img('backbone'),
                progressbarValue: 90
            }, {
                id: 'bootstrap',
                image: img('bootstrap'),
            }, {
                id: 'cassandra',
                tags: ['nosql', 'db', 'cassandra'],
                title: 'Modelowanie danych dla Apache Cassandra',
                description: 'Jak wygląda modelowanie danych dla Cassandry? Czym różni się Cassandra od MongoDB.\n' +
                    'Do jakich zastosowań możemy stosować Cassandrę?\n',
                image: img('cassandra'),
                progressbarValue: 93
            }, {
                id: 'erlang-oo',
                tags: ['erlang', 'functional', 'oo'],
                title: 'Podstawy Erlanga dla obiektowców',
                description: '- Wstęp z języka Erlang dla programistów języków obiektowych.\n' +
                    '- Opis podejścia funkcyjnego - brak efektów ubocznych\n' +
                    '- Procesy\n' +
                    '- Hot Reload\n' +
                    '- Unit testing\n' +
                    '- Production deployment\n',
                image: img('erlang'),
                progressbarValue: 10
            }, {
                id: 'erlang-node',
                title: 'Erlang dla node’owców',
                tags: ['erlang', 'functional', 'node', 'js'],
                description: '- W jaki sposób przenieść aplikację nodejs do Erlanga.\n' +
                    '- Interkomunikacja Erlang <> Nodejs\n' +
                    '- Co może dać Erlang?\n',
                image: img('erlang_node'),
                progressbarValue: 20
            }, {
                id: 'express',
                image: img('express'),
            }, {
                id: 'haskell',
                tags: ['haskell', 'functional', 'js'],
                title: 'Haskell dla JavaScriptowców Funkcyjnych',
                description: '- Dogłębne zrozumienie koncepcji dostępnych w JS na przykładzie języka Haskell\n' +
                    '- Co wspólnego mają ze sobą Haskell i JavaScript\n' +
                    '- Porównanie rozwiązań problemów w obu językach\n',
                image: img('haskell_js'),
                progressbarValue: 40
            }, {
                id: 'java-8',
                image: img('java_18_lambda')
            }, {
                id: 'javascript-oop',
                image: img('javascript_oop')
            }, {
                id: 'jsfrep',
                tags: ['js', 'functional', 'events', 'ramda', 'web'],
                title: 'Functional Reactive Programming w JS',
                description: '- Wstęp do programowania funkcyjnego\n' +
                    '- Wstęp do programowania reaktywnego\n' +
                    '- Modelowanie problemów w postaci strumieni eventów\n' +
                    '- Biblioteka RamdaJS\n',
                image: img("jsprog"),
                progressbarValue: 30
            }, {
                id: 'koa',
                tags: ['koa', 'js', 'web', 'node', 'ecma'],
                title: 'Koa + EcmaScript 6',
                description: 'Framework koa i opis EcmaScript 6',
                image: img('koa'),
                progressbarValue: 0
            }, {
                id: 'mongodb',
                title: 'MongoDB + Elasticsearch',
                tags: ['mongodb', 'db', 'elasticsearch', 'nosql'],
                description: '- Czym są bazy NoSQL\n' +
                    '- Czym różni się modelowanie danych dla baz SQL i NoSQL\n' +
                    '- W jaki sposób łączyć ze sobą dostępne produkty, aby w najlepszy sposób rozwiązywać problemy pojawiające się w dużych aplikacjach.\n',
                image: img('mongodb_elastic'),
                progressbarValue: 78
            }, {
                id: 'neo4j',
                tags: ['db', 'nosql', 'neo4j'],
                title: 'Neo4J - wprowadzenie do grafowych baz danych',
                description: '\n',
                image: img('neo4j'),
                progressbarValue: 28
            }, {
                id: 'ocaml',
                tags: ['ocaml', 'functional', 'js'],
                title: 'Programowanie funkcyjne w Ocaml',
                description: '- Czym jest Ocaml?\n' +
                    '- Co wspólnego mają ze sobą Ocaml i JavaScript\n' +
                    '- Czym jest programowanie funkcyjne?\n' +
                    '- Do czego nadaje się Ocaml?\n',
                image: img('ocaml'),
                progressbarValue: 50
            }, {
                id: 'react-flux',
                title: 'React + FLUX',
                tags: ['react', 'mvc', 'flux', 'js', 'web'],
                description: '- Jaki problem rozwiązuje React?\n' +
                    '- Jak React ma się do AngularJS a jak do Backbone?\n' +
                    '- Na czym polega architektura FLUX\n',
                image: img('reactjs_flux'),
                progressbarValue: 80
            }, {
                id: 'rwd-ecommerce',
                title: 'Responsywne e-sklepy',
                tags: ['rwd', 'css', 'ecommerce', 'web', 'less', 'sass', 'js'],
                description: 'RWD dla sklepów internetowych. Szczegółowa analiza rozwiązań na podstawie rzeczywistych przykładów i ich wpływ na konwersję.\n',
                image: img('rwd_commerce'),
                progressbarValue: 70
            }, {
                id: 'sass-less',
                image: img('sass_less')
            }]

        }
    });
});