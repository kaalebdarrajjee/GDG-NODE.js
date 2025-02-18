const lod = require('lodash')

function findMinMax(arr){
    const max = lod.max(arr)
    const min = lod.min(arr)
    console.log(`Maximum : ${max} \nMinimum : ${min}`)
}
const nums = [1,2,3,4,5]
findMinMax(nums)
/*
run:
 =>npm update to update
 =>npm uninstall to delete from node modules and package.json
 on the
 */