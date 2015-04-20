export default function(number, precision) {
  if (typeof precision === 'undefined') precision = 3;
  if (typeof number !== 'number') number = parseFloat(number);
  return parseFloat(number.toPrecision(precision));
};
