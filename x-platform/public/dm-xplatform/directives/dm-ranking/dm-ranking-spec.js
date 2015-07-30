/* globals describe,it,expect */
'use strict';

import {RankingDir} from './dm-ranking';

describe('RankingDir', function () {
  it('should generate ranks', function () {
    // given
    var ranking = [
      {}
    ];
    var groups = [
      {
        name: 'a',
        ranks: [],
        users: []
      }
    ];
    var cut = new RankingDir({});

    // when
    cut.generateGroupsWithRanks(ranking, groups);
    var result = groups;

    // then
    expect(result).toBe([
      {
        name: 'a',
        ranks: []
      }
    ]);
  });
});
