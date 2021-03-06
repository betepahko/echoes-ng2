import {
  Component, OnInit, Input, Output,
  EventEmitter, ChangeDetectionStrategy
} from '@angular/core';
// import { NgForm } from '@angular/common';

import './player-search.less';

@Component({
  selector: 'player-search',
  template: `
    <form class="navbar-form form-search" id="media-explorer"
      (ngSubmit)="onSearch(query.value)">
      <div class="form-group clearfix">
        <input placeholder="Explore Media" id="media-search" 
          type="search" class="form-control" autocomplete="off"
          [value]="searchQuery.query" #query name="query"
          (input)="onQueryChange(query.value)"
          >
        <button class="btn btn-transparent btn-submit" type="submit" title="search with echoes">
          <i class="fa fa-search"></i>
        </button>
      </div>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlayerSearch implements OnInit {
  @Input() query;
  @Output() change = new EventEmitter();
  @Output() search = new EventEmitter();

  private searchQuery = {
    query: ''
  };

  constructor() { }

  ngOnInit() {
    this.searchQuery.query = this.query.query;
  }

  onQueryChange(query: string) {
    this.change.next(query);
  }

  onSearch(query: string) {
    this.search.next(query);
  }
}
