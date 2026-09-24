import { Injectable } from "@nestjs/common";
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

import { apiConfig } from 'src/common/helpers/api-config';
import { DEFAULT_LIMIT, getPlayersLimit, PlayersLimit } from 'src/common/helpers/players-limit';

type City = { id: number; name: string; playersMin?: number | null; playersMax?: number | null };

@Injectable()
export class CityService {
    constructor(private readonly http: HttpService) { }

    async getCities(): Promise<City[]> {
        const { data } = await firstValueFrom(
            this.http.get(`${process.env.API}cities`, apiConfig())
        );

        return data;
    }

    async getCityById(id: number | string): Promise<City> {
        const { data } = await firstValueFrom(
            this.http.get(`${process.env.API}cities/${id}`, apiConfig())
        );

        return data;
    }

    async getPlayersLimit(cityId?: number | string): Promise<PlayersLimit> {
        if (!cityId) {
            return DEFAULT_LIMIT;
        }

        try {
            const city = await this.getCityById(cityId);

            return getPlayersLimit(city);
        } catch (error) {
            console.error("Не вийшло отримати ліміт гравців для міста", error);

            return DEFAULT_LIMIT;
        }
    }
}