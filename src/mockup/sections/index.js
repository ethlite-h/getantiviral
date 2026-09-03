// Section order = the story order. Each module exports { html, init? }.
import * as hero from './hero.js'
import * as confession from './confession.js'
import * as machine from './machine.js'
import * as turn from './turn.js'
import * as loop from './loop.js'
import * as edition from './edition.js'
import * as editor from './editor.js'
import * as missing from './missing.js'
import * as evidence from './evidence.js'
import * as architecture from './architecture.js'
import * as ledger from './ledger.js'
import * as maker from './maker.js'
import * as lastpage from './lastpage.js'

export const SECTIONS = [
  { name: 'hero', ...hero },
  { name: 'confession', ...confession },
  { name: 'machine', ...machine },
  { name: 'turn', ...turn },
  { name: 'loop', ...loop },
  { name: 'edition', ...edition },
  { name: 'editor', ...editor },
  { name: 'missing', ...missing },
  { name: 'evidence', ...evidence },
  { name: 'architecture', ...architecture },
  { name: 'ledger', ...ledger },
  { name: 'maker', ...maker },
  { name: 'lastpage', ...lastpage },
]
