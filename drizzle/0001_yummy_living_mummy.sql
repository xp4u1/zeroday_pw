CREATE TABLE `active_containers` (
	`id` integer PRIMARY KEY NOT NULL,
	`docker_id` text NOT NULL,
	`address` text NOT NULL,
	`user_id` integer NOT NULL,
	`challenge_id` integer NOT NULL,
	`timestamp` text DEFAULT (CURRENT_TIMESTAMP)
);
