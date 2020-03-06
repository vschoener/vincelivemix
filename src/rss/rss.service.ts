import { Inject, Injectable } from '@nestjs/common';

import { XML_BUILDER_PROVIDER } from './constant/xmlbuilder.provider.constant';
import { EpisodesService } from '../episodes/episodes.service';
import { XMLBuilder, XMLSerializedValue } from 'xmlbuilder2/lib/interfaces';
import { Logger } from 'winston';
import { create } from 'xmlbuilder2';

@Injectable()
export class RssService {
  private readonly logger: Logger;

  public constructor(
    @Inject(XML_BUILDER_PROVIDER) private readonly createXmlFunction: typeof create,
    @Inject(EpisodesService) private readonly episodesService: EpisodesService,
    @Inject('winston') logger: Logger
  ) {
    this.logger = logger.child({ context: RssService.name } )
  }

  private async generateXmlItems(xmlBuilder: XMLBuilder) {
    const episodes = await this.episodesService.getEpisodes({
      order: {
        publishedAt: 'DESC'
      }
    });

    this.logger.info('Generate items from', { episodes });

    for (const episode of episodes) {
      xmlBuilder.ele('item')
        .ele('title').txt(episode.title).up()
        .ele('description').txt(episode.description).up()
        .ele('pubDate').txt(episode.publishedAt.toUTCString()).up()
        .ele('guid').txt(episode.audioLink).up()
        .ele('enclosure').att({
          url: episode.audioLink,
          length: 0, // TODO:  Calculate duration when uploading song in seconds
          type: 'audio/mp3' // TODO: UPDATE type when uploading song
        }).up()
        // iTunes fields
        .ele('itunes:duration').txt('0').up() // TODO add duration when uploading song
        .ele('itunes:summary').txt('itunes_summary').up() // TODO add duration when uploading song
        .ele('itunes:image').att({
          href: episode.itunesImageLink
        }).up() // TODO add duration when uploading song
        .ele('itunes:keywords').txt('keywords').up()
        .ele('itunes:explicit').txt('no').up()
      .up();
    }

    return xmlBuilder;
  }

  private generateToChannelNode(): XMLBuilder {
    return this.createXmlFunction({ encoding: 'utf-8' })
      .ele('rss').att({
      'xmlns:itunes': 'http://www.itunes.com/dtds/podcast-1.0.dtd',
      'version': '2.0',
      'xmlns:atom': 'http://www.w3.org/2005/Atom',
    }).ele('channel');
  }

  public async generate(): Promise<XMLSerializedValue> {
    const channelNode = this.generateToChannelNode();

    // TODO: Put public fields in Env variables or db config table
    channelNode
      .ele('title').txt('Vince Live Mix').up()
      .ele('description').txt('Feel the vibe of the sound').up()
      .ele('link').txt('http://www.vincelivemix.fr').up()
      .ele('language').txt('fr-fr').up()
      .ele('copyright').txt('Vincent Schoener copyright 2020').up()
      .ele('lastBuildDate').txt((new Date()).toUTCString()).up()
      .ele('atom:link').att({
        href: 'http://www.vincelivemix.fr/api/rss',
        rel: 'self',
        type: 'application/rss+xml'
      }).up()
      .ele('itunes:author').txt('Vincent Schoener').up()
      .ele('itunes:summary').txt(
        'Live mix est un concentré de son House Electro allant du commercial à l\'inconnu. ' +
      'Ces sets ont pour but de vous emmener dans un monde de musique unique afin de vous donner l\'envie de danser n\'importe où, n\'importe quand ! :)\n').up()
      .ele('itunes:subtitle').txt('Feel the vibe of the sound').up()
      .ele('itunes:owner')
        .ele('itunes:name').txt('Vincent Schoener').up()
        .ele('itunes:email').txt('vincent.schoener@gmail.com').up()
      .up()
      .ele('itunes:explicit').txt('No').up()
      .ele('itunes:keywords').txt('Vince live mix, electro, house, edm, dj, mixing').up()
      .ele('itunes:image').att({
        href: 'https://vincelivemix.s3.eu-west-3.amazonaws.com/images/podcast/vincelivemix-main.jpg'
      }).up()
      .ele('itunes:category').att({ text: 'Music' })
    .up();

    const channelNodeWithItems = await this.generateXmlItems(channelNode);

    // TODO: Store prettier setting in Env to disable it in production
    return channelNodeWithItems.up().end({ prettyPrint: true });
  }
}
