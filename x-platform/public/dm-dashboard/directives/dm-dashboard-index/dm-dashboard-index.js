import _ from '_';
import app from 'dm-dashboard/dm-dashboard-app';
import template from './dm-dashboard-index.html!text';

app.directive('dmDashboardIndex', () => {

  return {
    restrict: 'E',
    replace: true,
    scope: {
      name: '='
    },
    controllerAs: 'vm',
    bindToController: true,
    controller () {
      let c = new DmDashboardIndex({});
      c.controller(this);
    },
    template: template
  };

});

class DmDashboardIndex {

  constructor (data) {
    _.extend(this, data);
  }

  controller (vm) {
    vm.getNumOfUnsolvedProblems = (reportedProblems) => this.getNumOfUnsolvedProblems(reportedProblems);
    vm.getPercentages = (numOfActvStudents, numOfAllStudents) => this.getPercentages(numOfActvStudents, numOfAllStudents);
    vm.getNumOfAllUnsolvedProblems = (events) => this.getNumOfAllUnsolvedProblems(events);
    vm.sortBy = (byWhat) => this.sortBy(vm, byWhat);

    vm.sort = {
      by: false,
      desc: false
    };

    vm.viewOptions = {
      allProblemsOnScreen: false,
      strategicView: 'table'
    };

    vm.model = {
      activeEvents: [
      // Wroclaw
      {
        _id: '12345xxx',
        name: 'RWD Wroclaw',
        timing: {
          started: true,
          startedAt: 9.03,
          expectedEnd: 16.03
        },
        members: {
          number: 32,
          organizers: [
            {
              name: 'Tomasz Drwięga',
              avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
            },
            {
              name: 'Łukasz Słomski',
              avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
            }
          ],
          // na razie nie uzywam tej tablicy(trainers), takie rozdrabnianie podzialu moze byc potem
          // klopotliwe, a nie wiem, czy w ogole potrzebne
          // trainers: [],
          students: {
            all: [
              {
                name: 'Kuba Bartczuk',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              },
              {
                name: 'Alek Cieślak',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              },
              {
                name: 'Bruno Gałka',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              },
              {
                name: 'Ewelina Opałka',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              },
              {
                name: 'Sławek Śmietanka',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              },
              {
                name: 'Małgosia Kordus',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              },
              {
                name: 'Kasia Jankowska',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              },
              {
                name: 'Tomek Szczypiński',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              },
              {
                name: 'Kuba Rudnicki',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              },
              {
                name: 'Paweł Biczysko',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              },
              {
                name: 'Kuba Bartczuk',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              },
              {
                name: 'Alek Cieślak',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              },
              {
                name: 'Bruno Gałka',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              },
              {
                name: 'Ewelina Opałka',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              },
              {
                name: 'Sławek Śmietanka',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              },
              {
                name: 'Małgosia Kordus',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              },
              {
                name: 'Kasia Jankowska',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              },
              {
                name: 'Tomek Szczypiński',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              },
              {
                name: 'Kuba Rudnicki',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              },
              {
                name: 'Paweł Biczysko',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              },
              {
                name: 'Kuba Bartczuk',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              },
              {
                name: 'Alek Cieślak',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              },
              {
                name: 'Bruno Gałka',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              },
              {
                name: 'Ewelina Opałka',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              },
              {
                name: 'Sławek Śmietanka',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              },
              {
                name: 'Małgosia Kordus',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              },
              {
                name: 'Kasia Jankowska',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              },
              {
                name: 'Tomek Szczypiński',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              },
              {
                name: 'Kuba Rudnicki',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              },
              {
                name: 'Paweł Biczysko',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              }
            ],
            active: [
              {
                name: 'Kuba Bartczuk',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              },
              {
                name: 'Kasia Jankowska',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              },
              {
                name: 'Kuba Rudnicki',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              },
              {
                name: 'Alek Cieślak',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              },
              {
                name: 'Sławek Śmietanka',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              },
              {
                name: 'Małgosia Kordus',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              },
              {
                name: 'Kasia Jankowska',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              },
              {
                name: 'Tomek Szczypiński',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              },
              {
                name: 'Kuba Rudnicki',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              },
              {
                name: 'Paweł Biczysko',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              },
              {
                name: 'Kuba Bartczuk',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              },
              {
                name: 'Alek Cieślak',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              },
              {
                name: 'Bruno Gałka',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              },
              {
                name: 'Ewelina Opałka',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              },
              {
                name: 'Sławek Śmietanka',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              },
              {
                name: 'Małgosia Kordus',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              },
              {
                name: 'Kasia Jankowska',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              },
              {
                name: 'Tomek Szczypiński',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              },
              {
                name: 'Kuba Rudnicki',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              },
              {
                name: 'Paweł Biczysko',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              }
            ]
          }
        },
        currentStage: {
          name: 'It. 2',
          minFromStart: 2.30
        },
        reportedProblems: [
          {
            title: 'Brak Internetu',
            description: 'Nie mamy dostepu do Internetu',
            solved: false
          },
          {
            title: 'Brak wody',
            description: 'Brak wody, nie mozna sie napic, umieramy z pragnienia',
            solved: false
          },
          {
            title: 'Mentor Chory',
            description: 'Jeden Mentor - Kuba Xiniski jest chory i nie przyjechal',
            solved: true
          },
          {
            title: 'Lorem Ipsum dolor',
            description: 'Lorem Ipsum jest tekstem stosowanym jako przykładowy wypełniacz w przemyśle poligraficznym. Został po raz pierwszy użyty w XV w. przez nieznanego drukarza do wypełnienia tekstem próbnej książki. Pięć wieków później zaczął być używany przemyśle elektronicznym, pozostając praktycznie niezmienionym. Spopularyzował się w latach 60. XX w. wraz z publikacją arkuszy Letrasetu, zawierających fragmenty Lorem Ipsum, a ostatnio z zawierającym różne wersje Lorem Ipsum oprogramowaniem przeznaczonym do realizacji druków na komputerach osobistych, jak Aldus PageMaker.',
            solved: true
          }
        ],
        ranking: {
          bestUsers: [
            {
              _id: '123',
              name: 'Kuba Rudnicki',
              avatar: '',
              percentageResult: 50.7
            },
            {
              _id: '123',
              name: 'Kuba Bartczuk',
              avatar: '',
              percentageResult: 49.8
            },
            {
              _id: '123',
              name: 'Alek Cieślak',
              avatar: '',
              percentageResult: 47.3
            }
          ],
          worseUsers: [
            {
              _id: '123',
              name: 'Małgosia Kordus',
              avatar: '',
              percentageResult: 11.3
            },
            {
              _id: '123',
              name: 'Bruno Gałka',
              avatar: '',
              percentageResult: 9.7
            },
            {
              _id: '123',
              name: 'Sławek Śmietanka',
              avatar: '',
              percentageResult: 8.7
            }
          ],
          bestGroup: {
            _id: '321',
            name: 'Ninja JS!',
            percentageResult: 43.7
          }
        },
        hyperlinks: {
          rankingView: 'https://www.google.com',
          trainerView: 'https://www.google.com'
        },
        streaming: {
          active: true,
          url: 'https://www.youtube.com/embed/1G4isv_Fylg?list=RD1G4isv_Fylg'
        }
      },
      // Warszawa
      {
        _id: '12345xxx',
        name: 'RWD Warszawa',
        timing: {
          started: false
        },
        members: {
          number: 36,
          organizers: [
            {
              name: 'Tomasz Drwięga',
              avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
            },
            {
              name: 'Łukasz Słomski',
              avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
            }
          ],
          // na razie nie uzywam tej tablicy(trainers), takie rozdrabnianie podzialu moze byc potem
          // klopotliwe, a nie wiem, czy w ogole potrzebne
          // trainers: [],
          students: {
            all: [
              {
                name: 'Kuba Bartczuk',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              },
              {
                name: 'Alek Cieślak',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              },
              {
                name: 'Bruno Gałka',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              },
              {
                name: 'Ewelina Opałka',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              },
              {
                name: 'Sławek Śmietanka',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              },
              {
                name: 'Małgosia Kordus',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              },
              {
                name: 'Kasia Jankowska',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              },
              {
                name: 'Tomek Szczypiński',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              },
              {
                name: 'Kuba Rudnicki',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              },
              {
                name: 'Paweł Biczysko',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              }
            ],
            active: [
            ]
          }
        },
        currentStage: {
          name: 'It. 0',
          minFromStart: 5.20
        },
        reportedProblems: [
          {
            title: 'Brak Internetu',
            description: 'Nie mamy dostepu do Internetu',
            solved: false
          },
          {
            title: 'Brak wody',
            description: 'Brak wody, nie mozna sie napic, umieramy z pragnienia',
            solved: false
          },
          {
            title: 'Mentor Chory',
            description: 'Jeden Mentor - Kuba Xiniski jest chory i nie przyjechal',
            solved: false
          }
        ],
        ranking: {
          bestUsers: [
            {
              _id: '123',
              name: 'Kuba Rudnicki',
              avatar: '',
              percentageResult: 50.7
            },
            {
              _id: '123',
              name: 'Kuba Bartczuk',
              avatar: '',
              percentageResult: 49.8
            },
            {
              _id: '123',
              name: 'Alek Cieślak',
              avatar: '',
              percentageResult: 47.3
            }
          ],
          worseUsers: [
            {
              _id: '123',
              name: 'Małgosia Kordus',
              avatar: '',
              percentageResult: 11.3
            },
            {
              _id: '123',
              name: 'Bruno Gałka',
              avatar: '',
              percentageResult: 9.7
            },
            {
              _id: '123',
              name: 'Sławek Śmietanka',
              avatar: '',
              percentageResult: 8.7
            }
          ],
          bestGroup: {
            _id: '321',
            name: 'Ninja JS!',
            percentageResult: 43.7
          }
        },
        hyperlinks: {
          rankingView: 'https://www.google.com',
          trainerView: 'https://www.google.com'
        },
        streaming: {
          active: true,
          url: 'https://www.youtube.com/embed/1G4isv_Fylg?list=RD1G4isv_Fylg'
        }
      },
      // Poznan
      {
        _id: '12345xxx',
        name: 'RWD Poznan',
        timing: {
          started: true,
          startedAt: 8.53,
          expectedEnd: 15.53
        },
        members: {
          number: 40,
          organizers: [
            {
              name: 'Tomasz Drwięga',
              avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
            },
            {
              name: 'Łukasz Słomski',
              avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
            }
          ],
          // na razie nie uzywam tej tablicy(trainers), takie rozdrabnianie podzialu moze byc potem
          // klopotliwe, a nie wiem, czy w ogole potrzebne
          // trainers: [],
          students: {
            all: [
              {
                name: 'Kuba Bartczuk',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              },
              {
                name: 'Alek Cieślak',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              },
              {
                name: 'Bruno Gałka',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              },
              {
                name: 'Ewelina Opałka',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              },
              {
                name: 'Sławek Śmietanka',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              },
              {
                name: 'Małgosia Kordus',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              },
              {
                name: 'Kasia Jankowska',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              },
              {
                name: 'Tomek Szczypiński',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              },
              {
                name: 'Kuba Rudnicki',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              },
              {
                name: 'Paweł Biczysko',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              }
            ],
            active: [
              {
                name: 'Kuba Bartczuk',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              },
              {
                name: 'Kasia Jankowska',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              },
              {
                name: 'Kuba Rudnicki',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              },
              {
                name: 'Alek Cieślak',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              }
            ]
          }
        },
        currentStage: {
          name: 'It. 2',
          minFromStart: 20.00
        },
        reportedProblems: [
          {
            title: 'Brak Internetu',
            description: 'Nie mamy dostepu do Internetu',
            solved: false
          },
          {
            title: 'Brak wody',
            description: 'Brak wody, nie mozna sie napic, umieramy z pragnienia',
            solved: false
          },
          {
            title: 'Mentor Chory',
            description: 'Jeden Mentor - Kuba Xiniski jest chory i nie przyjechal',
            solved: false
          }
        ],
        ranking: {
          bestUsers: [
            {
              _id: '123',
              name: 'Kuba Rudnicki',
              avatar: '',
              percentageResult: 50.7
            },
            {
              _id: '123',
              name: 'Kuba Bartczuk',
              avatar: '',
              percentageResult: 49.8
            },
            {
              _id: '123',
              name: 'Alek Cieślak',
              avatar: '',
              percentageResult: 47.3
            }
          ],
          worseUsers: [
            {
              _id: '123',
              name: 'Małgosia Kordus',
              avatar: '',
              percentageResult: 11.3
            },
            {
              _id: '123',
              name: 'Bruno Gałka',
              avatar: '',
              percentageResult: 9.7
            },
            {
              _id: '123',
              name: 'Sławek Śmietanka',
              avatar: '',
              percentageResult: 8.7
            }
          ],
          bestGroup: {
            _id: '321',
            name: 'Ninja JS!',
            percentageResult: 43.7
          }
        },
        hyperlinks: {
          rankingView: 'https://www.google.com',
          trainerView: 'https://www.google.com'
        },
        streaming: {
          active: false,
          url: 'https://www.youtube.com/embed/1G4isv_Fylg?list=RD1G4isv_Fylg'
        }
      },
      // Krakow
      {
        _id: '12345xxx',
        name: 'RWD Krakow',
        timing: {
          started: true,
          startedAt: 8.55,
          expectedEnd: 15.55
        },
        members: {
          number: 35,
          organizers: [
            {
              name: 'Tomasz Drwięga',
              avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
            },
            {
              name: 'Łukasz Słomski',
              avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
            }
          ],
          // na razie nie uzywam tej tablicy(trainers), takie rozdrabnianie podzialu moze byc potem
          // klopotliwe, a nie wiem, czy w ogole potrzebne
          // trainers: [],
          students: {
            all: [
              {
                name: 'Kuba Bartczuk',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              },
              {
                name: 'Alek Cieślak',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              },
              {
                name: 'Bruno Gałka',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              },
              {
                name: 'Ewelina Opałka',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              },
              {
                name: 'Sławek Śmietanka',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              },
              {
                name: 'Małgosia Kordus',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              },
              {
                name: 'Kasia Jankowska',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              },
              {
                name: 'Tomek Szczypiński',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              },
              {
                name: 'Kuba Rudnicki',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              },
              {
                name: 'Paweł Biczysko',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              }
            ],
            active: [
              {
                name: 'Kuba Bartczuk',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              },
              {
                name: 'Kasia Jankowska',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              },
              {
                name: 'Kuba Rudnicki',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              },
              {
                name: 'Alek Cieślak',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              }
            ]
          }
        },
        currentStage: {
          name: 'It. 3',
          minFromStart: 23.20
        },
        reportedProblems: [
          {
            title: 'Brak Internetu',
            description: 'Nie mamy dostepu do Internetu',
            solved: false
          },
          {
            title: 'Brak wody',
            description: 'Brak wody, nie mozna sie napic, umieramy z pragnienia',
            solved: false
          },
          {
            title: 'Mentor Chory',
            description: 'Jeden Mentor - Kuba Xiniski jest chory i nie przyjechal',
            solved: false
          }
        ],
        ranking: {
          bestUsers: [
            {
              _id: '123',
              name: 'Kuba Rudnicki',
              avatar: '',
              percentageResult: 50.7
            },
            {
              _id: '123',
              name: 'Kuba Bartczuk',
              avatar: '',
              percentageResult: 49.8
            },
            {
              _id: '123',
              name: 'Alek Cieślak',
              avatar: '',
              percentageResult: 47.3
            }
          ],
          worseUsers: [
            {
              _id: '123',
              name: 'Małgosia Kordus',
              avatar: '',
              percentageResult: 11.3
            },
            {
              _id: '123',
              name: 'Bruno Gałka',
              avatar: '',
              percentageResult: 9.7
            },
            {
              _id: '123',
              name: 'Sławek Śmietanka',
              avatar: '',
              percentageResult: 8.7
            }
          ],
          bestGroup: {
            _id: '321',
            name: 'Ninja JS!',
            percentageResult: 43.7
          }
        },
        hyperlinks: {
          rankingView: 'https://www.google.com',
          trainerView: 'https://www.google.com'
        },
        streaming: {
          active: false,
          url: 'https://www.youtube.com/embed/1G4isv_Fylg?list=RD1G4isv_Fylg'
        }
      },
      // Berlin
      {
        _id: '12345xxx',
        name: 'RWD Berlin',
        timing: {
          started: false
        },
        members: {
          number: 36,
          organizers: [
            {
              name: 'Tomasz Drwięga',
              avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
            },
            {
              name: 'Łukasz Słomski',
              avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
            }
          ],
          // na razie nie uzywam tej tablicy(trainers), takie rozdrabnianie podzialu moze byc potem
          // klopotliwe, a nie wiem, czy w ogole potrzebne
          // trainers: [],
          students: {
            all: [
              {
                name: 'Kuba Bartczuk',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              },
              {
                name: 'Alek Cieślak',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              },
              {
                name: 'Bruno Gałka',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              },
              {
                name: 'Ewelina Opałka',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              },
              {
                name: 'Sławek Śmietanka',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              },
              {
                name: 'Małgosia Kordus',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              },
              {
                name: 'Kasia Jankowska',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              },
              {
                name: 'Tomek Szczypiński',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              },
              {
                name: 'Kuba Rudnicki',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              },
              {
                name: 'Paweł Biczysko',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              }
            ],
            active: [
            ]
          }
        },
        currentStage: {
          name: 'It. 0',
          minFromStart: 15.50
        },
        reportedProblems: [
          {
            title: 'Brak Internetu',
            description: 'Nie mamy dostepu do Internetu',
            solved: false
          },
          {
            title: 'Brak wody',
            description: 'Brak wody, nie mozna sie napic, umieramy z pragnienia',
            solved: false
          },
          {
            title: 'Mentor Chory',
            description: 'Jeden Mentor - Kuba Xiniski jest chory i nie przyjechal',
            solved: false
          }
        ],
        ranking: {
          bestUsers: [
            {
              _id: '123',
              name: 'Kuba Rudnicki',
              avatar: '',
              percentageResult: 50.7
            },
            {
              _id: '123',
              name: 'Kuba Bartczuk',
              avatar: '',
              percentageResult: 49.8
            },
            {
              _id: '123',
              name: 'Alek Cieślak',
              avatar: '',
              percentageResult: 47.3
            }
          ],
          worseUsers: [
            {
              _id: '123',
              name: 'Małgosia Kordus',
              avatar: '',
              percentageResult: 11.3
            },
            {
              _id: '123',
              name: 'Bruno Gałka',
              avatar: '',
              percentageResult: 9.7
            },
            {
              _id: '123',
              name: 'Sławek Śmietanka',
              avatar: '',
              percentageResult: 8.7
            }
          ],
          bestGroup: {
            _id: '321',
            name: 'Ninja JS!',
            percentageResult: 43.7
          }
        },
        hyperlinks: {
          rankingView: 'https://www.google.com',
          trainerView: 'https://www.google.com'
        },
        streaming: {
          active: true,
          url: 'https://www.youtube.com/embed/1G4isv_Fylg?list=RD1G4isv_Fylg'
        }
      },
      // Londyn
      {
        _id: '12345xxx',
        name: 'RWD Londyn',
        timing: {
          started: true,
          startedAt: 8.53,
          expectedEnd: 15.53
        },
        members: {
          number: 40,
          organizers: [
            {
              name: 'Tomasz Drwięga',
              avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
            },
            {
              name: 'Łukasz Słomski',
              avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
            }
          ],
          // na razie nie uzywam tej tablicy(trainers), takie rozdrabnianie podzialu moze byc potem
          // klopotliwe, a nie wiem, czy w ogole potrzebne
          // trainers: [],
          students: {
            all: [
              {
                name: 'Kuba Bartczuk',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              },
              {
                name: 'Alek Cieślak',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              },
              {
                name: 'Bruno Gałka',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              },
              {
                name: 'Ewelina Opałka',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              },
              {
                name: 'Sławek Śmietanka',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              },
              {
                name: 'Małgosia Kordus',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              },
              {
                name: 'Kasia Jankowska',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              },
              {
                name: 'Tomek Szczypiński',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              },
              {
                name: 'Kuba Rudnicki',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              },
              {
                name: 'Paweł Biczysko',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              }
            ],
            active: [
              {
                name: 'Kuba Bartczuk',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              },
              {
                name: 'Kasia Jankowska',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              },
              {
                name: 'Kuba Rudnicki',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              },
              {
                name: 'Alek Cieślak',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              }
            ]
          }
        },
        currentStage: {
          name: 'It. 2',
          minFromStart: 19.60
        },
        reportedProblems: [
          {
            title: 'Brak Internetu',
            description: 'Nie mamy dostepu do Internetu',
            solved: false
          },
          {
            title: 'Brak wody',
            description: 'Brak wody, nie mozna sie napic, umieramy z pragnienia',
            solved: false
          },
          {
            title: 'Mentor Chory',
            description: 'Jeden Mentor - Kuba Xiniski jest chory i nie przyjechal',
            solved: false
          }
        ],
        ranking: {
          bestUsers: [
            {
              _id: '123',
              name: 'Kuba Rudnicki',
              avatar: '',
              percentageResult: 50.7
            },
            {
              _id: '123',
              name: 'Kuba Bartczuk',
              avatar: '',
              percentageResult: 49.8
            },
            {
              _id: '123',
              name: 'Alek Cieślak',
              avatar: '',
              percentageResult: 47.3
            }
          ],
          worseUsers: [
            {
              _id: '123',
              name: 'Małgosia Kordus',
              avatar: '',
              percentageResult: 11.3
            },
            {
              _id: '123',
              name: 'Bruno Gałka',
              avatar: '',
              percentageResult: 9.7
            },
            {
              _id: '123',
              name: 'Sławek Śmietanka',
              avatar: '',
              percentageResult: 8.7
            }
          ],
          bestGroup: {
            _id: '321',
            name: 'Ninja JS!',
            percentageResult: 43.7
          }
        },
        hyperlinks: {
          rankingView: 'https://www.google.com',
          trainerView: 'https://www.google.com'
        },
        streaming: {
          active: false,
          url: 'https://www.youtube.com/embed/1G4isv_Fylg?list=RD1G4isv_Fylg'
        }
      },
      // Rzym
      {
        _id: '12345xxx',
        name: 'RWD Rzym',
        timing: {
          started: true,
          startedAt: 8.55,
          expectedEnd: 15.55
        },
        members: {
          number: 35,
          organizers: [
            {
              name: 'Tomasz Drwięga',
              avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
            },
            {
              name: 'Łukasz Słomski',
              avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
            }
          ],
          // na razie nie uzywam tej tablicy(trainers), takie rozdrabnianie podzialu moze byc potem
          // klopotliwe, a nie wiem, czy w ogole potrzebne
          // trainers: [],
          students: {
            all: [
              {
                name: 'Kuba Bartczuk',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              },
              {
                name: 'Alek Cieślak',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              },
              {
                name: 'Bruno Gałka',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              },
              {
                name: 'Ewelina Opałka',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              },
              {
                name: 'Sławek Śmietanka',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              },
              {
                name: 'Małgosia Kordus',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              },
              {
                name: 'Kasia Jankowska',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              },
              {
                name: 'Tomek Szczypiński',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              },
              {
                name: 'Kuba Rudnicki',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              },
              {
                name: 'Paweł Biczysko',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              }
            ],
            active: [
              {
                name: 'Kuba Bartczuk',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              },
              {
                name: 'Kasia Jankowska',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              },
              {
                name: 'Kuba Rudnicki',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              },
              {
                name: 'Alek Cieślak',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              }
            ]
          }
        },
        currentStage: {
          name: 'It. 2',
          minFromStart: 35.20
        },
        reportedProblems: [
          {
            title: 'Brak Internetu',
            description: 'Nie mamy dostepu do Internetu',
            solved: false
          },
          {
            title: 'Brak wody',
            description: 'Brak wody, nie mozna sie napic, umieramy z pragnienia',
            solved: false
          },
          {
            title: 'Mentor Chory',
            description: 'Jeden Mentor - Kuba Xiniski jest chory i nie przyjechal',
            solved: false
          }
        ],
        ranking: {
          bestUsers: [
            {
              _id: '123',
              name: 'Kuba Rudnicki',
              avatar: '',
              percentageResult: 50.7
            },
            {
              _id: '123',
              name: 'Kuba Bartczuk',
              avatar: '',
              percentageResult: 49.8
            },
            {
              _id: '123',
              name: 'Alek Cieślak',
              avatar: '',
              percentageResult: 47.3
            }
          ],
          worseUsers: [
            {
              _id: '123',
              name: 'Małgosia Kordus',
              avatar: '',
              percentageResult: 11.3
            },
            {
              _id: '123',
              name: 'Bruno Gałka',
              avatar: '',
              percentageResult: 9.7
            },
            {
              _id: '123',
              name: 'Sławek Śmietanka',
              avatar: '',
              percentageResult: 8.7
            }
          ],
          bestGroup: {
            _id: '321',
            name: 'Ninja JS!',
            percentageResult: 43.7
          }
        },
        hyperlinks: {
          rankingView: 'https://www.google.com',
          trainerView: 'https://www.google.com'
        },
        streaming: {
          active: false,
          url: 'https://www.youtube.com/embed/1G4isv_Fylg?list=RD1G4isv_Fylg'
        }
      },
      // Praga
      {
        _id: '12345xxx',
        name: 'RWD Praga',
        timing: {
          started: true,
          startedAt: 8.55,
          expectedEnd: 15.55
        },
        members: {
          number: 35,
          organizers: [
            {
              name: 'Tomasz Drwięga',
              avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
            },
            {
              name: 'Łukasz Słomski',
              avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
            }
          ],
          // na razie nie uzywam tej tablicy(trainers), takie rozdrabnianie podzialu moze byc potem
          // klopotliwe, a nie wiem, czy w ogole potrzebne
          // trainers: [],
          students: {
            all: [
              {
                name: 'Kuba Bartczuk',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              },
              {
                name: 'Alek Cieślak',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              },
              {
                name: 'Bruno Gałka',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              },
              {
                name: 'Ewelina Opałka',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              },
              {
                name: 'Sławek Śmietanka',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              },
              {
                name: 'Małgosia Kordus',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              },
              {
                name: 'Kasia Jankowska',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              },
              {
                name: 'Tomek Szczypiński',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              },
              {
                name: 'Kuba Rudnicki',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              },
              {
                name: 'Paweł Biczysko',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              }
            ],
            active: [
              {
                name: 'Kuba Bartczuk',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              },
              {
                name: 'Kasia Jankowska',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              },
              {
                name: 'Kuba Rudnicki',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              },
              {
                name: 'Alek Cieślak',
                avatar: 'https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              }
            ]
          }
        },
        currentStage: {
          name: 'It. 3',
          minFromStart: 2.00
        },
        reportedProblems: [
          {
            title: 'Brak Internetu',
            description: 'Nie mamy dostepu do Internetu',
            solved: false
          },
          {
            title: 'Brak wody',
            description: 'Brak wody, nie mozna sie napic, umieramy z pragnienia',
            solved: false
          },
          {
            title: 'Mentor Chory',
            description: 'Jeden Mentor - Kuba Xiniski jest chory i nie przyjechal',
            solved: false
          }
        ],
        ranking: {
          bestUsers: [
            {
              _id: '123',
              name: 'Kuba Rudnicki',
              avatar: '',
              percentageResult: 50.7
            },
            {
              _id: '123',
              name: 'Kuba Bartczuk',
              avatar: '',
              percentageResult: 49.8
            },
            {
              _id: '123',
              name: 'Alek Cieślak',
              avatar: '',
              percentageResult: 47.3
            }
          ],
          worseUsers: [
            {
              _id: '123',
              name: 'Małgosia Kordus',
              avatar: '',
              percentageResult: 11.3
            },
            {
              _id: '123',
              name: 'Bruno Gałka',
              avatar: '',
              percentageResult: 9.7
            },
            {
              _id: '123',
              name: 'Sławek Śmietanka',
              avatar: '',
              percentageResult: 8.7
            }
          ],
          bestGroup: {
            _id: '321',
            name: 'Ninja JS!',
            percentageResult: 43.7
          }
        },
        hyperlinks: {
          rankingView: 'https://www.google.com',
          trainerView: 'https://www.google.com'
        },
        streaming: {
          active: false,
          url: 'https://www.youtube.com/embed/1G4isv_Fylg?list=RD1G4isv_Fylg'
        }
      }
      ]
    };
  }

  getNumOfUnsolvedProblems (reportedProblems) {
    let numOfUnsolvedProblems = 0;

    for (let problem of reportedProblems) {
      if (!problem.solved) {
        numOfUnsolvedProblems++;
      }
    }
    return numOfUnsolvedProblems;
  }

  getPercentages (numOfActvStudents, numOfAllStudents) {
    return Math.round((numOfActvStudents / numOfAllStudents * 100) * 100) / 100;
  }

  getNumOfAllUnsolvedProblems (events) {
    let allProblems = 0;

    for (let event of events) {
      allProblems = allProblems + this.getNumOfUnsolvedProblems(event.reportedProblems);
    }
    return allProblems;
  }

  sortBy (vm, byWhat) {
    vm.sort.by = byWhat;
    vm.sort.desc = !vm.sort.desc;
  }

}

