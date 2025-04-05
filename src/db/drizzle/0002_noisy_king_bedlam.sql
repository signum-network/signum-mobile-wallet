CREATE TABLE `account-public-keys` (
	`id` text PRIMARY KEY NOT NULL,
	`account` text NOT NULL,
	`publicKey` text NOT NULL
);
