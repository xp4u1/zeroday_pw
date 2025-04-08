CREATE TABLE `categories` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `categories_name_unique` ON `categories` (`name`);--> statement-breakpoint
CREATE TABLE `challenges` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`flag` text NOT NULL,
	`docker_image` text NOT NULL,
	`category_id` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `challenges_name_unique` ON `challenges` (`name`);--> statement-breakpoint
CREATE TABLE `solves` (
	`id` integer PRIMARY KEY NOT NULL,
	`user_id` integer NOT NULL,
	`challenge_id` integer NOT NULL,
	`timestamp` text DEFAULT (CURRENT_TIMESTAMP)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_name_unique` ON `users` (`name`);