import { Injectable } from "@nestjs/common";
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class GameService {
    constructor(private readonly http: HttpService) { }

    async getGameByCityId(cityId: number): Promise<any[]> {
        const { data } = await firstValueFrom(
            this.http.get(`${process.env.API}games?cityId=${cityId}`, {
                headers: {
                    "x-api-key": process.env.API_KEY
                }
            })
        );

        return data;
    }

    async getGameById(gameId: number): Promise<any> {
        const { data } = await firstValueFrom(
            this.http.get(`${process.env.API}games/${gameId}`, {
                headers: {
                    "x-api-key": process.env.API_KEY
                }
            })
        );

        return data;
    }

    async getMyGame(chatId: number, status:number): Promise<any> {
        const { data } = await firstValueFrom(
            this.http.get(`${process.env.API}games/my-game?chatId=${chatId}&status=${status}`, {
                headers: {
                    "x-api-key": process.env.API_KEY
                }
            })
        );

        return data;
    }
}