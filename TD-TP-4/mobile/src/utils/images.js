// The web app served /images/perfume-N.jpg from its own public folder, and the
// backend only stores that path. The mobile app bundles the same pictures and
// maps them by file name. Full http(s) URLs are used as-is.
const localImages = {
  'perfume-1.jpg': require('../../assets/images/perfume-1.jpg'),
  'perfume-2.jpg': require('../../assets/images/perfume-2.jpg'),
  'perfume-3.jpg': require('../../assets/images/perfume-3.jpg'),
  'perfume-4.jpg': require('../../assets/images/perfume-4.jpg'),
}

export function getImageSource(imageUrl) {
  if (typeof imageUrl === 'string') {
    if (/^https?:\/\//i.test(imageUrl)) return { uri: imageUrl }
    const fileName = imageUrl.split('/').pop()
    if (localImages[fileName]) return localImages[fileName]
  }
  return localImages['perfume-1.jpg']
}
