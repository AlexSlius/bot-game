import localse from "../../common/locales/text.json";

const DEFAULT_LIMIT = { min: 4, max: 10 };

// cityId -> custom limit of players
const CITY_LIMITS: Record<number, { min: number; max: number }> = {
    6: { min: 4, max: 12 },
};

export const getPlayersLimit = (cityId?: number | string) => {
    return CITY_LIMITS[Number(cityId)] || DEFAULT_LIMIT;
}

export const isValidPlayers = (number: number, cityId?: number | string) => {
    const { min, max } = getPlayersLimit(cityId);

    return !isNaN(number) && number >= min && number <= max;
}

const withLimit = (text: string, cityId?: number | string) => {
    const { min, max } = getPlayersLimit(cityId);

    return text.replace('${min}', `${min}`).replace('${max}', `${max}`);
}

export const textQuantityPlayers = (cityId?: number | string) => withLimit(localse.quantityPlayers, cityId);

export const textLimitPlayers = (cityId?: number | string) => withLimit(localse.textLimitPlayers, cityId);
