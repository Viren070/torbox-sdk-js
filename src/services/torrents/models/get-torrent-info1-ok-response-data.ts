import { z } from 'zod';
import { DataFiles3, dataFiles3, dataFiles3Request, dataFiles3Response } from './data-files-3';

/**
 * The shape of the model inside the application code - what the users use
 */
export const getTorrentInfo1OkResponseData = z.lazy(() => {
  return z.object({
    files: z.array(dataFiles3).optional(),
    hash: z.string().optional(),
    name: z.string().optional(),
    peers: z.number().optional(),
    seeds: z.number().optional(),
    size: z.number().optional(),
    trackers: z.array(z.any()).optional(),
  });
});

/**
 *
 * @typedef  {GetTorrentInfo1OkResponseData} getTorrentInfo1OkResponseData
 * @property {DataFiles3[]}
 * @property {string}
 * @property {string}
 * @property {number}
 * @property {number}
 * @property {number}
 * @property {any[]}
 */
export type GetTorrentInfo1OkResponseData = z.infer<typeof getTorrentInfo1OkResponseData>;

/**
 * The shape of the model mapping from the api schema into the application shape.
 * Is equal to application shape if all property names match the api schema
 */
export const getTorrentInfo1OkResponseDataResponse = z.lazy(() => {
  return z
    .object({
      files: z.array(dataFiles3Response).optional(),
      hash: z.string().optional(),
      name: z.string().optional(),
      peers: z.number().optional(),
      seeds: z.number().optional(),
      size: z.number().optional(),
      trackers: z.array(z.any()).optional(),
    })
    .transform((data) => ({
      files: data['files'],
      hash: data['hash'],
      name: data['name'],
      peers: data['peers'],
      seeds: data['seeds'],
      size: data['size'],
      trackers: data['trackers'],
    }));
});

/**
 * The shape of the model mapping from the application shape into the api schema.
 * Is equal to application shape if all property names match the api schema
 */
export const getTorrentInfo1OkResponseDataRequest = z.lazy(() => {
  return z
    .object({
      files: z.array(dataFiles3Request).optional(),
      hash: z.string().optional(),
      name: z.string().optional(),
      peers: z.number().optional(),
      seeds: z.number().optional(),
      size: z.number().optional(),
      trackers: z.array(z.any()).optional(),
    })
    .transform((data) => ({
      files: data['files'],
      hash: data['hash'],
      name: data['name'],
      peers: data['peers'],
      seeds: data['seeds'],
      size: data['size'],
      trackers: data['trackers'],
    }));
});
