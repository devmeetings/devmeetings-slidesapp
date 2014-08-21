xplatformApp.factory('Courses', function() {
    return {
        courses: [{
            id: 1,
            title: 'Podstawy Erlanga dla obiektowców',
            description: '- Wstęp z języka Erlang dla programistów języków obiektowych.\n' +
                '- Opis podejścia funkcyjnego - brak efektów ubocznych\n' +
                '- Procesy\n' +
                '- Hot Reload\n' +
                '- Unit testing\n' +
                '- Production deployment\n',
            image: "static/images/workshopdesc/jsprog.jpg"
        }, {
            id: 2,
            title: 'Erlang dla node’owców',
            description: '- W jaki sposób przenieść aplikację nodejs do Erlanga.\n' +
                '- Interkomunikacja Erlang <> Nodejs\n' +
                '- Co może dać Erlang?\n',
            image: "static/images/workshopdesc/jsprog.jpg"
        }, {
            id: 3,
            title: 'Functional Reactive Programming w JS',
            description: '- Wstęp do programowania funkcyjnego\n' +
                '- Wstęp do programowania reaktywnego\n' +
                '- Modelowanie problemów w postaci strumieni eventów\n' +
                '- Biblioteka RamdaJS\n',
            image: "static/images/workshopdesc/jsprog.jpg"
        }, {
            id: 4,
            title: 'Haskell dla JavaScriptowców Funkcyjnych',
            description: '- Dogłębne zrozumienie koncepcji dostępnych w JS na przykładzie języka Haskell\n' +
                '- Co wspólnego mają ze sobą Haskell i JavaScript\n' +
                '- Porównanie rozwiązań problemów w obu językach\n',
            image: "static/images/workshopdesc/jsprog.jpg"
        }, {
            id: 5,
            title: 'Programowanie funkcyjne w Ocaml',
            description: '- Czym jest Ocaml?\n' +
                '- Co wspólnego mają ze sobą Haskell i JavaScript\n' +
                '- Czym jest programowanie funkcyjne?\n' +
                '- Do czego nadaje się Ocaml?\n',
            image: "static/images/workshopdesc/jsprog.jpg"
        }, {
            id: 6,
            title: 'Pisanie bezbackendowych apek w AngularJS',
            description: 'Czy potrzebujemy backendu? W jaki sposób możemy pisać aplikacje webowe z wykorzystaniem API udostępnianych przez zewnętrzne serwisy.\n' +
                '- Obsługa baz danych\n' +
                '- Autentykacja / Autoryzacja\n' +
                '- Gdzie hostować statyczny frontend?\n' +
                '- Obsługa aplikacji offline - Manifest, ServiceWorker\n',
            image: "static/images/workshopdesc/jsprog.jpg"
        }, {
            id: 7,
            title: 'Responsywne e-sklepy',
            description: 'RWD dla sklepów internetowych. Szczegółowa analiza rozwiązań na podstawie rzeczywistych przykładów i ich wpływ na konwersję.\n',
            image: "static/images/workshopdesc/jsprog.jpg"
        }, {
            id: 8,
            title: 'React + FLUX',
            description: '- Jaki problem rozwiązuje React?\n' +
                '- Jak React ma się do AngularJS a jak do Backbone?\n' +
                '- Na czym polega architektura FLUX\n',
            image: "static/images/workshopdesc/jsprog.jpg"
        }, {
            id: 9,
            title: 'Backbone.js - produkcyjne pisanie SPA',
            description: 'Jak wygląda “produkcyjna” praca w Backbone.js? \n' +
                'Jak organizować kod, z jakich korzystać pluginów? \n' +
                'Jak radzić sobie z rosnącymi zależnościami i błędami programistów?\n' +
                'Jakich narzędzi używać do szukania błędów i poprawiania wydajności.\n' +
                'Przedstawienie zestawu dobrych praktyk do zaaplikowania w swoich rozwiązaniach.\n',
            image: "static/images/workshopdesc/jsprog.jpg"
        }, {
            id: 10,
            title: 'Ampersand.js - następca Backbone’a?',
            description: 'Opis frameworku Ampersand.js.\n' +
                'Czym różni się od Backbone?\n' +
                'Czy warto przepisać swoją aplikację na Ampersand.js?\n' +
                'Porównanie Ampersand.js do AngularJS i React.\n',
            image: "static/images/workshopdesc/jsprog.jpg"
        }, {
            id: 11,
            title: 'Ember.js vs AngularJS vs Backbone.js',
            description: 'Którego frameworku użyć w kolejnym projekcie? A może React?\n' +
                'Porównanie trzech najpopularniejszych frameworków MV*.\n' +
                'Dla każdego frameworku przeanalizujemy przykłady aplikacji, w których sprawdza się najlepiej\n',
            image: "static/images/workshopdesc/jsprog.jpg"
        }, {
            id: 12,
            title: 'MongoDB + Elasticsearch',
            description: '- Czym są bazy NoSQL\n' +
                '- Czym różni się modelowanie danych dla baz SQL i NoSQL\n' +
                '- W jaki sposób łączyć ze sobą dostępne produkty, aby w najlepszy sposób rozwiązywać problemy pojawiające się w dużych aplikacjach.\n',
            image: "static/images/workshopdesc/jsprog.jpg"
        }, {
            id: 13,
            title: 'Modelowanie danych dla Apache Cassandra',
            description: 'Jak wygląda modelowanie danych dla Cassandry? Czym różni się Cassandra od MongoDB.\n' +
                'Do jakich zastosowań możemy stosować Cassandrę?\n',
            image: "static/images/workshopdesc/jsprog.jpg"
        }, {
            id: 14,
            title: 'Neo4J - wprowadzenie do grafowych baz danych',
            description: '\n',
            image: "static/images/workshopdesc/jsprog.jpg"
        }]

    }
});