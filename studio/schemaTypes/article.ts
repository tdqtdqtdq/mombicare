import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'article',
  title: 'Bài viết — Chuyện nhà Mombi',
  type: 'document',
  groups: [
    {name: 'content', title: 'Nội dung', default: true},
    {name: 'media', title: 'Hình ảnh'},
    {name: 'seo', title: 'SEO & xuất bản'},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Tiêu đề bài viết',
      description: 'Nên rõ ý, tự nhiên và dưới 70 ký tự.',
      type: 'string',
      group: ['content', 'seo'],
      validation: (rule) => rule.required().max(90).warning('Tiêu đề dài có thể bị cắt trên Google.'),
    }),
    defineField({
      name: 'slug',
      title: 'Đường dẫn',
      description: 'Bấm Generate sau khi nhập tiêu đề.',
      type: 'slug',
      group: 'seo',
      options: {source: 'title', maxLength: 96},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Mô tả ngắn',
      description: 'Hiển thị ở danh sách bài viết và kết quả tìm kiếm.',
      type: 'text',
      rows: 3,
      group: ['content', 'seo'],
      validation: (rule) => rule.required().min(80).warning('Nên có ít nhất 80 ký tự.').max(180).warning('Nên dưới 180 ký tự.'),
    }),
    defineField({
      name: 'mainImage',
      title: 'Ảnh đại diện',
      description: 'Khuyến nghị ảnh ngang tỷ lệ 16:9, rộng tối thiểu 1200px.',
      type: 'image',
      group: 'media',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Mô tả ảnh (Alt text)',
          description: 'Mô tả ngắn nội dung ảnh để hỗ trợ SEO và người dùng trình đọc màn hình.',
          type: 'string',
          validation: (rule) => rule.required().max(140),
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'body',
      title: 'Nội dung chi tiết',
      description: 'Dùng Tiêu đề 2 cho mục lớn, Tiêu đề 3 cho mục nhỏ; tránh dùng Tiêu đề 1 trong nội dung.',
      type: 'blockContent',
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Ngày đăng',
      type: 'date',
      group: 'seo',
      options: {dateFormat: 'DD/MM/YYYY'},
      initialValue: () => new Date().toISOString().split('T')[0],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'seo',
      title: 'Tối ưu tìm kiếm',
      description: 'Không bắt buộc. Nếu để trống, website sẽ dùng tiêu đề, mô tả và ảnh đại diện của bài.',
      type: 'object',
      group: 'seo',
      fields: [
        defineField({
          name: 'title',
          title: 'Tiêu đề SEO',
          type: 'string',
          validation: (rule) => rule.max(65).warning('Nên giữ dưới 65 ký tự để hạn chế bị cắt trên Google.'),
        }),
        defineField({
          name: 'description',
          title: 'Mô tả SEO',
          type: 'text',
          rows: 3,
          validation: (rule) => rule.max(165).warning('Nên giữ dưới 165 ký tự.'),
        }),
        defineField({
          name: 'focusKeyword',
          title: 'Chủ đề tìm kiếm chính',
          type: 'string',
          description: 'Dùng để định hướng biên tập; không hiển thị trực tiếp cho người đọc.',
        }),
        defineField({
          name: 'image',
          title: 'Ảnh chia sẻ mạng xã hội',
          type: 'image',
          description: 'Không bắt buộc. Khuyến nghị tỷ lệ 1200 × 630px.',
          options: {hotspot: true},
        }),
        defineField({
          name: 'noIndex',
          title: 'Ẩn khỏi công cụ tìm kiếm',
          type: 'boolean',
          initialValue: false,
        }),
      ],
    }),
  ],
  orderings: [
    {title: 'Mới nhất', name: 'publishedAtDesc', by: [{field: 'publishedAt', direction: 'desc'}]},
    {title: 'Tiêu đề A–Z', name: 'titleAsc', by: [{field: 'title', direction: 'asc'}]},
  ],
  preview: {
    select: {title: 'title', media: 'mainImage', date: 'publishedAt'},
    prepare({title, media, date}) {
      return {title: title || 'Bài viết chưa có tiêu đề', subtitle: date ? `Ngày đăng: ${date}` : 'Chưa chọn ngày đăng', media}
    },
  },
})
