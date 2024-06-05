CREATE TABLE `tokens` (
	`id` text PRIMARY KEY NOT NULL,
	`ticker` text NOT NULL,
	`description` text,
	`decimals` integer NOT NULL,
	`issuer` text NOT NULL,
	`mintable` integer NOT NULL
);
