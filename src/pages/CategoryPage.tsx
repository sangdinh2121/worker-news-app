import {useParams} from "react-router-dom";

export default function CategoryPage() {
    const {slug} = useParams();
    return <h2>Danh mục: {slug}</h2>;
}