import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AsyncPipe, NgIf } from '@angular/common';
import { Observable, combineLatest, interval, map, startWith } from 'rxjs';

interface DateResponse {
  date: string;
}

interface TimeRemaining {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [
    NgIf,
    AsyncPipe,
  ]
})
export class AppComponent {
  private httpClient = inject(HttpClient);

  public imageUrl$ = interval(5000).pipe(
    startWith(`assets/${Math.ceil(Math.random() * 8)}.jpeg`),
    map(() => `assets/${Math.ceil(Math.random() * 8)}.jpeg`)
  );

  public dateDif$: Observable<TimeRemaining> = combineLatest([
      this.httpClient.get<DateResponse>('assets/end-date.json'),
      interval(1000)
  ]).pipe(
    map(([response, seqNumber]: [DateResponse, number]) => {
      const now = new Date();
      let dif = new Date(response.date).getTime() - now.getTime();
      const days = Math.floor(dif / (1000 * 60 * 60 * 24));
      dif = dif % (1000 * 60 * 60 * 24);
      const hours = Math.floor(dif / (1000 * 60 * 60));
      dif = dif % (1000 * 60 * 60);
      const minutes = Math.floor(dif / (1000 * 60));
      dif = dif % (1000 * 60);
      const seconds = Math.floor(dif / 1000);
      return {
        days: days.toString().padStart(2, '0'),
        hours: hours.toString().padStart(2, '0'),
        minutes: minutes.toString().padStart(2, '0'),
        seconds: seconds.toString().padStart(2, '0')
      };
    })
  );

}
