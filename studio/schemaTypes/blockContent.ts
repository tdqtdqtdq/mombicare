import {defineArrayMember, defineField, defineType} from 'sanity'

export default defineType({
  title: 'Nội dung bài viết',
  name: 'blockContent',
  type: 'array',
  of: [
    defineArrayMember({
      title: 'Đoạn văn',
      type: 'block',
      styles: [
        {title: 'Đoạn văn', value: 'normal'},
        {title: 'Tiêu đề 2', value: 'h2'},
        {title: 'Tiêu đề 3', value: 'h3'},
        {title: 'Tiêu đề 4', value: 'h4'},
        {title: 'Trích dẫn', value: 'blockquote'},
      ],
      lists: [
        {title: 'Danh sách chấm', value: 'bullet'},
        {title: 'Danh sách số', value: 'number'},
      ],
      marks: {
        decorators: [
          {title: 'In đậm', value: 'strong'},
          {title: 'In nghiêng', value: 'em'},
        ],
        annotations: [
          {
            title: 'Đường dẫn',
            name: 'link',
            type: 'object',
            fields: [
              defineField({
                title: 'URL',
                name: 'href',
                type: 'url',
                validation: (rule) => rule.required().uri({allowRelative: true, scheme: ['http', 'https', 'mailto', 'tel']}),
              }),
            ],
          },
        ],
      },
    }),
    defineArrayMember({
      title: 'Hình ảnh trong bài',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Mô tả ảnh (Alt text)',
          type: 'string',
          description: 'Bắt buộc: mô tả nội dung chính của ảnh.',
          validation: (rule) => rule.required().max(140),
        }),
        defineField({
          name: 'caption',
          title: 'Chú thích ảnh',
          type: 'string',
          description: 'Không bắt buộc. Chú thích sẽ hiển thị ngay dưới ảnh.',
        }),
      ],
      preview: {select: {title: 'caption', subtitle: 'alt', media: 'asset'}},
    }),
  ],
})
