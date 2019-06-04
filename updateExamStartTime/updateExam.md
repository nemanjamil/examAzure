racunanje vremena u Londonu
ovo nam ne treba, london nije pocetna vremenska zona
new Date daje podatak pocetne nulte UTC zone
ovaj kod je izgleda suvisan ali da sacuvamo za svaki slucaj

function calcTime(offset) {
    d = new Date();
    utc = d.getTime() + (d.getTimezoneOffset() * 60000);
    nd = new Date(utc + (3600000 * offset));
    return nd;
}
function toTimestamp(strDate) {
    var datum = Date.parse(strDate);
    return datum / 1000;
}