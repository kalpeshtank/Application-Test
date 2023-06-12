import { Component, EventEmitter, OnInit, Output } from '@angular/core';


@Component({
  selector: 'app-global-search',
  templateUrl: './global-search.component.html',
  styleUrls: ['./global-search.component.css']
})
export class GlobalSearchComponent implements OnInit {
  searchText: string = "";
  @Output() searchDataEvent = new EventEmitter<string>();
  constructor() { }

  ngOnInit(): void {
  }
  getTableData() {
    this.searchDataEvent.emit(this.searchText);
  }

}
