const axios = require('axios');
const fs = require('fs');

const getImageFromUrl = (imageData) => axios.get(imageData.url, { responseType: 'arraybuffer' })
    .then(response => ({ buffer: Buffer.from(response.data, 'binary'), image: imageData }))
    .then(result => fs.writeFileSync(`../public/images/${result.image.number}.png`, result.buffer));

const makeUrl = number => `https://pokeres.bastionbot.org/images/pokemon/${number}.png`;

const makeConsecutiveArray = (size) => new Array(size).fill(0).map((_, i) => i + 1);

(async () => {

    const numbers = makeConsecutiveArray(151);
    const imagesList = numbers.map(number => ({ url: makeUrl(number), number }));
    const getImagesPromises = imagesList.map(getImageFromUrl);
    Promise.all(getImagesPromises);

})();