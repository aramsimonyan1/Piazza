Co dziala
Przy registration nie akceptuje usernameckrotszego niz 3 char
Przy registration nie akcceptuje invalid email (without @)
Przy registration nie akceptuje hasla krotszego niz 6 char

przy logowaniu nie maila bez @
przy logowaniu nie akceptuje nizarejestrowanego maila
przy logowaniu nie akceptuje blednego hasla
przy logowaniu wykrywa ze podane haslo ma mniej niz 6 char

Post: dziala jezeli podasz prawidlowy auth-token
Get: dziala tylko jezeli podajesz token i tylko pod warunkiem ze token jest prawidlowy 
Get by id: dziala tak samo jak wyzej + jezeli id postu jest prawidlowy

Nie wiem czy post powinien dodac sie do bazy jezeli do stworzenia postu podaje niezarejestrowanego usera Aram z tokenem Nestora
