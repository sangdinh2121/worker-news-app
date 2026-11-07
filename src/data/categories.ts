import type {Category, CategorySlug} from '../types/category'

export const categories: Category[] = [
    { name: 'Thời sự', slug: 'thoi-su' },
    { name: 'Thế giới', slug: 'the-gioi' },
    { name: 'Kinh doanh', slug: 'kinh-doanh' },
    { name: 'Công nghệ', slug: 'cong-nghe' },
    { name: 'Thể thao', slug: 'the-thao' },
    { name: 'Giải trí', slug: 'giai-tri' },
]
export function getCategoryName(slug:CategorySlug): string {
    return categories.find((c) => c.slug === slug)?.name ?? slug
}
