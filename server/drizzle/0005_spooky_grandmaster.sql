CREATE TABLE "alerts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"agent_id" uuid NOT NULL,
	"severity" varchar(20) NOT NULL,
	"message" text NOT NULL,
	"type" varchar(50) NOT NULL,
	"resolved_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "alerts" ADD CONSTRAINT "alerts_agent_id_agents_id_fk" FOREIGN KEY ("agent_id") REFERENCES "public"."agents"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "alerts_agent_idx" ON "alerts" USING btree ("agent_id");--> statement-breakpoint
CREATE INDEX "alerts_resolved_idx" ON "alerts" USING btree ("resolved_at");