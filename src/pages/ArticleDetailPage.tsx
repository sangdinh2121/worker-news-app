import {useParams} from "react-router-dom";

export default function ArticleDetailPage() {
    const id = useParams();
    return <h2>Chi tiết bài viết: {id}</h2>
}