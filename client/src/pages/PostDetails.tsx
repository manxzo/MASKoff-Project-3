import DefaultLayout from "@/layouts/default";
import { getPost, deletePost } from "@/services/services";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Form,
  Input,
  Link,
} from "@heroui/react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Post } from "@/config/UserConfig";

const PostDetails: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  //simulate current user
  const currentUser = { _id: "003", username: "shawn" };

  const fetchPost = async () => {
    setLoading(true);
    try {
      const data = await getPost(postId);
      setPost(data.post);
    } catch (err: any) {
      setError(err.message || "Error fetching post");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (postId) {
      fetchPost();
    }
  }, [postId]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await deletePost(postId);
        navigate("/posts");
      } catch (err: any) {
        setError(err.message || "Error deleting post");
      }
    }
  };

  const handleCommentChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setComment(e.target.value);
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // send comment to API
    // below simulation
    if (post) {
      const newComment = {
        _id: Date.now().toString(),
        content: comment,
        author: { _id: currentUser._id, username: "currentUser" },
      };
      setPost({ ...post, comments: [...post.comments, newComment] });
      setComment("");
    }
  };
  if (loading)
    return (
      <DefaultLayout>
        <p>Loading post...</p>
      </DefaultLayout>
    );
  if (error)
    return (
      <DefaultLayout>
        <p>! {error}</p>
      </DefaultLayout>
    );
  if (!post)
    return (
      <DefaultLayout>
        <p>! No post found.</p>
      </DefaultLayout>
    );

  return (
    <DefaultLayout>
      <Card>
        <CardHeader>
          <h2>{post.title}</h2>
          <p>by {post.author.username}</p>
          {currentUser._id === post.author._id && (
            <div>
              <Link href={`/posts/${post._id}/edit`}>
                <Button>Edit</Button>
              </Link>
              <Button onPress={handleDelete}>Delete</Button>
            </div>
          )}
        </CardHeader>
        <CardBody>
          <p>{post.content}</p>
          <hr />
          <h3>Comments</h3>
          {post.comments.map((comm) => (
            <div key={comm._id}>
              <p>{comm.content}</p>
              <p>by {comm.author.username}</p>
            </div>
          ))}
          <Form onSubmit={handleCommentSubmit}>
            <Input
              name="comment"
              value={comment}
              onChange={handleCommentChange}
              placeholder="Add a comment!"
              label="Comment"
            />
            <Button type="submit">Submit Comment</Button>
          </Form>
        </CardBody>
      </Card>
    </DefaultLayout>
  );
};

export default PostDetails;
