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
                id: 'angular-intro',
                order: -2,
                tags: ['js', 'angular', 'web'],
                title: 'Wprowadzenie do AngularJS',
                status: 'ready',
                basicWorkspace: '5409bac7835735722abc77b0',
                description: multiline(function() {
                    /*-
<h5>Podstawy AngularJS</h5>
<hr></hr>

* Expressions
* Kontrolery
* `ngRepeat`
* Filtry: `filter`, `orderBy` i `limitTo`
* Kontrola widoczności i wyglądu: `ngClass` i `ngShow`
                    -*/
                }),
                progressbarValue: 100,
                image: img('angular_intro')
            }]
        }
    });
});

