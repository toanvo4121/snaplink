export type Post = {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  content: string;
};

// Trong dự án thật, đây sẽ là query tới CMS/DB. Giữ dạng mảng tĩnh ở đây để
// tập trung minh hoạ phần cache/SEO của Next.js thay vì tích hợp CMS ngoài.
const posts: Post[] = [
  {
    slug: 'vi-sao-can-rut-gon-link',
    title: 'Vì sao đội ngũ marketing nên rút gọn link',
    description:
      'Link ngắn dễ nhớ, dễ đo lường click, và trông chuyên nghiệp hơn khi chia sẻ trên mạng xã hội.',
    publishedAt: '2026-06-01',
    content:
      'Một link dài đầy tham số UTM vừa khó nhớ vừa dễ vỡ định dạng khi dán vào caption. Rút gọn link giải quyết cả hai vấn đề, đồng thời cho phép đo lường số click theo thời gian thực mà không cần chỉnh sửa nội dung đã đăng.',
  },
  {
    slug: 'do-luong-click-hieu-qua',
    title: 'Đo lường click hiệu quả cho chiến dịch nhỏ',
    description: 'Không cần Google Analytics phức tạp, một dashboard click đơn giản là đủ bắt đầu.',
    publishedAt: '2026-06-15',
    content:
      'Với đội nhóm nhỏ, một bảng thống kê click theo ngày và theo khu vực địa lý thường đã đủ để ra quyết định. Snaplink cung cấp đúng mức độ chi tiết đó — không thiếu, không thừa.',
  },
];

export async function getAllPosts(): Promise<Post[]> {
  'use cache';
  return posts;
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  'use cache';
  return posts.find((p) => p.slug === slug);
}
