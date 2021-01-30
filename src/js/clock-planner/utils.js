export function getHoursDegreeAngle(hour24) {
  let hours12 = hour24 % 12;
  return hours12 * 30 - 90;
}

export function getRadian(degreeAngle) {
  return (degreeAngle * Math.PI) / 180;
}

export function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
  var angleInRadians = getRadian(angleInDegrees);

  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}

export function describeArc(x, y, radius, startAngle, endAngle) {
  var start = polarToCartesian(x, y, radius, endAngle);
  var end = polarToCartesian(x, y, radius, startAngle);

  var largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  var d = [
    "M",
    start.x,
    start.y,
    "A",
    radius,
    radius,
    0,
    largeArcFlag,
    0,
    end.x,
    end.y,
  ].join(" ");

  return d;
}
