import { Injectable } from "@nestjs/common";
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

import { apiConfig } from 'src/common/helpers/api-config';

@Injectable()
export class CityService {
    constructor(private readonly http: HttpService) { }

    async getCities(): Promise<{ id: number; name: string }[]> {
        const { data } = await firstValueFrom(
            this.http.get(`${process.env.API}cities`, apiConfig())
        );

        return data;
    }

    async getCityById(id: number | string): Promise<{ id: number; name: string }> {
        const { data } = await firstValueFrom(
            this.http.get(`${process.env.API}cities/${id}`, apiConfig())
        );

        return data;
    }
}