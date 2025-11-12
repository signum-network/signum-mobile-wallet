PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_account-public-keys` (
	`account` text PRIMARY KEY NOT NULL,
	`publicKey` text NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_account-public-keys`("account", "publicKey") SELECT "account", "publicKey" FROM `account-public-keys`;--> statement-breakpoint
DROP TABLE `account-public-keys`;--> statement-breakpoint
ALTER TABLE `__new_account-public-keys` RENAME TO `account-public-keys`;--> statement-breakpoint
PRAGMA foreign_keys=ON;