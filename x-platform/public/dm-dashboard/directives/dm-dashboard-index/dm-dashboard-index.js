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
    vm.model = {
      activeEvents: [
      // Wroclaw
      {
        _id: '12345xxx',
        name: 'Responsive Web Design Wroclaw',
        timing: {
          started: true,
          startedAt: 9.00,
          expectedEnd: 16.00
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
                avatar: 'https:https://www.gravatar.com/avatar/1dc4a7d97cb29cf81d0c58bc1a17a5af'
              }
            ]
          }
        },
        currentStage: 'Iteration 3',
        reportedProblems: [
          {
            title: 'Brak Internetu',
            description: 'Nie mamy dostepu do Internetu'
          },
          {
            title: 'Brak wody',
            description: 'Brak wody, nie mozna sie napic, umieramy z pragnienia'
          },
          {
            title: 'Mentor Chory',
            description: 'Jeden Mentor - Kuba Xiniski jest chory i nie przyjechal'
          },
          {
            title: 'Lorem Ipsum dolor',
            description: 'Lorem Ipsum jest tekstem stosowanym jako przykładowy wypełniacz w przemyśle poligraficznym. Został po raz pierwszy użyty w XV w. przez nieznanego drukarza do wypełnienia tekstem próbnej książki. Pięć wieków później zaczął być używany przemyśle elektronicznym, pozostając praktycznie niezmienionym. Spopularyzował się w latach 60. XX w. wraz z publikacją arkuszy Letrasetu, zawierających fragmenty Lorem Ipsum, a ostatnio z zawierającym różne wersje Lorem Ipsum oprogramowaniem przeznaczonym do realizacji druków na komputerach osobistych, jak Aldus PageMaker.'
          }
        ],
        ranking: {

        },
        streaming: {
          active: true,
          url: 'https://www.youtube.com/embed/1G4isv_Fylg?list=RD1G4isv_Fylg'
        }
      },
      // Warszawa
      {
        _id: '12345xxx',
        name: 'Responsive Web Design Warszawa',
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
        currentStage: 'Iteration 0',
        reportedProblems: [],
        ranking: {

        },
        streaming: {
          active: true,
          url: 'https://www.youtube.com/embed/1G4isv_Fylg?list=RD1G4isv_Fylg'
        }
      },
      // Poznan
      {
        _id: '12345xxx',
        name: 'Responsive Web Design Krakow',
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
        currentStage: 'Iteration 2',
        reportedProblems: [],
        ranking: {

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

}

