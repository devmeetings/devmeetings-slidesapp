var Q = require('q');
var logger = require('../../../config/logging');
var Event = require('../../models/event');
var _ = require('lodash');

var hardcodedDashboard = {
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
      },
      logs: [
        {
          description: 'Task 2.4 was done by Kuba Bartczuk',
          data: 10.55
        },
        {
          description: 'Task 2.1 was done by Kuba Rudnicki',
          data: 10.54
        },
        {
          description: 'Iteration 2 started',
          data: 10.53
        },
        {
          description: 'Task 1.8 was done by Kasia Jankowska',
          data: 10.52
        },
        {
          description: 'Task 1.9 was done by Bruno Gałka',
          data: 10.51
        }
      ]
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
      },
      logs: [
        {
          description: 'Task 2.4 was done by Kuba Bartczuk',
          data: 10.55
        },
        {
          description: 'Task 2.1 was done by Kuba Rudnicki',
          data: 10.54
        },
        {
          description: 'Iteration 2 started',
          data: 10.53
        },
        {
          description: 'Task 1.8 was done by Kasia Jankowska',
          data: 10.52
        },
        {
          description: 'Task 1.9 was done by Bruno Gałka',
          data: 10.51
        }
      ]
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
      },
      logs: [
        {
          description: 'Task 2.4 was done by Kuba Bartczuk',
          data: 10.55
        },
        {
          description: 'Task 2.1 was done by Kuba Rudnicki',
          data: 10.54
        },
        {
          description: 'Iteration 2 started',
          data: 10.53
        },
        {
          description: 'Task 1.8 was done by Kasia Jankowska',
          data: 10.52
        },
        {
          description: 'Task 1.9 was done by Bruno Gałka',
          data: 10.51
        }
      ]
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
      },
      logs: [
        {
          description: 'Task 2.4 was done by Kuba Bartczuk',
          data: 10.55
        },
        {
          description: 'Task 2.1 was done by Kuba Rudnicki',
          data: 10.54
        },
        {
          description: 'Iteration 2 started',
          data: 10.53
        },
        {
          description: 'Task 1.8 was done by Kasia Jankowska',
          data: 10.52
        },
        {
          description: 'Task 1.9 was done by Bruno Gałka',
          data: 10.51
        }
      ]
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
      },
      logs: [
        {
          description: 'Task 2.4 was done by Kuba Bartczuk',
          data: 10.55
        },
        {
          description: 'Task 2.1 was done by Kuba Rudnicki',
          data: 10.54
        },
        {
          description: 'Iteration 2 started',
          data: 10.53
        },
        {
          description: 'Task 1.8 was done by Kasia Jankowska',
          data: 10.52
        },
        {
          description: 'Task 1.9 was done by Bruno Gałka',
          data: 10.51
        }
      ]
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
      },
      logs: [
        {
          description: 'Task 2.4 was done by Kuba Bartczuk',
          data: 10.55
        },
        {
          description: 'Task 2.1 was done by Kuba Rudnicki',
          data: 10.54
        },
        {
          description: 'Iteration 2 started',
          data: 10.53
        },
        {
          description: 'Task 1.8 was done by Kasia Jankowska',
          data: 10.52
        },
        {
          description: 'Task 1.9 was done by Bruno Gałka',
          data: 10.51
        }
      ]
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
      },
      logs: [
        {
          description: 'Task 2.4 was done by Kuba Bartczuk',
          data: 10.55
        },
        {
          description: 'Task 2.1 was done by Kuba Rudnicki',
          data: 10.54
        },
        {
          description: 'Iteration 2 started',
          data: 10.53
        },
        {
          description: 'Task 1.8 was done by Kasia Jankowska',
          data: 10.52
        },
        {
          description: 'Task 1.9 was done by Bruno Gałka',
          data: 10.51
        }
      ]
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
      },
      logs: [
        {
          description: 'Task 2.4 was done by Kuba Bartczuk',
          data: 10.55
        },
        {
          description: 'Task 2.1 was done by Kuba Rudnicki',
          data: 10.54
        },
        {
          description: 'Iteration 2 started',
          data: 10.53
        },
        {
          description: 'Task 1.8 was done by Kasia Jankowska',
          data: 10.52
        },
        {
          description: 'Task 1.9 was done by Bruno Gałka',
          data: 10.51
        }
      ]
    }
  ]
};
// end of model hardcodedDashboard

logger.info('Loading dashboard plugin.');
exports.onSocket = function (log, socket, io) {
  'use strict';

  logger.info('New client conntected to dashboard');

  socket.on('dashboard.fetch', fetchDashboardForClient);

  function fetchDashboardForClient (data, ack) {
    logger.info('Client is fetching dashboard.');

    getDashboard(hardcodedDashboard).done(function (dashboard) {
      logger.info('Sending dashboard to client');
      ack(dashboard);
    });
  }
};

function getVisibleEvents () {
  var eventFields = 'name title pin description image order visible shouldRedirectToUnsafe';

  return Q.when(Event.find({
    removed: {
      $ne: true
    },
    visible: {
      // change line below - simply i don't know syntax to retrive existing value
      $ne: false
    }
  }).select(eventFields).lean().exec());
}

function makeDashboardModel (hardcodedDashboard, visibleEvents) {
  logger.info('TEST!!!');
  var activeEvents = _.map(visibleEvents, function (event) {
    var e = hardcodedDashboard.activeEvents[1]; // 0 is too big
    e._id = event._id;
    e.name = event.name;
    logger.info(e._id);
    logger.info(e.name);
    return e;
  });

  /* for (var event of visibleEvents) { // for of comes from ES6 - it's no ES6?
    var e = hardcodedDashboard.activeEvents[1]; // 0 is too big
    e._id = event._id;
    e.name = event.name;
    activeEvents.push(e);
  }*/
  logger.info('activeEvents', activeEvents);
  return {
    activeEvents: activeEvents
  };
}

function getDashboard (hardcodedDashboard) {

  logger.info('Getting dashboard for him.');

  var dashboard = getVisibleEvents().then(function (visibleEvents) {
    return makeDashboardModel(hardcodedDashboard, visibleEvents);
  });

  return dashboard;
}