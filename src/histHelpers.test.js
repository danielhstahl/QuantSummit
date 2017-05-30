import {iterateObj, histogram} from './histHelpers'
it('correctly iterates when key doesnt exist', () => {
    const obj={hello:'world'}
    const expected={hello:'world', and:1}
    expect(iterateObj(obj, 'and')).toEqual(expected)
});
it('correctly iterates when key exists', () => {
    const obj={hello:'world', and:4}
    const expected={hello:'world', and:5}
    expect(iterateObj(obj, 'and')).toEqual(expected)
});