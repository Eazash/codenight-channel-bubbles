PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_channels` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text,
	`created_at` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`chat_id` text,
	`channel_username` text,
	`members` integer DEFAULT 1 NOT NULL,
	`is_private` integer DEFAULT false NOT NULL,
	`updated_at` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	CONSTRAINT "has_channel_identifier_check" CHECK("__new_channels"."channel_username" IS NOT NULL OR "__new_channels"."chat_id" IS NOT NULL)
);
--> statement-breakpoint
INSERT INTO `__new_channels`("id", "name", "created_at", "chat_id", "channel_username", "members", "is_private", "updated_at") SELECT "id", "name", "created_at", "chat_id", "channel_username", "members", "is_private", "updated_at" FROM `channels`;--> statement-breakpoint
DROP TABLE `channels`;--> statement-breakpoint
ALTER TABLE `__new_channels` RENAME TO `channels`;--> statement-breakpoint
PRAGMA foreign_keys=ON;