import DefaultLayout from "@/layouts/default";
import { createPost } from "@/services/services";
import { Button, Card, CardBody, CardHeader, Form, Input } from "@heroui/react";
import { useState } from "react"
import { useNavigate } from "react-router-dom";

export const CreatePost: React.FC = () => {
    const [post, setPost] = useState({title: '', content: ''});
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setPost({...post, [name]: value});
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await createPost(post);
            navigate('/posts');
        } catch (err: any) {
            setError(err.message || 'Error creating post');
        } finally {
            setLoading(false);
        }
    }

    return (
        <DefaultLayout>
            <Card>
                <CardHeader>
                    <h2>Create New Post</h2>
                </CardHeader>
                <CardBody>
                    <Form onSubmit={handleSubmit}>
                        <Input name="title" value={post.title} onChange={handleChange} placeholder="Post Title" label="Title" />
                        <Input as="textarea" name="content" value={post.content} onChange={handleChange} placeholder="Post Content" label="Content" />
                        {error && <p>{error}</p>}
                        <Button type="submit" isLoading={loading}>
                            Create Post
                        </Button>
                    </Form>
                </CardBody>
            </Card>
        </DefaultLayout>
    )
}