users
 user_id
 name
 gmail
 password

roles 
 role_id
 name -- admin or client only

films
 film_id
 title
 img_url
 body
 release_date

genres
  genre_id
  name

-- the same film can have multiple genres and a genre can be applied to multiple films.
film_genre
 film_id
 genre_id

theaters
 theater_id
 name

Näiteks Saal 2
hall
 hall_id
 theater_id -- ühendatud enda kinoga
 name

tickets
 ticket_id
 film_id
 hall_id
 price
 showtime Date


indexing film by title