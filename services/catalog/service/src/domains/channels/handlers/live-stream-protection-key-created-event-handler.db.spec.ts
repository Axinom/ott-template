import { LiveStreamProtectionKeyCreatedEvent } from 'media-messages';
import { v4 as uuid } from 'uuid';
import { insert, selectOne } from 'zapatos/db';
import { createTestContext, ITestContext } from '../../../tests/test-utils';
import { LiveStreamProtectionKeyCreatedEventHandler } from './live-stream-protection-key-created-event-handler';

describe('LiveStreamProtectionKeyCreatedEventHandler', () => {
  let ctx: ITestContext;
  let handler: LiveStreamProtectionKeyCreatedEventHandler;

  beforeAll(async () => {
    ctx = await createTestContext();
    handler = new LiveStreamProtectionKeyCreatedEventHandler(
      ctx.loginPool,
      ctx.config,
    );
  });

  afterEach(async () => {
    await ctx?.truncate('channel');
  });

  afterAll(async () => {
    await ctx?.dispose();
    jest.restoreAllMocks();
  });

  describe('onMessage', () => {
    test('live stream protection key is sent, but the channel is not yet registered in catalog -> channel is not updated', async () => {
      // Arrange
      const message: LiveStreamProtectionKeyCreatedEvent = {
        channel_id: uuid(),
        key_id: uuid(),
      };

      // Act
      await handler.onMessage(message);

      // Assert
      const channel = await selectOne('channel', {
        id: message.channel_id,
      }).run(ctx.ownerPool);
      expect(channel).toBeUndefined();
    });

    test('live stream protection key is sent and channel is registered in catalog -> channel is updated', async () => {
      // Arrange
      await insert('channel', {
        id: 'channel-1',
        title: 'Old title',
        dash_stream_url: 'https://axinom-test-origin.com/channel-1.isml/.mpd',
        hls_stream_url: 'https://axinom-test-origin.com/channel-1.isml/.m3u8',
      }).run(ctx.ownerPool);
      const message: LiveStreamProtectionKeyCreatedEvent = {
        channel_id: 'channel-1',
        key_id: uuid(),
      };

      // Act
      await handler.onMessage(message);

      // Assert
      const channel = await selectOne('channel', {
        id: message.channel_id,
      }).run(ctx.ownerPool);

      expect(channel?.key_id).toEqual(message.key_id);
    });
  });
});
