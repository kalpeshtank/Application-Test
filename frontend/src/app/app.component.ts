import { Component, OnDestroy } from '@angular/core';
import { ApiService } from './api.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy {
  title: string = "";
  private destroy$: Subject<void> = new Subject<void>();

  constructor(private apiData: ApiService) {
    this.apiData.getTitle().pipe(takeUntil(this.destroy$)).subscribe((title: string) => {
      this.title = title;
    });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
