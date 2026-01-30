import { defineType, defineField, defineArrayMember } from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'siteTitle',
      title: 'Site Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      options: { hotspot: true },
    }),

    defineField({
      name: 'contactEmail',
      title: 'Contact Email',
      type: 'string',
    }),
    defineField({
      name: 'contactPhone',
      title: 'Contact Phone',
      type: 'string',
    }),
    defineField({
      name: 'contactAddress',
      title: 'Contact Address',
      type: 'text',
      rows: 3,
    }),

    // ✅ Social Links
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          title: 'Social Link',
          fields: [
            defineField({
              name: 'platform',
              title: 'Platform',
              type: 'string',
            }),
            defineField({
              name: 'url',
              title: 'URL',
              type: 'url',
              validation: (Rule) => Rule.uri({ allowRelative: false }),
            }),
          ],
        }),
      ],
    }),

    // ✅ Navigation
    defineField({
      name: 'navigation',
      title: 'Navigation',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          title: 'Nav Item',
          fields: [
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'href',
              title: 'Href',
              type: 'string',
              description: 'Example: /products, /about, https://example.com',
              validation: (Rule) => Rule.required(),
            }),
          ],
        }),
      ],
    }),
  ],
})
