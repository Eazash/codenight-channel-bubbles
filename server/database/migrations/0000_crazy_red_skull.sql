CREATE TABLE `channels` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`created_at` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`chat_id` text,
	`channel_username` text,
	`members` integer DEFAULT 1 NOT NULL,
	`is_private` integer DEFAULT false NOT NULL,
	`updated_at` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	CONSTRAINT "has_channel_identifier_check" CHECK("channels"."channel_username" IS NOT NULL OR "channels"."chat_id" IS NOT NULL)
);
