define(['xplatform/xplatform-app'], function(xplatformApp) {

    xplatformApp.factory('Courses', function() {
        return {
            getCourseById: function(id) {
                return this.courses.filter(function(x) {
                    return x.id == id;
                })[0];
            },
            courses: [{
                id: 'erlang',
                tags: ['erlang', 'functional', 'oo'],
                title: 'Podstawy Erlanga dla obiektowców',
                description: '- Wstęp z języka Erlang dla programistów języków obiektowych.\n' +
                    '- Opis podejścia funkcyjnego - brak efektów ubocznych\n' +
                    '- Procesy\n' +
                    '- Hot Reload\n' +
                    '- Unit testing\n' +
                    '- Production deployment\n',
                image: "static/images/workshopdesc/teaser_erlang.jpg",
                progressbarValue: 10
            }, {
                id: 2,
                title: 'Erlang dla node’owców',
                tags: ['erlang', 'functional', 'node', 'js'],
                description: '- W jaki sposób przenieść aplikację nodejs do Erlanga.\n' +
                    '- Interkomunikacja Erlang <> Nodejs\n' +
                    '- Co może dać Erlang?\n',
                image: "static/images/workshopdesc/jsprog.jpg",
                progressbarValue: 20
            }, {
                id: 3,
                tags: ['js', 'functional', 'events', 'ramda', 'web'],
                title: 'Functional Reactive Programming w JS',
                description: '- Wstęp do programowania funkcyjnego\n' +
                    '- Wstęp do programowania reaktywnego\n' +
                    '- Modelowanie problemów w postaci strumieni eventów\n' +
                    '- Biblioteka RamdaJS\n',
                image: "static/images/workshopdesc/jsprog.jpg",
                progressbarValue: 30
            }, {
                id: 4,
                tags: ['haskell', 'functional', 'js'],
                title: 'Haskell dla JavaScriptowców Funkcyjnych',
                description: '- Dogłębne zrozumienie koncepcji dostępnych w JS na przykładzie języka Haskell\n' +
                    '- Co wspólnego mają ze sobą Haskell i JavaScript\n' +
                    '- Porównanie rozwiązań problemów w obu językach\n',
                image: "static/images/workshopdesc/jsprog.jpg",
                progressbarValue: 40
            }, {
                id: 5,
                tags: ['ocaml', 'functional', 'js'],
                title: 'Programowanie funkcyjne w Ocaml',
                description: '- Czym jest Ocaml?\n' +
                    '- Co wspólnego mają ze sobą Ocaml i JavaScript\n' +
                    '- Czym jest programowanie funkcyjne?\n' +
                    '- Do czego nadaje się Ocaml?\n',
                image: "static/images/workshopdesc/teaser_ocaml.jpg",
                progressbarValue: 50
            }, {
                id: 6,
                tags: ['angular', 'backend', 'js', 'production', 'api', 'web', 'spa'],
                title: 'Pisanie bezbackendowych apek w AngularJS',
                description: 'Czy potrzebujemy backendu? W jaki sposób możemy pisać aplikacje webowe z wykorzystaniem API udostępnianych przez zewnętrzne serwisy.\n' +
                    '- Obsługa baz danych\n' +
                    '- Autentykacja / Autoryzacja\n' +
                    '- Gdzie hostować statyczny frontend?\n' +
                    '- Obsługa aplikacji offline - Manifest, ServiceWorker\n',
                image: "static/images/workshopdesc/angular_services.jpg",
                progressbarValue: 60
            }, {
                id: 7,
                title: 'Responsywne e-sklepy',
                tags: ['rwd', 'css', 'ecommerce', 'web', 'less', 'sass', 'js'],
                description: 'RWD dla sklepów internetowych. Szczegółowa analiza rozwiązań na podstawie rzeczywistych przykładów i ich wpływ na konwersję.\n',
                image: "static/images/workshopdesc/rwd_commerce.jpg",
                progressbarValue: 70
            }, {
                id: 8,
                title: 'React + FLUX',
                tags: ['react', 'mvc', 'flux', 'js', 'web'],
                description: '- Jaki problem rozwiązuje React?\n' +
                    '- Jak React ma się do AngularJS a jak do Backbone?\n' +
                    '- Na czym polega architektura FLUX\n',
                image: "static/images/workshopdesc/reactjs_flux.jpg",
                progressbarValue: 80
            }, {
                id: 9,
                tags: ['backbone', 'web', 'js', 'production', 'spa', 'mvc'],
                title: 'Backbone.js - produkcyjne pisanie SPA',
                description: 'Jak wygląda “produkcyjna” praca w Backbone.js? \n' +
                    'Jak organizować kod, z jakich korzystać pluginów? \n' +
                    'Jak radzić sobie z rosnącymi zależnościami i błędami programistów?\n' +
                    'Jakich narzędzi używać do szukania błędów i poprawiania wydajności.\n' +
                    'Przedstawienie zestawu dobrych praktyk do zaaplikowania w swoich rozwiązaniach.\n',
                image: "static/images/workshopdesc/jsprog.jpg",
                progressbarValue: 90
            }, {
                id: 10,
                tags: ['ampersand', 'backbone', 'react', 'web', 'mvc', 'js'],
                title: 'Ampersand.js - następca Backbone’a?',
                description: 'Opis frameworku Ampersand.js.\n' +
                    'Czym różni się od Backbone?\n' +
                    'Czy warto przepisać swoją aplikację na Ampersand.js?\n' +
                    'Porównanie Ampersand.js do AngularJS i React.\n',
                image: "static/images/workshopdesc/teaser_ampersandjs.jpg",
                progressbarValue: 100
            }, {
                id: 11,
                tags: ['ember', 'angular', 'backbone', 'js', 'web', 'mvc'],
                title: 'Ember.js vs AngularJS vs Backbone.js',
                description: 'Którego frameworku użyć w kolejnym projekcie? A może React?\n' +
                    'Porównanie trzech najpopularniejszych frameworków MV*.\n' +
                    'Dla każdego frameworku przeanalizujemy przykłady aplikacji, w których sprawdza się najlepiej\n',
                image: "static/images/workshopdesc/angular_ember_backbone.jpg",
                progressbarValue: 44

            }, {
                id: 12,
                title: 'MongoDB + Elasticsearch',
                tags: ['mongodb', 'db', 'elasticsearch', 'nosql'],
                description: '- Czym są bazy NoSQL\n' +
                    '- Czym różni się modelowanie danych dla baz SQL i NoSQL\n' +
                    '- W jaki sposób łączyć ze sobą dostępne produkty, aby w najlepszy sposób rozwiązywać problemy pojawiające się w dużych aplikacjach.\n',
                image: "static/images/workshopdesc/mongodb+elastic.jpg",
                progressbarValue: 78
            }, {
                id: 13,
                tags: ['nosql', 'db', 'cassandra'],
                title: 'Modelowanie danych dla Apache Cassandra',
                description: 'Jak wygląda modelowanie danych dla Cassandry? Czym różni się Cassandra od MongoDB.\n' +
                    'Do jakich zastosowań możemy stosować Cassandrę?\n',
                image: "static/images/workshopdesc/jsprog.jpg",
                progressbarValue: 93
            }, {
                id: 14,
                tags: ['db', 'nosql', 'neo4j'],
                title: 'Neo4J - wprowadzenie do grafowych baz danych',
                description: '\n',
                image: "static/images/workshopdesc/jsprog.jpg",
                progressbarValue: 28
            }, {
                id: 'koa',
                tags: ['koa', 'js', 'web', 'node', 'ecma'],
                title: 'Koa + EcmaScript 6',
                description: 'Framework koa i opis EcmaScript 6',
                image: "static/images/workshopdesc/jsprog.jpg",
                progressbarValue: 0
            }]

        }
    });
});