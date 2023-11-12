Co dziala
Przy registration nie akceptuje usernameckrotszego niz 3 char
Przy registration nie akcceptuje invalid email (without @)
Przy registration nie akceptuje hasla krotszego niz 6 char

przy logowaniu nie maila bez @
przy logowaniu nie akceptuje nizarejestrowanego maila
przy logowaniu nie akceptuje blednego hasla
przy logowaniu wykrywa ze podane haslo ma mniej niz 6 char

Post: dziala jezeli podajesz token (if not: Access denied) i tylko pod warunkiem ze token jest prawidlowy (if  not: Invalid token)
Get all: dziala jezeli podajesz token (if not: Access denied) i tylko pod warunkiem ze token jest prawidlowy (if  not: Invalid token)

Get by id: dziala tak samo jak wyzej + jezeli id postu jest prawidlowy
Nie wiem czy post powinien dodac post do bazy jezeli do stworzenia postu podaje niezarejestrowanego usera Aram z tokenem Nestora

Patch: dziala przy auth-token (jak ni)
Delete: dziala przy auth-token (otherwise Access denied / Invalid token)
Delete: jak jest incorrect id it shows error


 "username": "Mary",
 "email": "mary@cloud.com",
 "password": "mary123"

 "username": "Olga",
 "email": "olga@cloud.com",
 "password": "olga123"

 "username": "Nick",
 "email": "nick@cloud.com",
 "password": "nick123"

 "username": Nestor
 "email": "nestor@cloud.com
 "password": "N12345"