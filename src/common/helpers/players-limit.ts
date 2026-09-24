import localse from "../../common/locales/text.json";

export type PlayersLimit = { min: number; max: number };

export const DEFAULT_LIMIT: PlayersLimit = { min: 4, max: 10 };

// limit of players from city fields (playersMin / playersMax), default 4-10
export const getPlayersLimit = (city?: { playersMin?: number | null; playersMax?: number | null } | null): PlayersLimit => {
    const min = city?.playersMin ?? DEFAULT_LIMIT.min;
    const max = city?.playersMax ?? DEFAULT_LIMIT.max;

    return { min, max: Math.max(min, max) };
}

export const isValidPlayers = (number: number, limit: PlayersLimit = DEFAULT_LIMIT) => {
    const { min, max } = limit;

    return !isNaN(number) && number >= min && number <= max;
}

const withLimit = (text: string, limit: PlayersLimit = DEFAULT_LIMIT) => {
    const { min, max } = limit;

    return text.replace('${min}', `${min}`).replace('${max}', `${max}`);
}

export const textQuantityPlayers = (limit?: PlayersLimit) => withLimit(localse.quantityPlayers, limit);

export const textLimitPlayers = (limit?: PlayersLimit) => withLimit(localse.textLimitPlayers, limit);
