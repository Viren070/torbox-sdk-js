import { z } from 'zod';

/**
 * The shape of the model inside the application code - what the users use
 */
export const getChangelogsJsonOkResponseData = z.lazy(() => {
  return z.object({
    createdAt: z.string().optional(),
    html: z.string().optional(),
    id: z.string().optional(),
    link: z.string().optional(),
    markdown: z.string().optional(),
    name: z.string().optional(),
  });
});

/**
 *
 * @typedef  {GetChangelogsJsonOkResponseData} getChangelogsJsonOkResponseData
 * @property {string}
 * @property {string}
 * @property {string}
 * @property {string}
 * @property {string}
 * @property {string}
 */
export type GetChangelogsJsonOkResponseData = z.infer<typeof getChangelogsJsonOkResponseData>;

/**
 * The shape of the model mapping from the api schema into the application shape.
 * Is equal to application shape if all property names match the api schema
 */
export const getChangelogsJsonOkResponseDataResponse = z.lazy(() => {
  return z
    .object({
      created_at: z.string().optional(),
      html: z.string().optional(),
      id: z.string().optional(),
      link: z.string().optional(),
      markdown: z.string().optional(),
      name: z.string().optional(),
    })
    .transform((data) => ({
      createdAt: data['created_at'],
      html: data['html'],
      id: data['id'],
      link: data['link'],
      markdown: data['markdown'],
      name: data['name'],
    }));
});

/**
 * The shape of the model mapping from the application shape into the api schema.
 * Is equal to application shape if all property names match the api schema
 */
export const getChangelogsJsonOkResponseDataRequest = z.lazy(() => {
  return z
    .object({
      createdAt: z.string().optional(),
      html: z.string().optional(),
      id: z.string().optional(),
      link: z.string().optional(),
      markdown: z.string().optional(),
      name: z.string().optional(),
    })
    .transform((data) => ({
      created_at: data['createdAt'],
      html: data['html'],
      id: data['id'],
      link: data['link'],
      markdown: data['markdown'],
      name: data['name'],
    }));
});
