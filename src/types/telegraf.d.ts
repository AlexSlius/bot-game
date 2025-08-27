import "telegraf";

declare module "telegraf" {
    interface ExtraReplyMessage {
        reply_to_message_id?: number;
    }
}