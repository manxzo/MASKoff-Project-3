import DefaultLayout from "@/layouts/default";
import { getPosts } from "@/services/services";
import { Card, CardBody, CardHeader } from "@heroui/react";
import React, { useEffect, useState } from "react";
interface Post {
    _id: string;
    title: string;
    content: string;
    author: {username: string};
}

export const PostsList: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            try {
                const data = await getPosts();
                setPosts(data.posts);
            } catch (err: any) {
                setError(err.message || 'Error fetching posts');
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    return (
        <DefaultLayout>
            <div>
                <h1>Community Posts</h1>
                {loading && <p>Loading posts...</p>}
                {error && <p>{error}</p>}
                {posts.map((post) => (
                    <Card key={post._id}>
                        <CardHeader>
                            <h2>{post.title}</h2>
                        </CardHeader>
                        <CardBody>
                            <p>{post.content}</p>
                            <p>by {post.author.username}</p>
                        </CardBody>
                    </Card>
                ))}
            </div>
        </DefaultLayout>
    )
}