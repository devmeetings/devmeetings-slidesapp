var Q = require('q'), 
    _ = require('lodash'),
    Deck = require('../models/deck'),
    Event = require('../models/event'),
    Recording = require('../models/recording');

var Dashboard = {
    list: function (req, res) {
        var deckPromise = Deck.find({}).exec();
        var eventPromise = Event.find({}).exec();
        var recordingPromise = Recording.find({}).exec();

        Q.all([deckPromise, eventPromise, recordingPromise]).then(function (arr) {
            var recordingSection = function (){
                return {
                    title: 'Szkolenia',
                    items: _.map(arr[2], function (item) {
                        return {
                            title: item.title,
                            url: 'player({id: "' + item._id + '"})',
                            urlType: 'router'
                        };
                    })
                };
            };
            var eventSection = function () {
                return {
                    title: 'Events',
                    items: _.map(arr[1], function (item) {
                        return {
                            title: item.title,
                            url: '',
                            urlType: 'router'
                        };
                    })
                };
            };
            var deckSection = function () {
                return {
                    title: 'Decks',
                    items: _.map(arr[0], function (item) {
                        return {
                            title: item.title,
                            url: '/decks/'+ item._id,
                            urlType: 'static'
                        };
                    })
                };
            };

            res.send({
                sections: [
                    recordingSection(),
                 //   eventSection(),
                 //   deckSection()
                ]
            }); 
        });
    }
};

module.exports = Dashboard;

