import Ember from 'ember';

/**
  Convert a number in bytes to a formatted string with units

  @param sizeInBytes {number} The size of the value in bytes
  @param multiplier {number} An optional number to multiple sizeInBytes by
  @param decimalPrefix {boolean} Optionally pass in true to use decimal prefixes rather than the binary default
  @return {string} A human-readable string or null if not processable
*/
export default function(sizeInBytes, multiplier, decimalPrefix) {
  if (Ember.isEmpty(sizeInBytes) || sizeInBytes < 0) return null;
  if (typeof sizeInBytes !== 'number') sizeInBytes = parseInt(sizeInBytes);
  if (isNaN(sizeInBytes)) return null;
  if (multiplier !== undefined) {
    sizeInBytes = sizeInBytes * multiplier;
  }
  if (sizeInBytes === 0) return '0';
  // Default to binary/IEC prefixes rather than decimal/SI prefixes
  var byteUnits = (decimalPrefix) ? ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']: ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
  var power = (decimalPrefix) ? 1000 : 1024;
  var i = 0;
  while (sizeInBytes >= power) {
    sizeInBytes = sizeInBytes / power;
    i++;
  }
  return Math.max(sizeInBytes, 0.1).toFixed(1) + ' ' + byteUnits[i];
}
