function dateDDMMYYY(date, ignoreTime) {

  if (!date || date == '') {
    return '';
  }

  date = new Date(date);

  // return date;

  let seconds = date.getSeconds();
  let minutes = date.getMinutes();
  let hours = date.getHours();
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();

  seconds = seconds < 10 ? String('0' + seconds) : String(seconds);
  minutes = minutes < 10 ? String('0' + minutes) : String(minutes);
  hours = hours < 10 ? String('0' + hours) : String(hours);
  day = day < 10 ? String('0' + day) : String(day);
  month = month < 10 ? String('0' + month) : String(month);

  let result = day + '/' + month + '/' + year;
  if (!ignoreTime) {
    result += ' ' + hours + ':' + minutes + ':' + seconds
  }

  return result;
}
