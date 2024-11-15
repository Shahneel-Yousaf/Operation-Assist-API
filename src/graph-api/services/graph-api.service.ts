import { ConfidentialClientApplication } from '@azure/msal-node';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppLogger } from '@shared/logger/logger.service';
import { RequestContext } from '@shared/request-context/request-context.dto';
import axios from 'axios';

@Injectable()
export class GraphAPIService {
  private clientId: string;
  private clientSecret: string;
  private tenantId: string;
  private authority: string;
  private cca: ConfidentialClientApplication;
  private tokenRequest: Record<string, any[]>;

  constructor(
    private readonly configService: ConfigService,
    private readonly appLogger: AppLogger,
  ) {
    this.appLogger.setContext(GraphAPIService.name);

    this.clientId = this.configService.get<string>('azure.graphApi.clientId');
    this.clientSecret = this.configService.get<string>(
      'azure.graphApi.clientSecret',
    );
    this.tenantId = this.configService.get<string>('azure.graphApi.tenantId');
    this.authority = `https://login.microsoftonline.com/${this.tenantId}`;
    const msalConfig = {
      auth: {
        clientId: this.clientId,
        authority: this.authority,
        clientSecret: this.clientSecret,
      },
    };
    this.tokenRequest = {
      scopes: ['https://graph.microsoft.com/.default'],
    };
    this.cca = new ConfidentialClientApplication(msalConfig);
  }

  async deleteB2CUser(ctx: RequestContext, oid: string) {
    this.appLogger.log(ctx, `${this.deleteB2CUser.name} was called`);

    const endpoint = `https://graph.microsoft.com/v1.0/users/${oid}`;
    const authResponse = await this.cca.acquireTokenByClientCredential(
      this.tokenRequest,
    );

    const options = {
      headers: {
        Authorization: `Bearer ${authResponse.accessToken}`,
      },
    };

    await axios.delete(endpoint, options);
  }
}
