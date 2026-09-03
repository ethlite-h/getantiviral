// Authentic brand marks via simple-icons (official paths, 24x24 viewBox).
import { siYoutube, siReddit, siBluesky, siSubstack, siRss, siApple, siApplepodcasts, siSpotify, siOvercast, siPocketcasts, siMastodon, siGhost, siMedium, siTiktok, siInstagram, siX, siFacebook } from 'simple-icons'

const mark = (icon, opts = {}) => {
  const { size = 24, title = icon.title, color = 'currentColor', cls = '' } = opts
  return `<svg class="brand-mark ${cls}" role="img" aria-label="${title}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="${color}" xmlns="http://www.w3.org/2000/svg"><path d="${icon.path}"/></svg>`
}

export const LOGOS = {
  youtube: siYoutube, reddit: siReddit, bluesky: siBluesky, substack: siSubstack, rss: siRss,
  apple: siApple, applepodcasts: siApplepodcasts, spotify: siSpotify, overcast: siOvercast, pocketcasts: siPocketcasts,
  mastodon: siMastodon, ghost: siGhost, medium: siMedium,
  tiktok: siTiktok, instagram: siInstagram, x: siX, facebook: siFacebook,
}

export function logo(name, opts) { return mark(LOGOS[name], opts) }
export function brandHex(name) { return '#' + LOGOS[name].hex }

// The sources Antiviral supports, in the order they should appear.
export const SOURCES = [
  { key: 'youtube', label: 'YouTube', note: 'your subscriptions' },
  { key: 'applepodcasts', label: 'Podcasts', note: 'any show with a feed' },
  { key: 'substack', label: 'Substack', note: 'the writers you pay for' },
  { key: 'rss', label: 'RSS', note: 'every blog that still has one' },
  { key: 'reddit', label: 'Reddit', note: 'the subreddits you trust' },
  { key: 'bluesky', label: 'Bluesky', note: 'your follows, in order' },
]
