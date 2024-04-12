import {Pipe, PipeTransform} from '@angular/core';

const FILE_SIZE_UNITS = ['B', 'KB', 'MB', 'GB', 'TB'];
const FILE_SIZE_UNITS_LONG = ['Bytes', 'Kilobytes', 'Megabytes'];

@Pipe({
  name: 'fileSize',
})
export class FileSizePipe implements PipeTransform {
  transform(sizeInBytes: number, longForm: boolean): string {
    const units = longForm ? FILE_SIZE_UNITS_LONG : FILE_SIZE_UNITS;

    let power = Math.round(Math.log(sizeInBytes) / Math.log(1024));
    power = Math.min(power, units.length - 1);

    // size in new units
    const size = sizeInBytes / Math.pow(1024, power);

    // keep up two 2 decimals
    const formattedSize = Math.round(size * 100);

    const unit = units[power];
    return size ? `${formattedSize} ${unit}` : '0';
  }
}
