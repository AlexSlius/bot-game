interface GameRegistrationSession {
    step: number;
    data: {
        teamName?: string;
        captainName?: string;
        playerCount?: number;
        contact?: any;
        wishes?: string;
    };
}