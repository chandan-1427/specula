ALTER TABLE "agents" ADD COLUMN "current_method" varchar(50);--> statement-breakpoint
ALTER TABLE "agents" ADD COLUMN "metadata" jsonb DEFAULT '{}'::jsonb;