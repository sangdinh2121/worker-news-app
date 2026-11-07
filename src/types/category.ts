export type CategorySlug =
    | 'thoi-su'
    | 'the-gioi'
    | 'kinh-doanh'
    | 'cong-nghe'
    | 'the-thao'
    | 'giai-tri'

export interface Category {
    name: string
    slug: CategorySlug
}
