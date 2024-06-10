CREATE TABLE `distribution-amounts` (
	`id` text PRIMARY KEY NOT NULL,
	`account` text NOT NULL,
	`amountNQT` text NOT NULL,
	`quantityQNT` text
);
--> statement-breakpoint
CREATE TABLE `tokens` (
	`id` text PRIMARY KEY NOT NULL,
	`ticker` text NOT NULL,
	`description` text,
	`decimals` integer NOT NULL,
	`account` text NOT NULL,
	`issuer` text NOT NULL,
	`mintable` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `tokens-transactional-data` (
	`id` text,
	`priceNQT` text NOT NULL,
	FOREIGN KEY (`id`) REFERENCES `tokens`(`id`) ON UPDATE no action ON DELETE cascade
);
