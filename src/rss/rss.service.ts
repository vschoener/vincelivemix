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
        .ele('pubDate').txt(episode.publishedAt.toISOString()).up()
        // .ele('link').txt(episode.link).up() TODO: add link field
        .ele('enclosure').att({
          url: 'link', // TODO: Get link from "episode.link"
          length: 'duration_mp3', // TODO:  Calculate duration when uploading song in seconds
          type: 'audio/mpeg' // TODO: UPDATE type when uploading song
        }).up()
        .ele('guid').txt('link').up()
        // iTunes fields
        .ele('itunes:duration').txt('itunes_duration').up() // TODO add duration when uploading song
        .ele('itunes:summary').txt('itunes_summary').up() // TODO add duration when uploading song
        .ele('itunes:image').att({
          href: 'link'
        }).up() // TODO add duration when uploading song
        .ele('itunes:keywords').txt('keywords').up()
        .ele('itunes:explicit').txt('no').up()
      .up();
    }

    return xmlBuilder;
  }

  public async generate(): Promise<XMLSerializedValue> {
    // TODO: Put public fields in Env variables or db config table
    const xmlBuilder = this.createXmlFunction({ encoding: 'utf-8' })
      .ele('channel')
        .ele('title').txt('Vince Live Mix').up()
        .ele('description').txt('Feel the vibe of the sound').up()
        .ele('link').txt('http://www.vincelivemix.fr').up()
        .ele('language').txt('fr-fr').up()
        .ele('copyright').txt('Vincent Schoener copyright 2020').up()
        .ele('lastBuildDate').txt((new Date()).toISOString()).up()
        .ele('itunes:author').txt('Vincent Schoener').up()
        .ele('itunes:summary').txt(
          'Live mix est un concentré de son House Electro allant du commercial à l\'inconnu. ' +
        'Ces sets ont pour but de vous emmener dans un monde de musique unique afin de vous donner l\'envie de danser n\'importe où, n\'importe quand ! :)\n').up()
        .ele('itunes:subtitle').txt('Feel the vibe of the sound').up()
        .ele('itunes:owner')
          .ele('name').txt('Vincent Schoener').up()
          .ele('email').txt('vincent.schoener@gmail.com').up()
        .up()
        .ele('itunes:explicit').txt('No').up()
        .ele('itunes:keywords').txt('Vince live mix electro house edm dj mixing').up()
        .ele('itunes:image').att({
          href: 'link'
        }).up()
        .ele('itunes:category').txt('Music')
      .up()
      .att({
        'xmlns:itunes': 'http://www.itunes.com/dtds/podcast-1.0.dtd',
        'version': '2.0',
        'xmlns:atom': 'http://www.w3.org/2005/Atom',
      });

    const xmlBuilderItemState = await this.generateXmlItems(xmlBuilder);

    return xmlBuilderItemState.up().end();
  }
}
