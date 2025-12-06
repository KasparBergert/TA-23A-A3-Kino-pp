import { actors } from '@prisma/client'
import { getExistingFilmIdByTitle } from '../utils/fetch'

export async function createActorsSeed(): Promise<Omit<actors, 'id'>[]> {
  return [
    {
      name: 'Christian Bale',
      film_id: await getExistingFilmIdByTitle('The Dark Knight'),
      link: 'https://www.imdb.com/name/nm0000288/',
      image_url: 'https://upload.wikimedia.org/wikipedia/commons/2/20/Christian_Bale-7830.jpg',
    },
    {
      name: 'Heath Ledger',
      film_id: await getExistingFilmIdByTitle('The Dark Knight'),
      link: 'https://www.imdb.com/name/nm0005132/',
      image_url: 'https://upload.wikimedia.org/wikipedia/commons/0/0c/Heath_Ledger_%281%29.jpg',
    },
    {
      name: 'Leonardo DiCaprio',
      film_id: await getExistingFilmIdByTitle('Inception'),
      link: 'https://www.imdb.com/name/nm0000138/',
      image_url:
        'https://upload.wikimedia.org/wikipedia/commons/6/6f/Leonardo_Dicaprio_Cannes_2019.jpg',
    },
    {
      name: 'Joseph Gordon-Levitt',
      film_id: await getExistingFilmIdByTitle('Inception'),
      link: 'https://www.imdb.com/name/nm0330687/',
      image_url:
        'https://upload.wikimedia.org/wikipedia/commons/c/c2/Joseph_Gordon-Levitt_2013.jpg',
    },
    {
      name: 'Matthew McConaughey',
      film_id: await getExistingFilmIdByTitle('Interstellar'),
      link: 'https://www.imdb.com/name/nm0000190/',
      image_url: 'https://upload.wikimedia.org/wikipedia/commons/9/98/McConaughey_in_2011.jpg',
    },
    {
      name: 'Anne Hathaway',
      film_id: await getExistingFilmIdByTitle('Interstellar'),
      link: 'https://www.imdb.com/name/nm0004266/',
      image_url:
        'https://upload.wikimedia.org/wikipedia/commons/f/f8/Anne_Hathaway_at_the_2013_French_Open_%28cropped%29.jpg',
    },
    {
      name: 'Keanu Reeves',
      film_id: await getExistingFilmIdByTitle('The Matrix'),
      link: 'https://www.imdb.com/name/nm0000206/',
      image_url:
        'https://upload.wikimedia.org/wikipedia/commons/e/e1/Keanu_Reeves_%282015%29_%28cropped%29.jpg',
    },
    {
      name: 'Laurence Fishburne',
      film_id: await getExistingFilmIdByTitle('The Matrix'),
      link: 'https://www.imdb.com/name/nm0000401/',
      image_url:
        'https://upload.wikimedia.org/wikipedia/commons/9/9e/Laurence_Fishburne_by_Gage_Skidmore.jpg',
    },
    {
      name: 'Russell Crowe',
      film_id: await getExistingFilmIdByTitle('Gladiator'),
      link: 'https://www.imdb.com/name/nm0000128/',
      image_url: 'https://upload.wikimedia.org/wikipedia/commons/9/94/Russell_Crowe_2016.jpg',
    },
    {
      name: 'Joaquin Phoenix',
      film_id: await getExistingFilmIdByTitle('Gladiator'),
      link: 'https://www.imdb.com/name/nm0001618/',
      image_url: 'https://upload.wikimedia.org/wikipedia/commons/7/76/Joaquin_Phoenix_in_2018.jpg',
    },
    {
      name: 'Tim Robbins',
      film_id: await getExistingFilmIdByTitle('The Shawshank Redemption'),
      link: 'https://www.imdb.com/name/nm0000209/',
      image_url: 'https://upload.wikimedia.org/wikipedia/commons/9/9d/Tim_Robbins_TIFF_2012.jpg',
    },
    {
      name: 'Morgan Freeman',
      film_id: await getExistingFilmIdByTitle('The Shawshank Redemption'),
      link: 'https://www.imdb.com/name/nm0000151/',
      image_url: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/Morgan_Freeman%2C_2006.jpg',
    },
    {
      name: 'Brad Pitt',
      film_id: await getExistingFilmIdByTitle('Fight Club'),
      link: 'https://www.imdb.com/name/nm0000093/',
      image_url: 'https://upload.wikimedia.org/wikipedia/commons/5/51/Brad_Pitt_Fury_2014.jpg',
    },
    {
      name: 'Edward Norton',
      film_id: await getExistingFilmIdByTitle('Fight Club'),
      link: 'https://www.imdb.com/name/nm0001570/',
      image_url: 'https://upload.wikimedia.org/wikipedia/commons/8/88/Edward_Norton_2012.jpg',
    },
    {
      name: 'John Travolta',
      film_id: await getExistingFilmIdByTitle('Pulp Fiction'),
      link: 'https://www.imdb.com/name/nm0000237/',
      image_url:
        'https://upload.wikimedia.org/wikipedia/commons/d/d6/John_Travolta_Cannes_2018.jpg',
    },
    {
      name: 'Samuel L. Jackson',
      film_id: await getExistingFilmIdByTitle('Pulp Fiction'),
      link: 'https://www.imdb.com/name/nm0000168/',
      image_url:
        'https://upload.wikimedia.org/wikipedia/commons/9/9e/Samuel_L._Jackson_SDCC_2014.jpg',
    },
    {
      name: 'Elijah Wood',
      film_id: await getExistingFilmIdByTitle('The Lord of the Rings: The Fellowship of the Ring'),
      link: 'https://www.imdb.com/name/nm0000704/',
      image_url:
        'https://upload.wikimedia.org/wikipedia/commons/5/5a/Elijah_Wood_%2881396%29_%28cropped%29.jpg',
    },
    {
      name: 'Ian McKellen',
      film_id: await getExistingFilmIdByTitle('The Lord of the Rings: The Fellowship of the Ring'),
      link: 'https://www.imdb.com/name/nm0005212/',
      image_url:
        'https://upload.wikimedia.org/wikipedia/commons/2/21/Sir_Ian_McKellen_%28cropped%29.jpg',
    },
    {
      name: 'Viggo Mortensen',
      film_id: await getExistingFilmIdByTitle('The Lord of the Rings: The Return of the King'),
      link: 'https://www.imdb.com/name/nm0001557/',
      image_url:
        'https://upload.wikimedia.org/wikipedia/commons/f/f9/Viggo_Mortensen_Cannes_2016.jpg',
    },
    {
      name: 'Sean Astin',
      film_id: await getExistingFilmIdByTitle('The Lord of the Rings: The Return of the King'),
      link: 'https://www.imdb.com/name/nm0000276/',
      image_url:
        'https://upload.wikimedia.org/wikipedia/commons/b/b4/Sean_Astin_by_Gage_Skidmore.jpg',
    },
    {
      name: 'Jesse Eisenberg',
      film_id: await getExistingFilmIdByTitle('The Social Network'),
      link: 'https://www.imdb.com/name/nm0251986/',
      image_url:
        'https://upload.wikimedia.org/wikipedia/commons/1/10/Jesse_Eisenberg_%288296381788%29_%28cropped%29.jpg',
    },
    {
      name: 'Andrew Garfield',
      film_id: await getExistingFilmIdByTitle('The Social Network'),
      link: 'https://www.imdb.com/name/nm1940449/',
      image_url:
        'https://upload.wikimedia.org/wikipedia/commons/3/3b/Andrew_Garfield_by_Gage_Skidmore_2.jpg',
    },
  ]
}
