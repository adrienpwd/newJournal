export default function (r) {
  let colorClass;

  if (isNaN(r)) return 'black';

  if (r >= 1) {
    colorClass = 'green';
  } else if ((r >= 0 && r <= 1) || r === 0) {
    colorClass = 'neuter';
  } else {
    colorClass = 'red';
  }

  return colorClass;
}
