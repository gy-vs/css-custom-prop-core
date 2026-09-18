import { eachTest } from 'postcss-parser-tests'
import { test } from 'uvu'
import { is } from 'uvu/assert'

import { parse, stringify } from '../lib/postcss.js'

eachTest((name, css) => {
  test(`stringifies ${name}`, () => {
    let root = parse(css)
    let result = ''
    stringify(root, i => {
      result += i
    })
    is(result, css)
  })
})

// IE property hacks (`*prop`, `_prop`) are moved to `raws.before` by
// the parser, so they must not change how the parser and the stringifier
// agree on where a declaration (and its value) ends.
let ieHackPrefixes = ['', '*', '_', '$', '#', '+']
let ieHackProps = ['--custom', 'color']
let ieHackTrailers = [
  ' /* c */}',
  ' /* c */ }',
  ' /* c */;}',
  '; /* c */}',
  '; /* c */ color: red;}',
  '}',
  ' }',
  ' !important /* c */ }'
]

for (let prefix of ieHackPrefixes) {
  for (let prop of ieHackProps) {
    for (let trailer of ieHackTrailers) {
      let css = `a{${prefix}${prop}: 1${trailer}`
      test(`stringifies ${css} without changes`, () => {
        is(parse(css).toString(), css)
      })
    }
  }
}

test.run()
