import { Injectable } from "@nestjs/common";
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class QuestionService {
    constructor(private readonly http: HttpService) { }

    async createQuestion(dataBody: any): Promise<any> {
        const { data } = await firstValueFrom(
            this.http.post(`${process.env.API}questions`,
                dataBody,
                {
                    headers: {
                        "x-api-key": process.env.API_KEY
                    }
                })
        );

        return data;
    }
}