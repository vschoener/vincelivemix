import { Inject, Injectable } from '@nestjs/common';
import { XMLBuilder, XMLSerializedValue } from 'xmlbuilder2/lib/interfaces';
import { Logger } from 'winston';
import { create } from 'xmlbuilder2';

import { EpisodesService } from '../episodes/episodes.service';
import { XML_BUILDER_PROVIDER } from './constant/xmlbuilder.provider.constant';
import { ItunesService } from '../itunes/itunes.service';

@Injectable()
export class RssService {
  private readonly logger: Logger;

  public constructor(
    @Inject(XML_BUILDER_PROVIDER)
    private readonly createXmlFunction: typeof create,
    @Inject(EpisodesService) private readonly episodesService: EpisodesService,
    @Inject(ItunesService) private readonly itunesService: ItunesService,
    @Inject('winston') logger: Logger,
  ) {
    this.logger = logger.child({ context: RssService.name });
  }

  public async generate(): Promise<XMLSerializedValue> {
    const channelNode = this.generateToChannelNode();

    const settings = await this.itunesService.getSettings();

    channelNode
      .ele('title')
      .txt(settings.title)
      .up()
      .ele('description')
      .txt(settings.summary)
      .up()
      .ele('link')
      .txt(settings.link)
      .up()
      .ele('language')
      .txt(settings.language)
      .up()
      .ele('copyright')
      .txt(settings.copyright)
      .up()
      .ele('lastBuildDate')
      .txt(new Date().toUTCString())
      .up()
      .ele('atom:link')
      .att({
        href: 'http://www.vincelivemix.fr/api/rss',
        rel: 'self',
        type: 'application/rss+xml',
      })
      .up()
      .ele('itunes:author')
      .txt(settings.author)
      .up()
      .ele('itunes:summary')
      .txt(settings.summary)
      .up()
      .ele('itunes:subtitle')
      .txt(settings.subtitle)
      .up()
      .ele('itunes:owner')
      .ele('itunes:name')
      .txt(settings.ownerName)
      .up()
      .ele('itunes:email')
      .txt(settings.ownerEmail)
      .up()
      .up()
      .ele('itunes:explicit')
      .txt(settings.explicit)
      .up()
      .ele('itunes:keywords')
      .txt(settings.keywords)
      .up()
      .ele('itunes:image')
      .att({
        href: settings.image,
      })
      .up();

    settings.categories.forEach((category) => {
      channelNode.ele('itunes:category').att({ text: category });
    });

    channelNode.up();

    const channelNodeWithItems = await this.generateXmlItems(channelNode);

    // TODO: Store prettier setting in Env to disable it in production
    return channelNodeWithItems.up().end({ prettyPrint: true });
  }

  private async generateXmlItems(xmlBuilder: XMLBuilder) {
    const episodes = await this.episodesService.getPublishedEpisode();

    const settings = await this.itunesService.getSettings();

    this.logger.info('Generate items from', { episodes });

    for (const episode of episodes) {
      xmlBuilder
        .ele('item')
        .ele('title')
        .txt(episode.title)
        .up()
        .ele('description')
        .txt(episode.description)
        .up()
        .ele('pubDate')
        .txt(episode.publishedAt.toUTCString())
        .up()
        .ele('guid')
        .txt(episode.audioLink)
        .up()
        .ele('enclosure')
        .att({
          url: episode.audioLink,
          length: episode.durationAudioInSecond,
          type: 'audio/mp3',
        })
        .up()
        // iTunes fields
        .ele('itunes:duration')
        .txt(episode.itunesDuration)
        .up()
        .ele('itunes:summary')
        .txt(episode.itunesSummary)
        .up()
        .ele('itunes:image')
        .att({
          href: episode.itunesImageLink,
        })
        .up() // TODO add duration when uploading song
        .ele('itunes:keywords')
        .txt(episode.itunesKeywords)
        .up()
        .ele('itunes:explicit')
        .txt(settings.explicit)
        .up()
        .up();
    }

    return xmlBuilder;
  }

  private generateToChannelNode(): XMLBuilder {
    return this.createXmlFunction({ encoding: 'utf-8' })
      .ele('rss')
      .att({
        'xmlns:itunes': 'http://www.itunes.com/dtds/podcast-1.0.dtd',
        version: '2.0',
        'xmlns:atom': 'http://www.w3.org/2005/Atom',
      })
      .ele('channel');
  }
}
