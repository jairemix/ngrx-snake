import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pixels',
  pure: true,
})
export class PixelsPipe implements PipeTransform {
  transform(value: number) {
    return value + 'px';
  }
}
