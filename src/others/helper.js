export const getLocalDate = function (dateStr) {
  // input: ISO
  const d = new Date(dateStr); // to local and formatted
  const year = d.getFullYear() + "";
  const month = (d.getMonth() + 1 + "").padStart(2, "0");
  const date = (d.getDate() + "").padStart(2, "0");
  const hour = (d.getHours() + "").padStart(2, "0");
  const minutes = (d.getMinutes() + "").padStart(2, "0");

  return `${year}-${month}-${date} ${hour}:${minutes}`;
};

export const formatTeamName = function (name) {
  const nameArr = name.split(" ");
  if (!isNaN(+nameArr[0][0])) {
    return nameArr.slice(1).join(" ");
  } else return name;
};

export const formatName = function (name) {
  let formatted = name.split(" ").slice(0, 3);
  if (formatted.length === 3) {
    formatted[1] = formatted[1][0] + ".";
  }
  return formatted.join(" ");
};

export const formatDate = function (dateStr) {
  // to make it work on safari
  const date = new Date(dateStr.replaceAll("-", "/"));
  return new Intl.DateTimeFormat("ko-KR", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    hour12: "true",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};
