import { Component, OnInit, ViewChild } from '@angular/core';
import { PostService } from '../../services/post.service';
import { Post } from '../../models/Post';
import { ToastrService } from 'ngx-toastr';
import { NgForm } from '@angular/forms';
import { User } from '../../models/User';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommentsService } from '../../services/comment.service';
import { Comment } from '../../models/Comment';


@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {
  users: User[] = [
    {
      userId: 1,
      email: 'user1@test.com'
    },
    {
      userId: 2,
      email: 'user2@test.com'
    },
    {
      userId: 3,
      email: 'user3@test.com'
    }
  ];
  comment: Comment = {
    name: '',
    email: '',
    body: '',
  };
  comments: Comment[];
  post: Post = {
    userId: 0,
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

    let userId;
    this.spinner.show();

    setTimeout(() => {
      if (!this.users.some(user => user.email === this.post.email)) {
        userId = this.users.length + 1;
        const newUser: User = {
          userId: userId,
          email: this.post.email
        };
        this.users.push(newUser);
      } else {
        userId = this.users.filter(user => user.email.includes(this.post.email))[0].userId;
      }

      const newPost: Post = {
        userId: userId,
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
