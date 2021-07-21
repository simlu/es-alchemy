const expect = require('chai').expect;
const { v4: uuid4 } = require('uuid');
const { describe, upsert, query } = require('../../../helper-filter');

describe('Testing filter prefix', () => {
  it('Testing prefix', async () => {
    const entity1 = { id: `@${uuid4()}` };
    const entity2 = { id: `#${uuid4()}` };
    await upsert('entity', [entity1, entity2]);
    await Promise.all([
      {
        filterBy: ['id', 'prefix', '@'],
        result: [entity1]
      },
      {
        filterBy: ['id', 'prefix', '#'],
        result: [entity2]
      },
      {
        filterBy: ['id', 'notprefix', '@'],
        result: [entity2]
      },
      {
        filterBy: ['id', 'notprefix', '#'],
        result: [entity1]
      }
    ].map(async ({ filterBy, result }) => {
      expect(await query('entity', {
        toReturn: ['id'],
        filterBy
      }), `${filterBy}`).to.deep.equal(result);
    }));
  });
});
