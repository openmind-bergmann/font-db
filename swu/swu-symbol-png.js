
const svg2img = require('svg2img');
const { symbolSvg } = require('./swu-symbol-svg');
const fs = require('fs');

/**
 * Function that creates a binary PNG image from an SWU symbol key with an optional stle string
 * @function swu.symbolPng
 * @param {string} swuSym - an SWU symbol key with optional style string
 * @param {function} callback - a callback function with error and result parameters
 * @example
 * const callback = (error, result) => {
 *   if (error) {
 *     console.log(error)
 *   } else {
 *     console.log(result + " is '<Buffer 89 50 4e 47...")
 *   }
 * }
 * 
 * swu.symbolPng('񀀁', callback )
 */
const symbolPng = (swuSym, callback) => {
  symbolSvg(swuSym, (err, res) => {
    if (err) {
      callback(err, null);
    } else {
      res = res.replace(/<text.*text>/g, "");
      svg2img(res, (error, buffer) => {
        if (error) {
          callback(error, null);
        } else {
          callback(error, buffer);
        }
      })
    }
  })
}

/**
 * Function that creates a data url PNG image from an SWU symbol key with an optional stle string
 * @function swu.symbolPngDataUrl
 * @param {string} swuSym - an SWU symbol key with optional style string
 * @param {function} callback - a callback function with error and result parameters
 * @example
 * const callback = (error, result) => {
 *   if (error) {
 *     console.log(error)
 *   } else {
 *     console.log(result + " is 'data:image/png;base64,iVBORw...")
 *   }
 * }
 * 
 * swu.symbolPndDataUrl('񀀁', callback )
 */
const symbolPngDataUrl = (swuSym, callback) => {
  symbolPng(swuSym, (err, res) => {
    if (err) {
      callback(err, null);
    } else {
      return callback(err, 'data:image/png;base64,' + res.toString('base64'));
    }
  })
}

if (require.main === module) {
  if (process.argv[3]) {
    symbolPng(process.argv[2], (err, res) => {
      if (err) {
        console.log(err)
      } else {
        fs.writeFileSync(process.argv[3], res);
      }
    })
  } else {
    symbolPngDataUrl(process.argv[2], (err, res) => {
      console.log(err || res)
    })
  }
} else {
  module.exports = { symbolPng, symbolPngDataUrl }
}