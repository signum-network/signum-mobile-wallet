CREATE TABLE `tokens` (
	`id` text PRIMARY KEY NOT NULL,
	`ticker` text NOT NULL,
	`description` text NOT NULL,
	`decimals` integer NOT NULL,
	`issuerId` text NOT NULL,
	`isMintable` integer NOT NULL
);
