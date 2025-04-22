PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_active_containers` (
	`id` integer PRIMARY KEY NOT NULL,
	`docker_id` text NOT NULL,
	`address` text NOT NULL,
	`user_id` text NOT NULL,
	`challenge_id` integer NOT NULL,
	`timestamp` text DEFAULT (CURRENT_TIMESTAMP)
);
--> statement-breakpoint
INSERT INTO `__new_active_containers`("id", "docker_id", "address", "user_id", "challenge_id", "timestamp") SELECT "id", "docker_id", "address", "user_id", "challenge_id", "timestamp" FROM `active_containers`;--> statement-breakpoint
DROP TABLE `active_containers`;--> statement-breakpoint
ALTER TABLE `__new_active_containers` RENAME TO `active_containers`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_solves` (
	`id` integer PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`challenge_id` integer NOT NULL,
	`timestamp` text DEFAULT (CURRENT_TIMESTAMP)
);
--> statement-breakpoint
INSERT INTO `__new_solves`("id", "user_id", "challenge_id", "timestamp") SELECT "id", "user_id", "challenge_id", "timestamp" FROM `solves`;--> statement-breakpoint
DROP TABLE `solves`;--> statement-breakpoint
ALTER TABLE `__new_solves` RENAME TO `solves`;