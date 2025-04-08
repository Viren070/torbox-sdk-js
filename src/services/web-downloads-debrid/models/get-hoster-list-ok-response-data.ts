import { z } from 'zod';

/**
 * The shape of the model inside the application code - what the users use
 */
export const getHosterListOkResponseData = z.lazy(() => {
  return z.object({
    dailyBandwidthLimit: z.number().optional(),
    dailyBandwidthUsed: z.number().optional(),
    dailyLinkLimit: z.number().optional(),
    dailyLinkUsed: z.number().optional(),
    domains: z.array(z.string()).optional(),
    domais: z.array(z.string()).optional(),
    domaisn: z.array(z.string()).optional(),
    icon: z.string().optional(),
    limit: z.number().optional(),
    name: z.string().optional(),
    note: z.string().optional().nullable(),
    status: z.boolean().optional(),
    type: z.string().optional(),
    url: z.string().optional(),
  });
});

/**
 *
 * @typedef  {GetHosterListOkResponseData} getHosterListOkResponseData
 * @property {number}
 * @property {number}
 * @property {number}
 * @property {number}
 * @property {string[]}
 * @property {string[]}
 * @property {string[]}
 * @property {string}
 * @property {number}
 * @property {string}
 * @property {string}
 * @property {boolean}
 * @property {string}
 * @property {string}
 */
export type GetHosterListOkResponseData = z.infer<typeof getHosterListOkResponseData>;

/**
 * The shape of the model mapping from the api schema into the application shape.
 * Is equal to application shape if all property names match the api schema
 */
export const getHosterListOkResponseDataResponse = z.lazy(() => {
  return z
    .object({
      daily_bandwidth_limit: z.number().optional(),
      daily_bandwidth_used: z.number().optional(),
      daily_link_limit: z.number().optional(),
      daily_link_used: z.number().optional(),
      domains: z.array(z.string()).optional(),
      domais: z.array(z.string()).optional(),
      domaisn: z.array(z.string()).optional(),
      icon: z.string().optional(),
      limit: z.number().optional(),
      name: z.string().optional(),
      note: z.string().optional().nullable(),
      status: z.boolean().optional(),
      type: z.string().optional(),
      url: z.string().optional(),
    })
    .transform((data) => ({
      dailyBandwidthLimit: data['daily_bandwidth_limit'],
      dailyBandwidthUsed: data['daily_bandwidth_used'],
      dailyLinkLimit: data['daily_link_limit'],
      dailyLinkUsed: data['daily_link_used'],
      domains: data['domains'],
      domais: data['domais'],
      domaisn: data['domaisn'],
      icon: data['icon'],
      limit: data['limit'],
      name: data['name'],
      note: data['note'],
      status: data['status'],
      type: data['type'],
      url: data['url'],
    }));
});

/**
 * The shape of the model mapping from the application shape into the api schema.
 * Is equal to application shape if all property names match the api schema
 */
export const getHosterListOkResponseDataRequest = z.lazy(() => {
  return z
    .object({
      dailyBandwidthLimit: z.number().optional(),
      dailyBandwidthUsed: z.number().optional(),
      dailyLinkLimit: z.number().optional(),
      dailyLinkUsed: z.number().optional(),
      domains: z.array(z.string()).optional(),
      domais: z.array(z.string()).optional(),
      domaisn: z.array(z.string()).optional(),
      icon: z.string().optional(),
      limit: z.number().optional(),
      name: z.string().optional(),
      note: z.string().optional().nullable(),
      status: z.boolean().optional(),
      type: z.string().optional(),
      url: z.string().optional(),
    })
    .transform((data) => ({
      daily_bandwidth_limit: data['dailyBandwidthLimit'],
      daily_bandwidth_used: data['dailyBandwidthUsed'],
      daily_link_limit: data['dailyLinkLimit'],
      daily_link_used: data['dailyLinkUsed'],
      domains: data['domains'],
      domais: data['domais'],
      domaisn: data['domaisn'],
      icon: data['icon'],
      limit: data['limit'],
      name: data['name'],
      note: data['note'],
      status: data['status'],
      type: data['type'],
      url: data['url'],
    }));
});
