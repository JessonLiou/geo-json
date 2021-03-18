const fs = require('fs')
const adcodeMap = require('../src/utils/adcode-map.json')
const areaMap = require('../src/utils/area-map.json')

let geoJson = fs.readFileSync(`../static/file/geo-json/china/china-provinces-without-islands.json`).toString()
geoJson = JSON.parse(geoJson)

function getFeature (adcode) {
  for (let i = 0; i < geoJson.features.length; i++) {
    let feature = geoJson.features[i]
    let targetAdcode = geoJson.features[i].properties.adcode
    if (targetAdcode === adcode) {
      return feature
    }
  }

  return null
}

function generateArea () {
  console.log('================================')
  console.log('开始生成大区地图')
  console.log('================================')
  Object.keys(areaMap).forEach((key) => {
    console.log(`生成大区: \x1B[32m${key}\x1B[39m 中...`)
    let regions = areaMap[key]

    let areaData = {
      'features': []
    }
    regions.forEach((region) => {
      let adcode = adcodeMap[region]

      let feature = getFeature(adcode)
      areaData.features.push(feature)
    })
    fs.writeFileSync(`./area/${adcodeMap[key]}.json`, JSON.stringify(areaData))
    console.log(`大区: \x1B[32m${key}\x1B[39m 已生成.`)
    console.log('--------------------------------')
  })
  console.log('================================')
  console.log('大区地图已生成完毕.')
  console.log('================================')
  console.log('\n')
}

// function hasSameCoord (coord, coords) {
//   for (let i of coords) {
//     for (let j of i) {
//       for (let k of j) {
//         if (k[0] === coord[0] && k[1] === coord[1]) return true
//       }
//     }
//   }

//   return false
// }

// function mergeCoords (coords1, coords2) {
//   let res = []

//   coords1.forEach((l1) => {
//     l1.forEach((l2) => {
//       l2.forEach((l3) => {
//         if (hasSameCoord(l3, coords2)) {
//           res.push(l3)
//         }
//       })
//     })
//   })

//   return res
// }

// function mergePolygon (polygon1, polygon2) {
//   let res = []

//   for (let i = 0; i < polygon1.length; i++) {
//     let exist = hasSamePoint(polygon1[i], polygon2)
//   }
// }

// function hasSamePoint (point, polygon) {
//   return polygon.some(item => item[0] === point[0] && item[1] === point[1])
// }

// function getSameCoords (coords1, coords2) {
//   let res = []

//   coords1.forEach((l1) => {
//     l1.forEach((l2) => {
//       l2.forEach((l3) => {
//         if (hasSameCoord(l3, coords2)) {
//           res.push(l3)
//         }
//       })
//     })
//   })

//   return res
// }

// function findSameCoordIndex (coord, coords) {
//   for (let i of coords) {
//     for (let j of i) {
//       for (let k of j) {
//         if (k[0] === coord[0] && k[1] === coord[1]) return [i, j, k]
//       }
//     }
//   }

//   return null
// }

// function findSameIndex (coords1, coords2) {
//   let arr1 = []
//   let arr2 = []

//   for (let i of coords1) {
//     for (let j of i) {
//       for (let k of j) {
//         let coord2Index = findSameCoordIndex(coords1[i][j][k], coords2)

//         if (coord2Index) {
//           arr2.push(coord2Index)
//           arr1.push([i, j, k])
//         }
//       }
//     }
//   }

//   if (arr1.length > 0) {
//     return [arr1, arr2]
//   } else {
//     return null
//   }
// }

// function removeSameCoords (coords, sameIndex) {
//   let res = []

//   for (let i of coords) {
//     let l1 = []

//     for (let j of i) {
//       let l2 = []

//       for (let k of j) {
//         let exist = sameIndex.some(item => item[0] === i && item[1] === j && item[2] === k)

//         if (!exist) {
//           l2.push(coords[i][j][k])
//         }
//       }
//     }
//   }

//   return res
// }

// function generateAreaChina () {
//   let feature1 = {
//     'features': [
//       getFeature(adcodeMap['辽宁'])
//     ]
//   }
//   let feature2 = {
//     'features': [
//       getFeature(adcodeMap['吉林'])
//     ]
//   }

//   let coords1 = feature1.features[0].geometry.coordinates
//   let coords2 = feature2.features[0].geometry.coordinates

//   let sameIndex = findSameIndex(coords1, coords2)

//   if (sameIndex) {
//     coords1 = removeSameCoords(coords1, sameIndex[0])
//     coords2 = removeSameCoords(coords2, sameIndex[1])
//   }

//   // fs.writeFileSync(`./area/100000001.json`, JSON.stringify(feature1))
//   // fs.writeFileSync(`./area/100000002.json`, JSON.stringify(feature2))

//   fs.writeFileSync(`./area/same.json`, JSON.stringify(same))
// }

// generateAreaChina()

function generateChinaMap () {
  let features = []

  console.log('================================')
  console.log('生成新的中国地图（\x1B[32m大区级别\x1B[39m）...')
  console.log('================================')
  Object.keys(areaMap).forEach((key) => {
    let regions = areaMap[key]

    let regionCoords = []

    regions.forEach((region) => {
      let adcode = adcodeMap[region]

      let feature = getFeature(adcode)

      let coordinates = feature.geometry.coordinates

      regionCoords = regionCoords.concat(coordinates)
    })

    let regionFeature = {
      type: 'Feature',
      properties: {
        name: key
      },
      geometry: {
        type: 'MultiPolygon',
        coordinates: regionCoords
      }
    }

    features.push(regionFeature)
  })

  let areaData = {
    features: features
  }

  fs.writeFileSync(`./area/china.json`, JSON.stringify(areaData))
  console.log('================================')
  console.log('新的中国地图（\x1B[32m大区级别\x1B[39m）已生成.')
  console.log('================================')
  console.log('\n')
}

generateArea()
generateChinaMap()
