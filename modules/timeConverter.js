export function timeConverter(UNIX_timestamp) {
    let a = new Date(UNIX_timestamp * 1000);
    let months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
    let year = a.getFullYear();
    let month = months[a.getMonth()];
    let date = a.getDate();
    let hour = a.getHours();
    let min = String(a.getMinutes()).padStart(2, '0');
    let sec = a.getSeconds();
    let time = `${date}.${month} ${hour}:${min}`;
    return time;
}