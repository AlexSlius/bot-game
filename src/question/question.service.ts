import { Injectable } from "@nestjs/common";
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

import { apiConfig } from 'src/common/helpers/api-config';

@Injectable()
export class QuestionService {
    constructor(private readonly http: HttpService) { }

    async createQuestion(dataBody: any): Promise<any> {
        const { data } = await firstValueFrom(
            this.http.post(`${process.env.API}questions`,
                dataBody,
                apiConfig())
        );

        return data;
    }
}