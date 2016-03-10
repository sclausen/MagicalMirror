import {Pipe, PipeTransform} from 'angular2/core';

@Pipe({
  name: 'roundValue'
})
export class RoundValuePipe implements PipeTransform {
  public transform(value: string): any {
    return parseFloat(value).toFixed(1);
  }
}
