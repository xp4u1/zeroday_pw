PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_challenges` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`flag` text NOT NULL,
	`points` integer DEFAULT 500 NOT NULL,
	`docker_image` text NOT NULL,
	`category_id` integer NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_challenges`("id", "name", "description", "flag", "points", "docker_image", "category_id") SELECT "id", "name", "description", "flag", "points", "docker_image", "category_id" FROM `challenges`;--> statement-breakpoint
DROP TABLE `challenges`;--> statement-breakpoint
ALTER TABLE `__new_challenges` RENAME TO `challenges`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `challenges_name_unique` ON `challenges` (`name`);--> statement-breakpoint
ALTER TABLE `users` ADD `points` integer DEFAULT 0 NOT NULL;