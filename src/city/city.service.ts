import { Injectable } from "@nestjs/common";
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class CityService {
    constructor(private readonly http: HttpService) { }

    async getCities(): Promise<{ id: number; name: string }[]> {
        const { data } = await firstValueFrom(
            this.http.get(`${process.env.API}cities`, {
                headers: {
                    "x-api-key": process.env.API_KEY
                }
            })
        );

        return data; 
    }
}