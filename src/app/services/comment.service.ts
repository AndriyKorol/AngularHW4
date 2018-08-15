import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Comment } from '../models/Comment';
import { Observable } from 'rxjs/index';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {
  private _apiUrl = environment.api_url;

  constructor(
    private _http: HttpClient
  ) { }

  getCommentsFromPost(postId: number): Observable<Comment[]> {
    return this._http.get<Comment[]>(`${this._apiUrl}/posts/${postId}/comments`);
  }

  getCommentsFromUser(userId: number): Observable<Comment[]> {
    return this._http.get<Comment[]>(`${this._apiUrl}/posts?userId=${userId}`);
  }

  getCommentById(id: number): Observable<Comment> {
    return this._http.get<Comment>(`${this._apiUrl}/comments?postId=${id}`);
  }
}
