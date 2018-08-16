import { Component, OnInit, ViewChild } from '@angular/core';
import { PostService } from '../../services/post.service';
import { Post } from '../../models/Post';
import { ToastrService } from 'ngx-toastr';
import { NgForm } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommentsService } from '../../services/comment.service';
import { Comment } from '../../models/Comment';


@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {
  comment: Comment = {
    name: '',
    email: '',
    body: '',
  };
  comments: Comment[];
  post: Post = {
    title: '',
    body: '',
    email: '',
    commentsHidden: true
  };
  posts: Post[];
  postId: number = 101;
  options: object;

  @ViewChild('addForm') _form: NgForm;

  constructor(
    public postService: PostService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    public commentServise: CommentsService
  ) { }

  ngOnInit() {
    this.spinner.show();
    setTimeout(() => {
      this.postService.getPosts().subscribe((posts: Post[]) => {
        this.posts = posts;
        this.posts.forEach(post => post.commentsHidden = true);
        this.spinner.hide();
      });
    }, 800);
  }

  onDelete(id: number) {
    this.spinner.show();
    this.postService.deletePost(id).subscribe((data: Object) => {
      console.log(data);
      this.posts = this.posts.filter(post => post.id !== id);
      this.spinner.hide();
      this.toastr.success( 'Post deleted success');
    }, error => {
      this.toastr.error(error.message);
    });
  }

  toggleComments(post: Post) {
    if (post.commentsHidden) {
      this.spinner.show();

      setTimeout(() => {
        if (post.id > 100) { post.id -= 100; }

        this.commentServise.getCommentsFromPost(post.id).subscribe((comments: Comment[]) => this.comments = comments);
        post.commentsHidden = false;

        this.spinner.hide();
      }, 800);
    } else {
      post.commentsHidden = true;
    }
  }

  onSubmit() {
    this.spinner.show();

    setTimeout(() => {
      const newPost: Post = {
        id: this.postId,
        title: this.post.title,
        body: this.post.body,
        commentsHidden: true
      };

      this.postService.addPost(newPost).subscribe((post: Post) => {
        this.posts.unshift(post);
        this.spinner.hide();
        this.toastr.success(`Post "${post.title}" was created`, 'Success!', this.options);
      }, error => {
        this.spinner.hide();
        this.toastr.error( `${error.message}`, 'Error!', this.options);
      });
      this.postId += 1;
      this._form.resetForm();
    }, 800);
  }

}
