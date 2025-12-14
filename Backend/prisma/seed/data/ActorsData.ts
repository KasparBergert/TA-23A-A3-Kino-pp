import { actor } from '@prisma/client'
import { getExistingFilmIdByTitle } from '../utils/fetch'

export async function createActorsSeed(): Promise<Omit<actor, 'id'>[]> {
  return [
    {
      name: 'Christian Bale',
      filmId: await getExistingFilmIdByTitle('The Dark Knight'),
      link: 'https://www.imdb.com/name/nm0000288/',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/20/Christian_Bale-7830.jpg',
    },
    {
      name: 'Heath Ledger',
      filmId: await getExistingFilmIdByTitle('The Dark Knight'),
      link: 'https://www.imdb.com/name/nm0005132/',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/0c/Heath_Ledger_%281%29.jpg',
    },
    {
      name: 'Leonardo DiCaprio',
      filmId: await getExistingFilmIdByTitle('Inception'),
      link: 'https://www.imdb.com/name/nm0000138/',
      imageUrl:
        'https://upload.wikimedia.org/wikipedia/commons/6/6f/Leonardo_Dicaprio_Cannes_2019.jpg',
    },
    {
      name: 'Joseph Gordon-Levitt',
      filmId: await getExistingFilmIdByTitle('Inception'),
      link: 'https://www.imdb.com/name/nm0330687/',
      imageUrl:
        'https://upload.wikimedia.org/wikipedia/commons/c/c2/Joseph_Gordon-Levitt_2013.jpg',
    },
    {
      name: 'Matthew McConaughey',
      filmId: await getExistingFilmIdByTitle('Interstellar'),
      link: 'https://www.imdb.com/name/nm0000190/',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/98/McConaughey_in_2011.jpg',
    },
    {
      name: 'Anne Hathaway',
      filmId: await getExistingFilmIdByTitle('Interstellar'),
      link: 'https://www.imdb.com/name/nm0004266/',
      imageUrl:
        'https://upload.wikimedia.org/wikipedia/commons/f/f8/Anne_Hathaway_at_the_2013_French_Open_%28cropped%29.jpg',
    },
    {
      name: 'Keanu Reeves',
      filmId: await getExistingFilmIdByTitle('The Matrix'),
      link: 'https://www.imdb.com/name/nm0000206/',
      imageUrl:
        'https://upload.wikimedia.org/wikipedia/commons/e/e1/Keanu_Reeves_%282015%29_%28cropped%29.jpg',
    },
    {
      name: 'Laurence Fishburne',
      filmId: await getExistingFilmIdByTitle('The Matrix'),
      link: 'https://www.imdb.com/name/nm0000401/',
      imageUrl:
        'https://upload.wikimedia.org/wikipedia/commons/9/9e/Laurence_Fishburne_by_Gage_Skidmore.jpg',
    },
    {
      name: 'Russell Crowe',
      filmId: await getExistingFilmIdByTitle('Gladiator'),
      link: 'https://www.imdb.com/name/nm0000128/',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/94/Russell_Crowe_2016.jpg',
    },
    {
      name: 'Joaquin Phoenix',
      filmId: await getExistingFilmIdByTitle('Gladiator'),
      link: 'https://www.imdb.com/name/nm0001618/',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/76/Joaquin_Phoenix_in_2018.jpg',
    },
    {
      name: 'Tim Robbins',
      filmId: await getExistingFilmIdByTitle('The Shawshank Redemption'),
      link: 'https://www.imdb.com/name/nm0000209/',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/9d/Tim_Robbins_TIFF_2012.jpg',
    },
    {
      name: 'Morgan Freeman',
      filmId: await getExistingFilmIdByTitle('The Shawshank Redemption'),
      link: 'https://www.imdb.com/name/nm0000151/',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/Morgan_Freeman%2C_2006.jpg',
    },
    {
      name: 'Brad Pitt',
      filmId: await getExistingFilmIdByTitle('Fight Club'),
      link: 'https://www.imdb.com/name/nm0000093/',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/51/Brad_Pitt_Fury_2014.jpg',
    },
    {
      name: 'Edward Norton',
      filmId: await getExistingFilmIdByTitle('Fight Club'),
      link: 'https://www.imdb.com/name/nm0001570/',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/88/Edward_Norton_2012.jpg',
    },
    {
      name: 'John Travolta',
      filmId: await getExistingFilmIdByTitle('Pulp Fiction'),
      link: 'https://www.imdb.com/name/nm0000237/',
      imageUrl:
        'https://upload.wikimedia.org/wikipedia/commons/d/d6/John_Travolta_Cannes_2018.jpg',
    },
    {
      name: 'Samuel L. Jackson',
      filmId: await getExistingFilmIdByTitle('Pulp Fiction'),
      link: 'https://www.imdb.com/name/nm0000168/',
      imageUrl:
        'https://upload.wikimedia.org/wikipedia/commons/9/9e/Samuel_L._Jackson_SDCC_2014.jpg',
    },
    {
      name: 'Elijah Wood',
      filmId: await getExistingFilmIdByTitle('The Lord of the Rings: The Fellowship of the Ring'),
      link: 'https://www.imdb.com/name/nm0000704/',
      imageUrl:
        'https://upload.wikimedia.org/wikipedia/commons/5/5a/Elijah_Wood_%2881396%29_%28cropped%29.jpg',
    },
    {
      name: 'Ian McKellen',
      filmId: await getExistingFilmIdByTitle('The Lord of the Rings: The Fellowship of the Ring'),
      link: 'https://www.imdb.com/name/nm0005212/',
      imageUrl:
        'https://upload.wikimedia.org/wikipedia/commons/2/21/Sir_Ian_McKellen_%28cropped%29.jpg',
    },
    {
      name: 'Viggo Mortensen',
      filmId: await getExistingFilmIdByTitle('The Lord of the Rings: The Return of the King'),
      link: 'https://www.imdb.com/name/nm0001557/',
      imageUrl:
        'https://upload.wikimedia.org/wikipedia/commons/f/f9/Viggo_Mortensen_Cannes_2016.jpg',
    },
    {
      name: 'Sean Astin',
      filmId: await getExistingFilmIdByTitle('The Lord of the Rings: The Return of the King'),
      link: 'https://www.imdb.com/name/nm0000276/',
      imageUrl:
        'https://upload.wikimedia.org/wikipedia/commons/b/b4/Sean_Astin_by_Gage_Skidmore.jpg',
    },
    {
      name: 'Jesse Eisenberg',
      filmId: await getExistingFilmIdByTitle('The Social Network'),
      link: 'https://www.imdb.com/name/nm0251986/',
      imageUrl:
        'https://upload.wikimedia.org/wikipedia/commons/1/10/Jesse_Eisenberg_%288296381788%29_%28cropped%29.jpg',
    },
    {
      name: 'Andrew Garfield',
      filmId: await getExistingFilmIdByTitle('The Social Network'),
      link: 'https://www.imdb.com/name/nm1940449/',
      imageUrl:
        'https://upload.wikimedia.org/wikipedia/commons/3/3b/Andrew_Garfield_by_Gage_Skidmore_2.jpg',
    },
  ]
}
