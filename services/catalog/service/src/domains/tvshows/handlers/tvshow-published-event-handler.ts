import { Logger } from '@axinom/mosaic-service-common';
import {
  TransactionalInboxMessageHandler,
  TypedTransactionalMessage,
} from '@axinom/mosaic-transactional-inbox-outbox';
import {
  PublishServiceMessagingSettings,
  TvshowPublishedEvent,
} from 'media-messages';
import { ClientBase } from 'pg';
import { deletes, insert } from 'zapatos/db';
import {
  tvshow_images,
  tvshow_licenses,
  tvshow_localizations,
  tvshow_video_cue_points,
  tvshow_video_streams,
} from 'zapatos/schema';
import { Config, syncInMemoryLocales } from '../../../common';

export class TvshowPublishedEventHandler extends TransactionalInboxMessageHandler<
  TvshowPublishedEvent,
  Config
> {
  constructor(config: Config) {
    super(
      PublishServiceMessagingSettings.TvshowPublished,
      new Logger({
        config,
        context: TvshowPublishedEventHandler.name,
      }),
      config,
    );
  }

  override async handleMessage(
    { payload }: TypedTransactionalMessage<TvshowPublishedEvent>,
    txnClient: ClientBase,
  ): Promise<void> {
    await deletes('tvshow', { id: payload.content_id }).run(txnClient);

    const insertedTvshow = await insert('tvshow', {
      id: payload.content_id,
      original_title: payload.original_title,
      released: payload.released,
      tags: payload.tags,
      tvshow_cast: payload.cast,
      studio: payload.studio,
      production_countries: payload.production_countries,
    }).run(txnClient);

    if (payload.videos) {
      for (const video of payload.videos) {
        const { video_streams, cue_points, ...videoToInsert } = video;

        const tvshowVideo = await insert('tvshow_videos', {
          tvshow_id: insertedTvshow.id,
          ...videoToInsert,
        }).run(txnClient);
        if (video_streams !== undefined) {
          await insert(
            'tvshow_video_streams',
            video_streams.map(
              (videoStream): tvshow_video_streams.Insertable => ({
                tvshow_video_id: tvshowVideo.id,
                ...videoStream,
              }),
            ),
          ).run(txnClient);
        }

        if (cue_points !== undefined) {
          await insert(
            'tvshow_video_cue_points',
            cue_points.map(
              (cuePoint): tvshow_video_cue_points.Insertable => ({
                tvshow_video_id: tvshowVideo.id,
                ...cuePoint,
              }),
            ),
          ).run(txnClient);
        }
      }
    }

    if (payload.images) {
      await insert(
        'tvshow_images',
        payload.images.map(
          (image): tvshow_images.Insertable => ({
            tvshow_id: insertedTvshow.id,
            ...image,
          }),
        ),
      ).run(txnClient);
    }

    await insert(
      'tvshow_licenses',
      payload.licenses.map(
        (license): tvshow_licenses.Insertable => ({
          tvshow_id: insertedTvshow.id,
          ...license,
        }),
      ),
    ).run(txnClient);

    if (payload.genre_ids) {
      await insert(
        'tvshow_genres_relation',
        payload.genre_ids.map((genreId, i) => ({
          tvshow_id: insertedTvshow.id,
          tvshow_genre_id: genreId,
          order_no: i,
        })),
      ).run(txnClient);
    }

    if (payload.localizations) {
      await syncInMemoryLocales(payload.localizations, txnClient);
      await insert(
        'tvshow_localizations',
        payload.localizations.map(
          (l): tvshow_localizations.Insertable => ({
            tvshow_id: payload.content_id,
            is_default_locale: l.is_default_locale,
            locale: l.language_tag,
            title: l.title,
            synopsis: l.synopsis,
            description: l.description,
          }),
        ),
      ).run(txnClient);
    }
  }
}
