import extrema, {extremaArray} from './extrema'
it('correctly identifies extrema on single array', ()=>{
    const arr=[5, 3, 5, 2, 4]
    const expected={min:2, max:5}
    expect(extrema(arr)).toEqual(expected)
})
it('correctly identifies extrema on multiarray', ()=>{
    const arr=[[5, 3], [5, 2, 4], [6, 4, 4]]
    const expected={min:2, max:6}
    expect(extremaArray(arr)).toEqual(expected)
})