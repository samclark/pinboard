import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable'
import 'rxjs/add/operator/map';

import { Post } from './post'

@Injectable()
export class PinboardService {

  constructor(private httpClient: HttpClient) { }

  add(authToken: string, post: Post): Observable<void> {
    let params = new HttpParams()
      .set('auth_token', authToken)
      .set('format', 'json')
      .set('url', post.url)
      .set('description', post.description);
    if (typeof post.extended !== 'undefined') {
      params = params.append('extended', post.extended);
    }
    if (typeof post.tags !== 'undefined') {
      params = params.append('tags', post.tags);
    }
    if (typeof post.shared !== 'undefined') {
      params = params.append('shared', post.shared ? 'yes' : 'no');
    }
    if (typeof post.toRead !== 'undefined') {
      params = params.append('toread', post.toRead ? 'yes' : 'no');
    }
    return this.httpClient
      .get<any>('https://api.pinboard.in/v1/posts/add', { params })
      .map(data => {
        if (data.result_code !== 'done')
          throw new Error(data.result_code);
      });
  }

  get(authToken: string, url: string): Observable<boolean> {
    let params = new HttpParams()
      .set('auth_token', authToken)
      .set('format', 'json')
      .set('url', url);
    return this.httpClient
      .get<any>('https://api.pinboard.in/v1/posts/get', { params })
      .map(data => data.posts.length > 0);
  }

  suggest(authToken: string, url: string): Observable<any> {
    let params = new HttpParams()
      .set('auth_token', authToken)
      .set('format', 'json')
      .set('url', url);
    return this.httpClient
      .get<any[]>('https://api.pinboard.in/v1/posts/suggest', { params })
      .map(data => data.reduce((p, c) => [...p, ...c.popular, ...c.recommended], []));
  }
}
