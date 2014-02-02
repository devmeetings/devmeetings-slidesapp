var socket = io.connect(SOCKET_URL);
socket.emit('name', localStorage.getItem('name'));
socket.emit('trainer');

(function() {
    'use strict';

    var parentFrame = null;
    var slideData = null;
    var clients = {};

    var Solution = (function() {
        var $solutionSpace = $('.task-solution');
        var $notesSpace = $('.nextslide-space');

        var $el = $('.task-solution-btn');
        var $solution = $('iframe.task-solution-frame');

        var Solution = {
            showButton: function(show) {
                $solutionSpace.toggleClass('hidden', !show);
                $notesSpace.toggleClass('col-md-6', !! show).toggleClass('col-md-12', !show);
            },
            reset: function() {
                var slideId = slideData.id;
                var taskData = slideData.task;
                if (taskData && taskData.solution) {
                    $solution[0].src = '/slides-' + parentFrame.presentation + ':' + slideId + '?solution';
                }
            },
            display: function() {
                var solutionId = slideData.id + '?solution';
                parentFrame.postMessage({
                    type: 'tasksolution',
                    solutionId: solutionId
                }, window.location);
                socket.emit('solution', solutionId);
            }
        };

        $el.on('click', Solution.display.bind(Solution));

        return Solution;
    }());

    var editor = ace.edit("editor");
    editor.setTheme("ace/theme/monokai");
    editor.getSession().setMode("ace/mode/javascript");

    var iframe = $('iframe.next-slide')[0];

    window.addEventListener('message', function(ev) {
        var data = ev.data;
        if (data.type !== 'slideupdate') {
            return;
        }
        parentFrame = ev.source;
        slideData = data.currentSlide;

        editor.setValue(data.currentSlide.notes);
        Solution.showButton(data.currentSlide.task);
        Solution.reset();
        buildClientsTable();

        iframe.src = '/slides-' + parentFrame.presentation + ':' + (data.nextSlide ? data.nextSlide.id : "");
    });

    var buildClientsTable = function() {
        var $table = $('.participants-table').empty();
        var $tbody = $('<tbody>').appendTo($table);

        var add = {
            row: function(tbody) {
                tbody = tbody || $tbody
                var $tr = $('<tr>').appendTo(tbody);
                return {
                    cell: function(text, clazz) {
                        return this._cell('td', text, clazz);
                    },
                    header: function(text, clazz) {
                        return this._cell('th', text, clazz);
                    },
                    _cell: function(type, text, clazz) {
                        $('<' + type + '>').addClass(clazz).html(text).appendTo($tr);
                        return this;
                    }
                };
            }
        };
        var headers = {};
        _.each(clients, function(clientData, clientId) {
            var microtasks = clientData.microtasks[slideData.id];
            _.each(microtasks, function(t) {
                headers[t.description] = true;
            });
        });
        var row = add.row($('<thead>').appendTo($table));
        row.header('Name');
        row.header('Current slide');
        _.each(headers, function(v, k) {
            row.header(k);
        });

        _.each(clients, function(clientData, clientId) {
            var row = add.row();
            row.cell('<strong>' + clientData.name + '</strong>' + ' <span class="text-muted">' + clientId + '</span>');
            row.cell(clientData.presentation + ':' + clientData.slide);
            //microtasks for current task
            var microtasks = clientData.microtasks[slideData.id];
            _.each(headers, function(v, k) {
                var task = _.find(microtasks, function(task) {
                    return task.description === k;
                });
                if (task) {
                    row.cell('', task.isCompleted ? 'success' : 'danger');
                } else {
                    row.cell('N/A', 'warning');
                }
            });
        });
    };

    socket.on('clients', function(newClients) {
        if (!slideData) {
            return;
        }
        clients = newClients;
        buildClientsTable();
    });

    window.onbeforeunload = function() {
        return "Are you sure you want to exit?";
    };

    (function() {
        var $doc = $(document);

        var changeSlide = function() {
            parentFrame.postMessage({
                type: 'changeslide',
                mod: this
            }, window.location);
        };
        var nextSlide = changeSlide.bind(1);
        var prevSlide = changeSlide.bind(-1);

        $doc.bind('keyup', 'right', nextSlide);
        $doc.bind('keyup', 'space', nextSlide);
        $doc.bind('keyup', 'down', nextSlide);
        $doc.bind('keyup', 'pagedown', nextSlide);

        $doc.bind('keyup', 'up', prevSlide);
        $doc.bind('keyup', 'pageup', prevSlide);
        $doc.bind('keyup', 'left', prevSlide);
    }());
}());