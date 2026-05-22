CREATE TABLE `consumption_events` (
	`id` text PRIMARY KEY NOT NULL,
	`wine_id` text NOT NULL,
	`consumed_at` text NOT NULL,
	`occasion` text,
	`rating` integer,
	`tasting_note` text,
	`created_at` text NOT NULL,
	FOREIGN KEY (`wine_id`) REFERENCES `wines`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `wines` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`producer` text NOT NULL,
	`vintage` integer,
	`type` text NOT NULL,
	`varietal` text,
	`region` text,
	`appellation` text,
	`country` text,
	`quantity` integer DEFAULT 1 NOT NULL,
	`format` text DEFAULT '750ml',
	`storage_location` text,
	`purchase_price` real,
	`purchase_date` text,
	`purchase_source` text,
	`drink_from` text,
	`drink_by` text,
	`notes` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`status` text DEFAULT 'in_cellar' NOT NULL
);
