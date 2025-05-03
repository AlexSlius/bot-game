import { Injectable } from "@nestjs/common";
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class TeamService {
    constructor(private readonly http: HttpService) { }

    async createTeam(dataBody: any): Promise<any> {
        const { data } = await firstValueFrom(
            this.http.post(`${process.env.API}teams`,
                dataBody,
                {
                    headers: {
                        "x-api-key": process.env.API_KEY
                    }
                })
        );

        return data;
    }

    async findFirst(gameId: number, chatId: string): Promise<any> {
        const { data } = await firstValueFrom(
            this.http.get(`${process.env.API}teams/register?gameId=${gameId}&chatId=${chatId}`,
                {
                    headers: {
                        "x-api-key": process.env.API_KEY
                    }
                })
        );

        return data;
    }

    async findLast(chatId: string): Promise<any> {
        const { data } = await firstValueFrom(
            this.http.get(`${process.env.API}teams/last?chatId=${chatId}`,
                {
                    headers: {
                        "x-api-key": process.env.API_KEY
                    }
                })
        );

        return data;
    }

    async update(dataBody: any) {
        const { data } = await firstValueFrom(
            this.http.patch(`${process.env.API}teams/update`,
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