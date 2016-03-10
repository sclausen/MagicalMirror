import 'moment';
import {Pipe, PipeTransform} from 'angular2/core';

@Pipe({
  name: 'moment'
})
export class MomentPipe implements PipeTransform {
  public transform(value: string, args: any[]): any {
    return moment(value).format(args[0]);
  }
}
