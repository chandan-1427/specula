ALTER TABLE "agents" ALTER COLUMN "last_seen" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "agents" ALTER COLUMN "last_seen" SET NOT NULL;