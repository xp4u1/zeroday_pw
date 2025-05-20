CREATE TABLE `active_sandboxes` (
	`id` integer PRIMARY KEY NOT NULL,
	`helm_name` text NOT NULL,
	`address` text NOT NULL,
	`user_id` text NOT NULL,
	`challenge_id` integer NOT NULL,
	`timestamp` text DEFAULT (CURRENT_TIMESTAMP)
);
--> statement-breakpoint
DROP TABLE `active_containers`;--> statement-breakpoint
ALTER TABLE `challenges` ADD `helm_values` text NOT NULL;--> statement-breakpoint
ALTER TABLE `challenges` DROP COLUMN `docker_image`;